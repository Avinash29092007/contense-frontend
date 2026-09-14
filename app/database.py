import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI environment variable is not set")

client = MongoClient(MONGO_URI)

db = client["contense"]

users_collection = db["users"]
topics_collection = db["topics"]
tasks_collection = db["tasks"]
completions_collection = db["completions"]

def test_mongodb():
    try:
        client.admin.command("ping")
        return True
    except Exception as e:
        print("MongoDB connection failed:", e)
        return False
