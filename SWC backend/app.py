#imports 
from flask import Flask, request,session, jsonify;
from flask_pymongo import PyMongo, ObjectId;
from flask_cors import CORS;
from bson.json_util import dumps, loads
from twilio.rest import Client
import random
import torch
import time
import base64
import threading
import numpy as np
import pyttsx3
import jwt
from datetime import datetime, timedelta
import cv2
from matplotlib import pyplot as plt
import subprocess
import os
import utlis
import json
from flask_jwt_extended import jwt_required, get_jwt_identity,JWTManager,create_access_token
from bson.objectid import ObjectId
import pytesseract
import io
from PIL import Image
import pandas as pd
from yolov5.models.experimental import attempt_load
from yolov5.utils.general import non_max_suppression
from yolov5.utils.torch_utils import select_device

app=Flask('__name__')
engine = pyttsx3.init()
app.secret_key = 'SmartWhiteCane'
app.config['MONGO_URI'] = 'mongodb+srv://mohsinzafar:1234@smartwhitecane.wm5ebvm.mongodb.net/test?retryWrites=true&w=majority'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization' # set the JWT header name
app.config['IMAGE_UPLOADS'] = './IMAGE_UPLOADS' 
jwt = JWTManager(app)
mongo = PyMongo(app)

if mongo.cx is not None:
    print("Connected to MongoDB!")
else:
    print("Could not connect to MongoDB.")

CORS(app)

try:
    users = mongo.db.users
    images = mongo.db.images
    admin = mongo.db.admin
    print("Collections found!")
except AttributeError as e:
    print(f"Error connecting to MongoDB: {e}")
#for Twillio Credentials
account_sid = 'AC6b033c0e567ea80e6ae40a6d9175d11b'
auth_token = 'a2a763c092da094a180ae9f6d6923425'
client = Client(account_sid, auth_token)

#checking 
@app.route("/check",methods=['POST'])
def checkApi():
    print("I'm here")
    response_data = {
            'msg': 'OTP sent successfully',
        }
    return response_data
 
#sign up users
# @app.route("/users/Signup",methods=['POST'])
# def createUser(): 
#     name = request.json['name']
#     age = request.json['age']
#     phone = request.json['phone']
#     password = request.json['password']
#     email=request.json['email']
#     result = db.insert_one({
#              'name': name,
#              'age': age,
#              'phone': phone,
#              'password': password,
#              'email': email  
#          })

#     id = str(result.inserted_id)
#     # Return a response containing the OTP and user ID
#     return jsonify({'msg': 'User Registered Successfully', 'id':id})
#login user
@app.route("/users/Login",methods=['POST'])
def loginUser():
    phone = request.json.get('phone')
    password = request.json.get('password')
    # look up the user in the MongoDB collection
    print("before Matching")
    user = users.find_one({'phone': phone})
    if user and user['password'] == password:
        # generate JWT token
        access_token = create_access_token(identity=str(user['_id']))
        user_id = str(user['_id'])
        return jsonify({'msg': 'Login successful', 'access_token': access_token,'user_id': user_id}), 200
    else:
        return jsonify({'msg': 'Invalid username or password'}), 401
#verify User
otps={}

@app.route("/users", methods=['POST'])
def createUser():
    name = request.json['name']
    age = request.json['age']
    phone = request.json['phone']
    password = request.json['password']

    # Generate a random OTP
    otp = str(random.randint(1000, 9999))
    print(request.json)
    # Store the OTP in the dictionary
    otps[phone] = otp

    # Send the OTP to the user's phone number using Twilio
    try:
        message = client.messages.create(
            body=f"Your OTP is {otp}",
            from_='+15747667080',
            to=phone
        )
        # Return a response containing the OTP and user ID
        response_data = {
            'msg': 'OTP sent successfully',
            'otp': otp,
            'userId': phone
        }
        print("OTP sent")
    except:
        # Return a response containing the error message
        response_data = {
            'msg': 'Error sending OTP',
            'otp': '',
            'userId': phone
        }

    return json.dumps(response_data)

