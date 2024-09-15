import gridfs
from datetime import datetime
from pymongo import MongoClient, DESCENDING
from bson.objectid import ObjectId


class MongodbService:
    def __init__(self, db_name):
        self.mongo_db_uri = "mongodb+srv://admin:admin@cluster0.xswxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        self.client = MongoClient(self.mongo_db_uri)
        self.db = self.client.get_database(db_name)
        self.bucket = gridfs.GridFSBucket(self.db)

    def upload_file(self, file_path, bird_dict, hike_dict):
        print("initializing collections")
        bird_info_collection = self.db["bird_info"]
        hiker_info_collection = self.db["hike_info"]
        print("opening file")
        with open(file_path, "rb") as file:
            # Upload the file to GridFS
            file_id = self.bucket.upload_from_stream(
                file_path, file, metadata={"contentType": "audio/mpeg"}
            )

        print("opening dictionaries")
        bird_dict["file_id"] = file_id
        hike_dict["user_id"] = "temp"
        print("inserting dictionaries")
        bird_info_obj_id = bird_info_collection.insert_one(bird_dict)

        print(f"Uploaded file with ID: {file_id}")
        print(f"Bird Object ID: {bird_info_obj_id}")
        print("exiting upload method")
        return file_id

    def download_file(self, document_id):
        document_id = ObjectId(document_id)
        downloaded_file = self.bucket.open_download_stream(document_id)
        file_name = "../../src/assets/audio/bird_sound.mp3"
        with open(file_name, "wb") as file:
            file.write(downloaded_file.read())
            print("File downloaded successfully.")

        return file_name

    def start_hike(self, user_id):
        hikes = self.db["hikes"]
        hike_id = hikes.insert_one(
            {
                "user_id": user_id,
                "birds_seen": [],
                "time_started": datetime.now(),
                "length": 0,
            }
        ).inserted_id

        return hike_id

    def seen_bird(self, user_id, bird_id):
        """
        Find the most recent hike with a length of 0 and the given user_id,
        and update its birds_seen array by appending the bird_id.
        """
        hikes = self.db["hikes"]

        # Find the most recent hike with length == 0 and the given user_id
        most_recent_hike = hikes.find_one(
            {"user_id": user_id, "length": 0}, sort=[("time_started", DESCENDING)]
        )

        if most_recent_hike:
            print(f"Most recent hike: {most_recent_hike}")
            # Append bird_id to the birds_seen array
            hikes.update_one(
                {"_id": most_recent_hike["_id"]},
                {"$push": {"birds_seen": ObjectId(bird_id)}},
            )
            print(f"Updated hike {most_recent_hike['_id']} with bird {bird_id}")
        else:
            print("No recent hike found with length 0.")

    def end_hike(self, user_id, length_of_hike):
        """
        Find the most recent hike with a length of 0 and the given user_id,
        and update its length field to the given length_of_hike.
        """
        hikes = self.db["hikes"]

        # Find the most recent hike with length == 0 and the given user_id
        most_recent_hike = hikes.find_one(
            {"user_id": user_id, "length": 0}, sort=[("time_started", DESCENDING)]
        )

        if most_recent_hike:
            # Update the length field
            hikes.update_one(
                {"_id": most_recent_hike["_id"]}, {"$set": {"length": length_of_hike}}
            )
            print(
                f"Updated hike {most_recent_hike['_id']} with length {length_of_hike}"
            )
        else:
            print("No recent hike found with length 0.")

    def get_bird(self, bird_id):
        bird_info_collection = self.db["bird_info"]
        bird = bird_info_collection.find_one({"_id": ObjectId(bird_id)})
        if bird:
            bird_info = {
                "common_name": bird.get("common_name", "Unknown"),
                "scientific_name": bird.get("scientific_name", "Unknown"),
                "start_time": bird.get("start_time", "N/A"),
                "end_time": bird.get("end_time", "N/A"),
                "confidence": bird.get("confidence", "N/A"),
                "label": bird.get("label", "N/A"),
                "file_id": str(bird["file_id"]) if "file_id" in bird else "N/A",
            }
            return bird_info
        return None

    def fetch_user_hikes(self, user_id, test=False):
        hikes_collection = self.db["hikes"]

        # Find all hikes for the user
        user_hikes = hikes_collection.find({"user_id": user_id})

        result = []
        for hike in user_hikes:
            print("HIKE ======================")
            print(f"Hike: {hike}")
            print("HIKE ======================")
            hike_info = {
                "hike_id": str(hike["_id"]),
                "time_started": hike["time_started"].strftime("%Y-%m-%d %H:%M:%S"),
                "length": hike["length"],
                "birds_seen": [],
            }

            # Get bird info for each bird ID in the birds_seen array
            for bird_id in hike["birds_seen"]:
                hike_info["birds_seen"].append(bird_id)

            result.append(hike_info)

        # Pretty print the result
        if test:
            for hike in result:
                print(f"Hike ID: {hike['hike_id']}")
                print(f"  Started at: {hike['time_started']}")
                print(f"  Length: {hike['length']} km")
                print("  Birds Seen:")
                for bird in hike["birds_seen"]:
                    print(f"    - Common Name: {bird['common_name']}")
                    print(f"      Scientific Name: {bird['scientific_name']}")
                    print(f"      Start Time: {bird['start_time']} seconds")
                    print(f"      End Time: {bird['end_time']} seconds")
                    print(f"      Confidence: {bird['confidence']}")
                    print(f"      Label: {bird['label']}")
                    print(f"      Audio File ID: {bird['file_id']}")
                print("\n")

        return result

    def delete_hikes(self, hike_id):
        hikes = self.db["hikes"]
        hike = hikes.find_one({"_id": ObjectId(hike_id)})
        for bird_id in hike["birds_seen"]:
            self.db["bird_info"].delete_one({"_id": ObjectId(bird_id)})
        hikes.delete_one({"_id": ObjectId(hike_id)})


"""
TESTING
"""
# mongo = MongodbService("mflix")
# # file_id = mongo.upload_file("RECORDINGS/test1.mp3", {}, {})
# # print(file_id)
# # print(type(file_id))
# downloaded_file = mongo.download_file(
#     "66e601500122b2880f236491"
# )  # "66e601500122b2880f236491"
# print(downloaded_file)

# mongo.start_hike("some_user_id")
# mongo.seen_bird("some_user_id", "66e601510122b2880f236493")
# mongo.end_hike("some_user_id", 10)

# mongo.get_birds("some_user_id")
