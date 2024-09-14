from birdnetlib import Recording
from birdnetlib.analyzer import Analyzer
from datetime import datetime
import os
import sys
import json

# Load and initialize the BirdNET-Analyzer models.
analyzer = Analyzer()

folder = "RECORDINGS/"
recoridng_queue = []
# Load and initialize the BirdNET-Analyzer models.
analyzer = Analyzer()

folder = "RECORDINGS/"


while True:
    filename = input(
        "\ninput file name here: "
    )  # Get the filename from command line argument

    if filename == "exit":
        break

    if not os.path.exists(folder + filename):
        print("File does not exist.")
        continue

    recording = Recording(
        analyzer,
        folder + filename,
        lat=35.4244,
        lon=-120.7463,
        date=datetime(year=2022, month=5, day=10),  # use date or week_48
        min_conf=0.25,
    )

    recoridng_queue.append(recording)

    recording.analyze()
    print("DETECTIONS INCOMING....\n\n\n\n")
    for detection in recording.detections:
        print(json.dumps(detection, indent=4))
        print()

print("\nExiting....")