@app.route("/users/verify", methods=['POST'])
def verifyOTP():
    if request.is_json:
        print("data is in json form")
        name = request.json['name']
        age = request.json['age']
        phone = request.json['phone']
        password = request.json['password']
        otp = request.json['otp']

        if phone in otps and otps[phone] == otp:
            print("Otp is matched")
        # Add the user to the database
            result = users.insert_one({
                'name': name,
                'age': age,
                'phone': phone,
                'password': password
            
        })

            id = str(result.inserted_id)

        # Remove the OTP from the dictionary
            del otps[phone]

            return jsonify({'msg': 'User created', 'id': id})
        else:
            return jsonify({'msg': 'Invalid OTP'})
    else:
        return jsonify({'msg': 'Invalid request, must be a JSON object'})

#detete image from db
@app.route('/users/delete/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Check if the image exists in the MongoDB collection
    user = users.find_one({'_id': ObjectId(user_id)})
    
    if user:
        # Delete the image from the collection
        users.delete_one({'_id': ObjectId(user_id)})
        
        return jsonify({'message': 'User deleted successfully'})
    else:
        return jsonify({'message': 'User not found'}), 404

 #admin login
@app.route('/admin/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    # look up the user in the MongoDB collection
    print("before Matching")
    admin_data = admin.find_one({'username': username})
    if admin_data and admin_data['password'] == password:
        # generate JWT token
        access_token = create_access_token(identity=str(admin_data['_id']))
        user_id = str(admin_data['_id'])
        print(admin_data)
        return jsonify({'msg': 'Login successful', 'access_token': access_token, 'user_id': user_id}), 200, {'Content-Type': 'application/json'}

    else:
        return jsonify({'msg': 'Invalid username or password'}), 401
        print("Error")
#json encoder

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)
app.json_encoder = CustomJSONEncoder
#get all userss
@app.route('/users', methods=["GET"])
def get_users():
    # Retrieve all users from the MongoDB collection
    user_data = list(users.find())

    # Convert ObjectId to string
    for user in user_data:
        user['_id'] = str(user['_id'])

    # Convert users to JSON format
    response = jsonify(user_data)

    return response


detect_process = None



@app.route("/start_detect", methods=["POST"])
def start_detect():
    global detect_process

    # If the detect process is already running, do nothing
    if detect_process and detect_process.poll() is None:
        return jsonify({"message": "Detection already running"})

    # Start the detect.py file using subprocess
   

    # Start the detect.py file using subprocess
    command = ["D:/SWC backend/env/Scripts/python.exe", "D:/SWC backend/detect.py"]

    detect_process = subprocess.Popen(command)
    return jsonify({"message": "Detection started"})
   

#for retreiving user data in the profile section
@app.route('/users/UserInfo', methods=['GET'])
@jwt_required()
def get_user_info():
    # Get the user ID from the JWT token
    current_user_id = get_jwt_identity()

    # Look up the user in the MongoDB collection based on the ID
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})
    if user is None:
        print("User if none")
        return jsonify({'msg': 'User not found'}), 404

    # Convert ObjectId to string
    user['_id'] = str(user['_id'])

    # Remove sensitive data from the user object before returning it
    user.pop('password')
    print(user)
    # Return the user information in JSON format
    return jsonify(user), 200

#For updating the user info 
@app.route("/users/<user_id>", methods=['PATCH'])
def update_user(user_id):
    if request.is_json:
        data = request.get_json()
        name = data.get("name")
        age = data.get("age")
        phone = data.get("phone")
        password = data.get("password")

        # Search for the user by ID
        user = users.find_one({"_id": ObjectId(user_id)})
        if user:
            # Update the user's information
            if name:
                user["name"] = name
            if age:
                user["age"] = age
            if phone:
                user["phone"] = phone
            if password:
                user["password"] = password
            users.update_one({"_id": ObjectId(user_id)}, {"$set": user})
            print("User Updated successfully")
            print(user)
            return jsonify({"msg": "User updated successfully"})
        else:
            return jsonify({"error": "User not found"}), 404
    else:
        return jsonify({"error": "Invalid request, must be a JSON object"}), 400

