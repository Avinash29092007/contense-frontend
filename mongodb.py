import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI environment variable is not set")

client = MongoClient(MONGO_URI)

mongo_db = client["contense"]

users_collection = mongo_db["users"]
topics_collection = mongo_db["topics"]
tasks_collection = mongo_db["tasks"]
completions_collection = mongo_db["completions"]


def test_mongodb():
    try:
        client.admin.command("ping")
        return True
    except Exception as e:
        print("MongoDB connection error:", e)
        return False
