from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify(message = "Welcome to the Aviate API")

@app.route('/api/coordinates', methods=['POST'])
def receive_coordinates():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    return jsonify(f"{latitude} {longitude}")