@app.route("/stop_detect", methods=["POST"])
def stop_detect():
    global detect_process

    # If the detect process is not running, do nothing
    if not detect_process or detect_process.poll() is not None:
        return jsonify({"message": "Detection not running"})

    # Terminate the detect.py process
    detect_process.terminate()
    detect_process = None

    return jsonify({"message": "Detection stopped"}) 
# route to capture document part from image
@app.route('/capture_document', methods=['POST'])
def DocFromImage():
    webCamFeed = False
    pathImage = "4.jpeg"
    cap = cv2.VideoCapture(0)
    cap.set(10,160)
    heightImg = 640
    widthImg  = 480
    utlis.initializeTrackbars()
    count=0 
    while True:

        if webCamFeed:success, img = cap.read()
        else:img = cv2.imread(pathImage)
        img = cv2.resize(img, (widthImg, heightImg)) # RESIZE IMAGE
        imgBlank = np.zeros((heightImg,widthImg, 3), np.uint8) # CREATE A BLANK IMAGE FOR TESTING DEBUGING IF REQUIRED
        imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) # CONVERT IMAGE TO GRAY SCALE
        imgBlur = cv2.GaussianBlur(imgGray, (5, 5), 1) # ADD GAUSSIAN BLUR
        thres=utlis.valTrackbars() # GET TRACK BAR VALUES FOR THRESHOLDS
        imgThreshold = cv2.Canny(imgBlur,thres[0],thres[1]) # APPLY CANNY BLUR
        kernel = np.ones((5, 5))
        imgDial = cv2.dilate(imgThreshold, kernel, iterations=2) # APPLY DILATION
        imgThreshold = cv2.erode(imgDial, kernel, iterations=1)  # APPLY EROSION

        ## FIND ALL COUNTOURS
        imgContours = img.copy() # COPY IMAGE FOR DISPLAY PURPOSES
        imgBigContour = img.copy() # COPY IMAGE FOR DISPLAY PURPOSES
        contours, hierarchy = cv2.findContours(imgThreshold, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE) # FIND ALL CONTOURS
        cv2.drawContours(imgContours, contours, -1, (0, 255, 0), 10) # DRAW ALL DETECTED CONTOURS


        # FIND THE BIGGEST COUNTOUR
        biggest, maxArea = utlis.biggestContour(contours) # FIND THE BIGGEST CONTOUR
        if biggest.size != 0:
            biggest=utlis.reorder(biggest)
            cv2.drawContours(imgBigContour, biggest, -1, (0, 255, 0), 20) # DRAW THE BIGGEST CONTOUR
            imgBigContour = utlis.drawRectangle(imgBigContour,biggest,2)
            pts1 = np.float32(biggest) # PREPARE POINTS FOR WARP
            pts2 = np.float32([[0, 0],[widthImg, 0], [0, heightImg],[widthImg, heightImg]]) # PREPARE POINTS FOR WARP
            matrix = cv2.getPerspectiveTransform(pts1, pts2)
            imgWarpColored = cv2.warpPerspective(img, matrix, (widthImg, heightImg))

            #REMOVE 20 PIXELS FORM EACH SIDE
            imgWarpColored=imgWarpColored[5:imgWarpColored.shape[0] - 5, 5:imgWarpColored.shape[1] - 5]
            imgWarpColored = cv2.resize(imgWarpColored,(widthImg,heightImg))

            # APPLY ADAPTIVE THRESHOLD
            imgWarpGray = cv2.cvtColor(imgWarpColored,cv2.COLOR_BGR2GRAY)
            imgAdaptiveThre= cv2.adaptiveThreshold(imgWarpGray, 255, 1, 1, 7, 2)
            imgAdaptiveThre = cv2.bitwise_not(imgAdaptiveThre)
            imgAdaptiveThre=cv2.medianBlur(imgAdaptiveThre,3)

            # Image Array for Display
            imageArray = ([img,imgGray,imgThreshold,imgContours],
                        [imgBigContour,imgWarpColored, imgWarpGray,imgAdaptiveThre])

        else:
            imageArray = ([img,imgGray,imgThreshold,imgContours],
                        [imgBlank, imgBlank, imgBlank, imgBlank])

        # LABELS FOR DISPLAY
        lables = [["Original","Gray","Threshold","Contours"],
              ["Biggest Contour","Warp Prespective","Warp Gray","Adaptive Threshold"]]

        stackedImage = utlis.stackImages(imageArray,0.75,lables)
        cv2.imshow("Result",stackedImage)

     # SAVE IMAGE WHEN 's' key is pressed
        if cv2.waitKey(1) & 0xFF == ord('s'):
            cv2.imwrite("Scanned/myImage"+str(count)+".jpg",imgWarpColored)
            cv2.rectangle(stackedImage, ((int(stackedImage.shape[1] / 2) - 230), int(stackedImage.shape[0] / 2) + 50),
                      (1100, 350), (0, 255, 0), cv2.FILLED)
            cv2.putText(stackedImage, "Scan Saved", (int(stackedImage.shape[1] / 2) - 200, int(stackedImage.shape[0] / 2)),
                    cv2.FONT_HERSHEY_DUPLEX, 3, (0, 0, 255), 5, cv2.LINE_AA)
            cv2.imshow('Result', stackedImage)
            cv2.waitKey(300)
            count += 1
            cv2.destroyWindow("Result")
            return {"msg":"Document is saved"}
        
