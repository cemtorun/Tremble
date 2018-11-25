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
import matplotlib.pyplot as plt

# Calculates the derivative of each value x at index i+1 and x at index i
# col: an array of column values from 'x', 'y', 'z', 'pitch', 'roll', 'yaw'
def derivative(col, samp_freq):
    arr = []
    for i in range(len(col)-1):
        arr.append((col[i+1] - col[i])/samp_freq)
    return arr

def fourier(timestep, data):
    N = len(data)//2
    freq = np.fft.fftfreq(len(data), d=timestep)[:N]
    fft = np.fft.fft(data)[:N]
    amp = np.abs(fft)/N
    order = np.argsort(amp)[::-1]
    return freq[order]

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
            print "IMPORTANT NUMBER: %f" %(frequency)
            globalArr.append(data)

            # Calculate the hand's pitch, roll, and yaw angles
            print "  pitch: %f degrees, roll: %f degrees, yaw: %f degrees" % (
                direction.pitch * Leap.RAD_TO_DEG,
                normal.roll * Leap.RAD_TO_DEG,
                direction.yaw * Leap.RAD_TO_DEG)




    def state_string(self, state):
        if state == Leap.Gesture.STATE_START:
            return "STATE_START"

        if state == Leap.Gesture.STATE_UPDATE:
            return "STATE_UPDATE"

        if state == Leap.Gesture.STATE_STOP:
            return "STATE_STOP"

        if state == Leap.Gesture.STATE_INVALID:
            return "STATE_INVALID"




def main():

    global globalArr
    global mariArr

    # Create a sample listener and controller
    listener = MainListener()
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
        for i in xrange(len(columns)):
            deriv1.append(derivative(columns[i], samp_freq))

        # Create an array of second derivative values from first derivative values
        deriv2 = []
        for i in xrange(len(deriv1)):
            deriv2.append(derivative(deriv1[i], samp_freq))

        # Generate and store the FFT values
        final_fft = []
        for i in xrange(len(deriv2)):
            fft_vals = np.fft.fft(deriv2[i])
            final_fft.append(fft_vals)

        # Plot the FFT values from the array
        sum = 0
        for i in xrange(len(deriv2)):
            fourier_freq = fourier(0.09, deriv2[i])
            sum += fourier_freq[0]
        # Return result frequency to be analyzed

        result = sum/len(deriv2)
        url = 'https://utils.lib.id/kv/set/'
        headers = {'Authorization': 'Bearer FsMmgV7ypwVF4_sNHnoTD8C-E0CHmQ5_ZOG0k0VRxGeDS8_Kq8zJgdwA25rvIMjp'}
        data = {'key': 'data2', 'value': {'result': result}}
        kek = requests.post(url, json=data, headers=headers)
        print result

if __name__ == "__main__":
    main()
