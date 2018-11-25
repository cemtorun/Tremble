# Arrays storing hand data
globalArr = []
mariArr = {'x':[],'y':[],'z':[],'pitch':[],'roll':[],'yaw':[]}
# Leap Motion libraries
import requests
import Leap, sys, thread, time
from Leap import CircleGesture, KeyTapGesture, ScreenTapGesture, SwipeGesture
# Algorithm & Data libraries
import pandas as pd
import numpy as np

class MainListener(Leap.Listener):

    def on_init(self, controller):
        print "Initialized"

    def on_connect(self, controller):
        print "Connected"

        # Enable gestures
        controller.enable_gesture(Leap.Gesture.TYPE_CIRCLE);
        controller.enable_gesture(Leap.Gesture.TYPE_KEY_TAP);
        controller.enable_gesture(Leap.Gesture.TYPE_SCREEN_TAP);
        controller.enable_gesture(Leap.Gesture.TYPE_SWIPE);

    def on_disconnect(self, controller):
        # Note: not dispatched when running in a debugger.
        print "Disconnected"

    def on_exit(self, controller):
        print "Exited"

    def on_frame(self, controller):
        global globalArr
        global mariArr
        # Get the most recent frame and report some basic information
        frame = controller.frame()

        print "Frame id: %d, timestamp: %d, hands: %d, fingers: %d, tools: %d, gestures: %d" % (
              frame.id, frame.timestamp, len(frame.hands), len(frame.fingers), len(frame.tools), len(frame.gestures()))

        # Get hands
        for hand in frame.hands:

            handType = "Left hand" if hand.is_left else "Right hand"

            print "  %s, id %d, position: %s" % (
                handType, hand.id, hand.palm_position)

            # Get the hand's normal vector and direction
            normal = hand.palm_normal
            direction = hand.direction

            dataPitch = direction.pitch * Leap.RAD_TO_DEG
            dataRoll = normal.roll * Leap.RAD_TO_DEG
            dataYaw = direction.yaw * Leap.RAD_TO_DEG
            datapos = hand.palm_position

            mariArr['x'].append(datapos[0])
            mariArr['y'].append(datapos[1])
            mariArr['z'].append(datapos[2])
            mariArr['pitch'].append(dataPitch)
            mariArr['roll'].append(dataRoll)
            mariArr['yaw'].append(dataYaw)
            url = 'https://utils.lib.id/kv/set/'
            headers = {'Authorization': 'Bearer FsMmgV7ypwVF4_sNHnoTD8C-E0CHmQ5_ZOG0k0VRxGeDS8_Kq8zJgdwA25rvIMjp'}
            frequency = (datapos[1] + datapos[0] + datapos[2] + dataPitch + dataRoll + dataYaw)/6
            # data = {'timestamp':frame.timestamp,'frequency':frequency}
            data = {'key': 'data', 'value': {'timestamp': frame.timestamp, 'frequency': frequency}}
            kek = requests.post(url, json=data, headers=headers)
            print kek
            globalArr.append(data)

            # Calculate the hand's pitch, roll, and yaw angles
            print "  pitch: %f degrees, roll: %f degrees, yaw: %f degrees" % (
                direction.pitch * Leap.RAD_TO_DEG,
                normal.roll * Leap.RAD_TO_DEG,
                direction.yaw * Leap.RAD_TO_DEG)

            # Get arm bone
            arm = hand.arm
            print "  Arm direction: %s, wrist position: %s, elbow position: %s" % (
                arm.direction,
                arm.wrist_position,
                arm.elbow_position)

            # Get fingers
            for finger in hand.fingers:

                print "    %s finger, id: %d, length: %fmm, width: %fmm" % (
                    self.finger_names[finger.type],
                    finger.id,
                    finger.length,
                    finger.width)

                # Get bones
                for b in range(0, 4):
                    bone = finger.bone(b)
                    print "      Bone: %s, start: %s, end: %s, direction: %s" % (
                        self.bone_names[bone.type],
                        bone.prev_joint,
                        bone.next_joint,
                        bone.direction)

        # Get tools
        for tool in frame.tools:

            print "  Tool id: %d, position: %s, direction: %s" % (
                tool.id, tool.tip_position, tool.direction)

        # Get gestures
        for gesture in frame.gestures():
            if gesture.type == Leap.Gesture.TYPE_CIRCLE:
                circle = CircleGesture(gesture)

                # Determine clock direction using the angle between the pointable and the circle normal
                if circle.pointable.direction.angle_to(circle.normal) <= Leap.PI/2:
                    clockwiseness = "clockwise"
                else:
                    clockwiseness = "counterclockwise"

                # Calculate the angle swept since the last frame
                swept_angle = 0
                if circle.state != Leap.Gesture.STATE_START:
                    previous_update = CircleGesture(controller.frame(1).gesture(circle.id))
                    swept_angle =  (circle.progress - previous_update.progress) * 2 * Leap.PI

                print "  Circle id: %d, %s, progress: %f, radius: %f, angle: %f degrees, %s" % (
                        gesture.id, self.state_names[gesture.state],
                        circle.progress, circle.radius, swept_angle * Leap.RAD_TO_DEG, clockwiseness)

            if gesture.type == Leap.Gesture.TYPE_SWIPE:
                swipe = SwipeGesture(gesture)
                print "  Swipe id: %d, state: %s, position: %s, direction: %s, speed: %f" % (
                        gesture.id, self.state_names[gesture.state],
                        swipe.position, swipe.direction, swipe.speed)

            if gesture.type == Leap.Gesture.TYPE_KEY_TAP:
                keytap = KeyTapGesture(gesture)
                print "  Key Tap id: %d, %s, position: %s, direction: %s" % (
                        gesture.id, self.state_names[gesture.state],
                        keytap.position, keytap.direction )

            if gesture.type == Leap.Gesture.TYPE_SCREEN_TAP:
                screentap = ScreenTapGesture(gesture)
                print "  Screen Tap id: %d, %s, position: %s, direction: %s" % (
                        gesture.id, self.state_names[gesture.state],
                        screentap.position, screentap.direction )

        if not (frame.hands.is_empty and frame.gestures().is_empty):
            print ""

    def state_string(self, state):
        if state == Leap.Gesture.STATE_START:
            return "STATE_START"

        if state == Leap.Gesture.STATE_UPDATE:
            return "STATE_UPDATE"

        if state == Leap.Gesture.STATE_STOP:
            return "STATE_STOP"

        if state == Leap.Gesture.STATE_INVALID:
            return "STATE_INVALID"

    # Calculates the derivative of each value x at index i+1 and x at index i
    # col: an array of column values from 'x', 'y', 'z', 'pitch', 'roll', 'yaw'
    def derivative(self, col, samp_freq):
        arr = []
        for i in range(len(col)-1):
            arr.append((col[i+1] - col[i])/samp_freq)
        return arr

    def fourier(self, timestep, data):
        N = len(data)//2
        freq = np.fft.fftfreq(len(data), d=timestep)[:N]
        fft = np.fft.fft(data)[:N]
        amp = np.abs(fft)/N
        order = np.argsort(amp)[::-1]
        return freq[order]



