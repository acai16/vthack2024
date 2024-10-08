from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, jsonify, request
from flask_cors import CORS

# from birdnetlib import Recording
from birdnet_service import Bird_Analyzer

# from birdnetlib.analyzer import Analyzer
from mongodb_service import MongodbService
import subprocess
import os
from dotenv import load_dotenv
import json

app = Flask(__name__)
CORS(app)
b_a = Bird_Analyzer()

blob = ""
coordinates = {}
DATABASE = "mflix"
mongo_service = MongodbService(DATABASE)


@app.route("/")
def index():
    return jsonify(message="Welcome to the Aviate API")


@app.route("/api/getblob", methods=["POST"])
def retrieve_blob():
    global blob
    data = request.json
    highest_bird = {}
    try:
        blob = data.get("blob")
        assert blob is not None
        reencoded_audio_file = convert_blob_to_file(blob)
        # Analyze the re-encoded audio recording

        try:
            highest_bird, detections = b_a.analyze(reencoded_audio_file)
            if highest_bird:
                print(f"Detected bird: {highest_bird}")
                print("Detections:")
                print(json.dumps(detections, indent=4))

        except Exception as e:
            print(f"Error During analysis: {e}")

        try:
            if highest_bird:
                # Store the analysis in MongoDB
                print("Uploading to MongoDB...")
                document_id = mongo_service.upload_file(
                    reencoded_audio_file, highest_bird, {}
                )

                print("printing document id")
                print(f"Document ID: {document_id}")
                return jsonify(message=document_id)
        except Exception as e:
            print(f"Error during mongo upload: {e}")

        return jsonify(
            message="Blob successfully received but not stored due to bird not detected"
        )
    except Exception as e:
        print(f"Error: {e}")
        raise ValueError("Error: Something wrong with blob unlucky gg go next")


@app.route("/api/start_hike/<string:user_id>", methods=["GET"])
def start_hike(user_id):
    try:
        hike_id = mongo_service.start_hike(user_id)
        return jsonify(message="Hike started successfully", hike_id=str(hike_id))
    except Exception as e:
        return jsonify(message=str(e)), 500


@app.route("/api/seen_bird/<string:user_id>/<string:bird_id>", methods=["GET"])
def seen_bird(user_id, bird_id):
    try:
        result = mongo_service.seen_bird(user_id, bird_id)
        if not result:
            return jsonify(message="Bird not seen successfully")
        print(f"Bird Id: {bird_id}")
        bird = mongo_service.get_bird(bird_id)
        print(bird)
        return jsonify(message=f"Bird seen successfully {bird}")
    except Exception as e:
        return jsonify(message=str(e)), 500


@app.route("/api/end_hike/<string:user_id>/<int:hike_length>", methods=["GET"])
def end_hike(user_id, hike_length):
    try:
        hike_id = mongo_service.end_hike(user_id, hike_length)
        return jsonify(message="Hike ended successfully")
    except Exception as e:
        return jsonify(message=str(e)), 500


@app.route("/api/get_hikes_from_id/<string:user_id>", methods=["GET"])
def get_hikes(user_id):
    try:
        hikes = mongo_service.fetch_user_hikes(user_id)
        return jsonify(message="Hikes retrieved successfully", hikes=hikes)
    except Exception as e:
        print(f"Error in get_hikes: {str(e)}")  # Log the error
        return jsonify(message=f"An error occurred: {str(e)}"), 500


@app.route("/api/get_bird_audio/<string:audio_id>", methods=["GET"])
def get_bird_audio(audio_id):
    try:
        mongo_service.download_file(audio_id)
        return jsonify(message="Bird Sound retrieved successfully")
    except Exception as e:
        return jsonify(message=str(e)), 500


@app.route("/api/get_bird_info/<string:bird_id>", methods=["GET"])
def get_bird_info(bird_id):
    try:
        bird_info = mongo_service.get_bird(bird_id)
        return jsonify(message="Bird info retrieved successfully", bird_info=bird_info)
    except Exception as e:
        return jsonify(message=str(e)), 500


@app.route("/api/get_bird_info_from_file/<string:file_id>", methods=["GET"])
def find_bird_info_by_file_id(file_id):
    try:
        bird_info = mongo_service.find_bird_from_file_id(file_id)
        return jsonify(message="Bird info retrieved successfully", bird_info=bird_info)
    except Exception as e:
        return jsonify(message=str(e)), 500


# localhost:5000
# @app.route("/api/analyze", methods=["GET"])
# def analyze_sounds():
#     global client
#     try:
#         client.admin.command("ping")
#         print("Pinged your deployment. You successfully connected to MongoDB!")
#     except Exception as e:
#         raise ValueError("Connection Unsuccessful")

#     client.admin.command("ping")
#     print("Pinged your deployment. You successfully connected to MongoDB!")

#     db = client[""]
#     collection = db["your_collection_name"]
#     data = collection.find_one()

#     return jsonify(message="Analysis complete", data=data)


@app.route("/api/delete_hike/<string:hike_id>", methods=["DELETE"])
def delete_hikes(hike_id):
    try:
        mongo_service.delete_hikes(hike_id)
        return jsonify(message="Hike deleted successfully")
    except Exception as e:
        return jsonify(message=str(e)), 500


def convert_blob_to_file(blob):
    base64_string = blob
    base64_string = base64_string + "=" * (-len(base64_string) % 4)
    # print(f"Blob acquired: {base64_string}")

    # Decode base64 string and get the audio file path

    decoded_audio_file = b_a.decode_and_get_info(base64_string)
    decoded_audio_file = decoded_audio_file.replace("//", "/")
    print(f"Decoded audio file {decoded_audio_file}")

    # Re-encode the audio file to ensure valid structure
    reencoded_audio_file = decoded_audio_file.replace(".mp3", "_reencoded.mp3")

    load_dotenv()
    from_env_path = os.environ.get("FFMPEG_PATH")

    # ffmpeg_path = r"C:\ffmpeg\ffmpeg-7.0.2-essentials_build\bin\ffmpeg.exe"
    ffmpeg_path = f"{from_env_path}"
    try:
        subprocess.run(
            [
                ffmpeg_path,
                "-i",
                decoded_audio_file,
                "-acodec",
                "libmp3lame",
                "-ab",
                "192k",
                reencoded_audio_file,
            ],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        print(f"Re-encoded audio file {reencoded_audio_file}")

        return reencoded_audio_file
    except subprocess.CalledProcessError as e:
        print(f"Error during re-encoding: {e}")