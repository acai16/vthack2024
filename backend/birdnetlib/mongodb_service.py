import gridfs
from pymongo import MongoClient

# from bson.objectid import ObjectId


class MongodbService:
    def __init__(self, db_name):
        self.mongo_db_uri = "mongodb+srv://admin:admin@cluster0.xswxz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        self.client = MongoClient(self.mongo_db_uri)
        self.db = self.client.get_database(db_name)
        self.bucket = gridfs.GridFSBucket(self.db)

    # def __del__(self):
    #     self.client.close()

    def upload_file(self, file_path, bird_dict, hike_dict):
        bird_info_collection = self.db["bird_info"]
        hiker_info_collection = self.db["hike_info"]
        with open(file_path, "rb") as file:
            # Upload the file to GridFS
            file_id = self.bucket.upload_from_stream(
                file_path, file, metadata={"contentType": "audio/mpeg"}
            )
        bird_dict["file_id"] = file_id
        hike_dict["user_id"] = hi
        bird_info_obj_id = bird_info_collection.insert_one(bird_dict)

        print(f"Uploaded file with ID: {file_id}")
        print(f"Bird Object ID: {bird_info_obj_id}")
        print("")
        return file_id

    def download_file(self, file_id):
        downloaded_file = self.bucket.open_download_stream(file_id)
        file_name = "downloaded_" + str(file_id) + ".mp3"
        with open(file_name, "wb") as file:
            file.write(downloaded_file.read())
            print("File downloaded successfully.")

        return file_name


"""
TESTING
"""
# mongo = MongodbService("mflix")
# file_id = mongo.upload_file("RECORDINGS/test4.mp3")
# downloaded_file = mongo.download_file(file_id)
# print(downloaded_file)
