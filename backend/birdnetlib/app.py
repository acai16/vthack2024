from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # This allows cross-origin requests from your React frontend

# Example route to handle POST requests
@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.json  # Extract JSON data from the request
    print("Data received from frontend:", data)
    
    # Process the data (e.g., save to a database, manipulate it, etc.)
    
    return jsonify({"message": "Data received successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)