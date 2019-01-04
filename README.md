# Detecting Tremors Using Leap Motion

## Won best use of Data Visualization at HackWestern

The inspiration came from the recent development of therapeutic supports for physicians. One key example that come to the teams mind the need for development in being able to accurately diagnose degenerative disorders. From that, given some past knowledge two of the most major types of tumours are essential tremor (ET) and the tremor of Parkinson’s disease (PD). _ A tremor is defined as an involuntary, rhythmic, and roughly sinusoidal movement of one or more body parts._ After being able to see some of the hardware available, we realized that we could use the Leap Motion - a Human-Machine-Interface that provides a method of position tracking with extremely precise accuracy, and high throughput rate of up to 300 samples per second. From that our idea was born - Tremble.

Tremble is a diagnostic tool for physicians that allow them to more accurately detect the presence of tremors in their patients in real time providing extremely accurate data about their patients.

We built Tremble using mainly Python utilizing elements of the Leap Motion library. Additionally we used Python to develop the FFT algorithm we implemented. From there, we use Javascript and the Angular 7 framework to develop the front-end interface that the physicians will interact with.

We see great opportunity in the future development of Tremble. As of now what is a very untouched industry, as there is more data we want to be able build a machine learning model to be able to train a model to recognize different types of hand tremors and associate them with different types of tremor associated diseases along with being able to detect the severity of these diseases.