def main():

    global globalArr
    global mariArr

    # Create a sample listener and controller
    listener = SampleListener()
    controller = Leap.Controller()

    # Have the sample listener receive events from the controller
    controller.add_listener(listener)

    # Keep this process running until Enter is pressed
    print "Press Enter to quit..."
    try:

        sys.stdin.readline()

    except KeyboardInterrupt:
        pass
    finally:
        # Remove the sample listener when done
        controller.remove_listener(listener)
        print mariArr

        # Create dataframe
        df = pd.DataFrame(mariArr)

        # Number of frames
        n = len(df)
        # 10 sec fixed time intervals
        time = 10

        # Calculate the sample frequency of the data
        samp_freq = n/time
        # Store all the column value
        columns = []

        for key, value in df.items():
            columns.append(list(value))

        # Create an array of first derivative values
        deriv1 = []
        for i in range(len(columns)):
            print(columns[i])
            deriv1.append(derivative(columns[i], samp_freq))
        print('First Derivative values:', deriv1)

        # Create an array of second derivative values from first derivative values
        deriv2 = []
        for i in range(len(deriv1)):
            deriv2.append(derivative(deriv1[i], samp_freq))
        print('Second Derivative values:', deriv2)

        # Generate and store the FFT values
        final_fft = []
        for i in range(len(deriv2)):
            #print(deriv2[i])
            fft_vals = np.fft.fft(deriv2[i])
            #print("{0} : {1}".format(i, fft_vals))
            final_fft.append(fft_vals)

        print(final_fft)

        # Plot the FFT values from the array
        import matplotlib.pyplot as plt
        sum = 0
        for i in range(len(deriv2)):
            result = fourier(0.06, deriv2[i])
            print(result[0])
            sum += result[0]
        print("Result:",sum/len(deriv2))

if __name__ == "__main__":
    main()
