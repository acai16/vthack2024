from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

coordinates = {}
uri = "mongodb+srv://admin:admin@cluster0.xswxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))

@app.route('/')
def index():
    return jsonify(message = "Welcome to the Aviate API")

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


# @app.route('/api/coordinates', methods=['POST'])
# def receive_coordinates():
#     global coordinates
#     data = request.json
#     try:
#         latitude = data.get('latitude')
#         longitude = data.get('longitude')

#         assert latitude is not None and longitude is not None
    
#     except:
#         raise ValueError("Error: Latitude or Longitude does not exist")

#     coordinates = {"latitude" : latitude, "longitude": longitude}
#     return jsonify(message = "Coordinates received and stored")