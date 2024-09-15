from birdnetlib import Recording, RecordingFileObject
from birdnetlib.analyzer import Analyzer
from datetime import datetime
import base64
import io
import os
import tempfile


class Bird_Analyzer:
    def __init__(self, min_conf=0.50):
        # Load and initialize the BirdNET-Analyzer models.
        self.analyzer = Analyzer()
        self.min_conf = min_conf

    def decode_and_get_info(self, Base64AudioString):
        audio_bytes = base64.b64decode(Base64AudioString)
        # with open(received_audio_file, 'wb') as audio_file:
        #     audio_file.write(audio_bytes)
        # return received_audio_file
        temp_audio_file = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
        temp_audio_file.write(audio_bytes)
        temp_audio_file.flush()  # Ensure data is written to the file
        temp_audio_file.close()
        print(f"temp file name: {temp_audio_file.name}")
        return temp_audio_file.name  # Return the temp file path

    def analyze(self, file_path):
        recording = Recording(self.analyzer, file_path)
        recording.analyze()

        highest_confidence_bird = (
            None  # Start with None to signify no valid bird detected yet
        )

        for detection in recording.detections:
            # Only consider detections with confidence greater than min_conf
            if detection["confidence"] > self.min_conf:
                if highest_confidence_bird is None:  # If we haven't set any bird yet
                    highest_confidence_bird = detection
                elif detection["confidence"] > highest_confidence_bird["confidence"]:
                    highest_confidence_bird = detection

        return highest_confidence_bird, recording.detections

    # def analyze_from_base64(self, Base64AudioString):
    #     recording = self.create_recording_from_file(Base64AudioString)
    #     self.analyze_recording(recording)
    #     return recording.detections

    # def decode_base64_to_wav(self, Base64AudioString):
    #     # Decode the base64 string into bytes
    #     mp3_bytes = base64.b64decode(Base64AudioString)

    #     # Create an in-memory file object
    #     mp3_file = io.BytesIO(mp3_bytes)

    #     # Return the in-memory file object
    #     return mp3_file

    # def decode_base64_to_wav_and_save(self, Base64AudioString, file_name="audio.wav"):
    #     # Decode the base64 string into bytes
    #     mp3_bytes = base64.b64decode(Base64AudioString)
    #     try:
    #         # Save the bytes to a file
    #         file_path = os.path.join(os.getcwd(), file_name)
    #         print(f"FILE PATH HERE: {file_path}")
    #         with open(file_path, "wb") as f:
    #             f.write(mp3_bytes)
    #     except Exception as e:
    #         raise Exception("Failed to write audio file") from e

    #     return file_path

    # def create_recording_from_file(self, Base64AudioString):
    #     file_name = self.decode_base64_to_wav_and_save(Base64AudioString)
    #     return Recording(
    #         self.analyzer,
    #         file_name,
    #         lat=35.4244,  # TODO: Get the lat and lon from the frontend
    #         lon=-120.7463,
    #         date=datetime(
    #             year=2022, month=5, day=10
    #         ),  # TOOD: Get the date from the frontend (use date or week_48 )
    #         min_conf=0.50,
    #     )

    # def create_recording(self, Base64AudioString):
    #     return RecordingFileObject(
    #         self.analyzer,
    #         self.decode_base64_to_wav(Base64AudioString),
    #         lat=35.4244,  # TODO: Get the lat and lon from the frontend
    #         lon=-120.7463,
    #         date=datetime(
    #             year=2022, month=5, day=10
    #         ),  # TOOD: Get the date from the frontend (use date or week_48 )
    #         min_conf=0.50,
    #     )

    # def analyze_recording(self, recording):
    #     recording.analyze()

    #     highest_confidence_bird = {}
    #     for detection in recording.detections:
    #         if (
    #             not highest_confidence_bird
    #             or detection["confidence"] > highest_confidence_bird["confidence"]
    #         ):
    #             highest_confidence_bird = detection

    #     return highest_confidence_bird
