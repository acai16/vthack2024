from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, jsonify, request
from flask_cors import CORS
from birdnetlib import Recording
from birdnet_service import Bird_Analyzer
from birdnetlib.analyzer import Analyzer
import subprocess
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

blob = ""
coordinates = {}
uri = "mongodb+srv://admin:admin@cluster0.xswxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

@app.route('/')
def index():
    return jsonify(message = "Welcome to the Aviate API")

@app.route('/api/getblob', methods=["POST"])
def retrieve_blob():
    global blob
    data = request.json 
    try:
        blob = data.get('blob')
        assert blob is not None
        base64_string = blob
        base64_string = base64_string + '=' * (-len(base64_string) % 4)
        print(f"Blob acquired: {base64_string}")

        # Decode base64 string and get the audio file path
        b_a = Bird_Analyzer()
        decoded_audio_file = b_a.decode_and_get_info(base64_string)
        decoded_audio_file = decoded_audio_file.replace('//', '/')
        print(f"Decoded audio file {decoded_audio_file}")

        # Re-encode the audio file to ensure valid structure
        reencoded_audio_file = decoded_audio_file.replace('.mp3', '_reencoded.mp3')

        load_dotenv()
        from_env_path= os.environ.get('FFMPEG_PATH')

        # ffmpeg_path = r"C:\ffmpeg\ffmpeg-7.0.2-essentials_build\bin\ffmpeg.exe"
        ffmpeg_path = f"{from_env_path}"
        try:
            subprocess.run([
                ffmpeg_path, '-i', decoded_audio_file,
                '-acodec', 'libmp3lame', '-ab', '192k', reencoded_audio_file
            ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print(f"Re-encoded audio file {reencoded_audio_file}")
        except subprocess.CalledProcessError as e:
            print(f"Error during re-encoding: {e}")

        # Analyze the re-encoded audio recording
        analyzer = Analyzer()
        recording = Recording(analyzer, reencoded_audio_file)
        try:
            recording.analyze()
            print(f"Detections: {recording.detections}")
        except Exception as e:
            print(f"Error during analysis: {e}")

        return jsonify(message="Blob successfully received and stored")
    except Exception as e:
        print(f"Error: {e}")
        raise ValueError("Error: Something wrong with blob unlucky gg go next")

#localhost:5000
@app.route('/api/analyze', methods=['GET'])
def analyze_sounds():
    global client
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        raise ValueError("Connection Unsuccessful")

    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")

    db = client['']
    collection = db['your_collection_name']
    data = collection.find_one()
    
    return jsonify(message="Analysis complete", data=data)  


@app.route('/api/coordinates', methods=['POST'])
def receive_coordinates():
    global coordinates
    data = request.json
    try:
        latitude = data.get('latitude')
        longitude = data.get('longitude')

        assert latitude is not None and longitude is not None
    
    except:
        raise ValueError("Error: Latitude or Longitude does not exist")

    coordinates = {"latitude" : latitude, "longitude": longitude}
    return jsonify(message = "Coordinates received and stored")