#route to turn on camera 
# set up the camera
cap = cv2.VideoCapture(0)


collection = images
 

#image of particular user
@app.route('/images/<userId>', methods=['GET'])
def get_images_by_user(userId):
     # find all the images for the given user_id
    user_images = list(images.find({'user_id': userId}))

    if len(user_images) == 0:
        return jsonify({'message': 'No images found for the given user_id'})

    # prepare the response with image ids and urls
    response = []
    for img in user_images:
        image_id = str(img['_id'])
        file_name = str(img['file_name'])
        image_url = f"data:image/jpeg;base64,{base64.b64encode(img['image']).decode('utf-8')}"
        response.append({'image_id': image_id,'image_name':file_name, 'image_url': image_url})

    return jsonify(response)
#retrieve all images
@app.route('/images', methods=['GET'])
def get_all_images():
    # Retrieve all images from the MongoDB collection
    image_data = list(images.find())

    # Prepare the response with image ids and urls
    response = []
    for img in image_data:
        image_id = str(img['_id'])
        file_name = str(img['file_name'])
        user_id = str(img['user_id'])
        image_url = f"data:image/jpeg;base64,{base64.b64encode(img['image']).decode('utf-8')}"
        response.append({'image_id': image_id, 'file_name': file_name, 'user_id': user_id, 'image_url': image_url})

    return jsonify(response)


#detete image from db
@app.route('/images/<image_id>', methods=['DELETE'])
def delete_image(image_id):
    # Check if the image exists in the MongoDB collection
    image = images.find_one({'_id': ObjectId(image_id)})
    
    if image:
        # Delete the image from the collection
        images.delete_one({'_id': ObjectId(image_id)})
        
        return jsonify({'message': 'Image deleted successfully'})
    else:
        return jsonify({'message': 'Image not found'}), 404

#get the recent image and save it to disk
@app.route('/camera/recent-image', methods=['GET'])
def get_recent_image():
    # find the most recent image in the collection
    most_recent_image = collection.find_one(sort=[('_id', -1)])

    # decode the image bytes to a numpy array
    image_np = np.frombuffer(most_recent_image['image'], dtype=np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    # save the image to disk as a jpg file
    imagePath = 'recent_image.jpg'
    cv2.imwrite(imagePath, image)

    return 'Recent image saved to disk.'






camera = None
def capture_frames():
    global camera

    camera = cv2.VideoCapture(0)

    while True:
        success, frame = camera.read()
        if not success:
            break

        cv2.imshow('Video Stream', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    camera.release()
    cv2.destroyAllWindows()

@app.route('/camera/open', methods=['GET'])
def open_camera():
    global camera

    if camera is not None and camera.isOpened():
        return jsonify({'message': 'Camera is already open'})

    threading.Thread(target=capture_frames).start()
    
    return jsonify({'message': 'Camera is opened'})


if __name__ == '__main__':  
    app.run(debug=True, host="192.168.35.126", port=4000)