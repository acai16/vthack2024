from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, jsonify, request
from flask_cors import CORS
from birdnetlib import Recording
from birdnet_service import Bird_Analyzer
from birdnetlib.analyzer import Analyzer

app = Flask(__name__)
CORS(app)

blob = ""
coordinates = {}
uri = "mongodb+srv://admin:admin@cluster0.xswxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

@app.route('/')
def index():
    return jsonify(message = "Welcome to the Aviate API")

@app.route('/api/getblob', methods = ["POST"])
def retrieve_blob():
    global blob
    data = request.json 
    try:
        blob = data.get('blob')
        assert blob is not None
        base64_string = blob
        # blob.split(',', 1)[1]
        b_a = Bird_Analyzer()
        # highest_bird = b_a.analyze_from_base64(base64_string)
        base64_string = base64_string + '=' * (-len(base64_string) % 4)
        print(f"Blob acquired: {base64_string}")
        decoded_audio_file = b_a.decode_and_get_info(base64_string)
        decoded_audio_file = decoded_audio_file.replace('//', '/')
        decoded_audio_file = r"C:\Users\prana\CS Projects\intro_to_flask\decoded_sample2.mp3"
        print(f"Decoded audio file {decoded_audio_file}")
        analyzer = Analyzer()
        recording = Recording(analyzer, decoded_audio_file)
        try:
            # Analyze the audio recording
            recording.analyze()
            # Print the results
            print(f"Detections: {recording.detections}")
        except Exception as e:
            print(f"Error during analysis: {e}")

        # print("Highest bird:", highest_bird)
        
        return jsonify(message="Blob successfully received and stored")
    except:
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