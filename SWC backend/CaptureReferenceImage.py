# import cv2 as cv
# import time
# # setting parameters
# CONFIDENCE_THRESHOLD = 0.5
# NMS_THRESHOLD = 0.5

# # colors for object detected
# COLORS = [(0, 255, 255), (255, 255, 0), (0, 255, 0), (255, 0, 0)]
# GREEN = (0, 255, 0)
# RED = (0, 0, 255)
# PINK = (147, 20, 255)
# ORANGE = (0, 69, 255)
# fonts = cv.FONT_HERSHEY_COMPLEX
# # reading class name from text file
# class_names = []
# with open("classes.txt", "r") as f:
#     class_names = [cname.strip() for cname in f.readlines()]
# #  setttng up opencv net
# yoloNet = cv.dnn.readNet('yolov4-tiny.weights', 'yolov4-tiny.cfg')

# yoloNet.setPreferableBackend(cv.dnn.DNN_BACKEND_CUDA)
# yoloNet.setPreferableTarget(cv.dnn.DNN_TARGET_CUDA_FP16)

# model = cv.dnn_DetectionModel(yoloNet)
# model.setInputParams(size=(416, 416), scale=1/255, swapRB=True)

# # setting camera


# def ObjectDetector(image):
#     classes, scores, boxes = model.detect(
#         image, CONFIDENCE_THRESHOLD, NMS_THRESHOLD)

#     for (classid, score, box) in zip(classes, scores, boxes):
#         color = COLORS[int(classid) % len(COLORS)]
#         label = "%s : %f" % (class_names[classid[0]], score)
#         cv.rectangle(image, box, color, 2)
#         cv.putText(frame, label, (box[0], box[1]-10), fonts, 0.5, color, 2)


# camera = cv.VideoCapture(0)
# counter = 0
# capture = False
# number = 0
# while True:
#     ret, frame = camera.read()

#     orignal = frame.copy()
#     ObjectDetector(frame)
#     cv.imshow('oringal', orignal)

#     print(capture == True and counter < 10)
#     if capture == True and counter < 10:
#         counter += 1
#         cv.putText(
#             frame, f"Capturing Img No: {number}", (30, 30), fonts, 0.6, PINK, 2)
#     else:
#         counter = 0

#     cv.imshow('frame', frame)
#     key = cv.waitKey(1)

#     if key == ord('c'):
#         capture = True
#         number += 1
#         cv.imwrite(f'ReferenceImages/image{number}.png', orignal)
#     if key == ord('q'):
#         break
# cv.destroyAllWindows()

import cv2 as cv
import torch
from torchvision.models import detection

# Setting parameters
CONFIDENCE_THRESHOLD = 0.5
NMS_THRESHOLD = 0.5

# Colors for object detected
COLORS = [(0, 255, 255), (255, 255, 0), (0, 255, 0), (255, 0, 0)]
GREEN = (0, 255, 0)
RED = (0, 0, 255)
PINK = (147, 20, 255)
ORANGE = (0, 69, 255)
fonts = cv.FONT_HERSHEY_COMPLEX

# Reading class names from text file
class_names = []
with open("classes.txt", "r") as f:
    class_names = [cname.strip() for cname in f.readlines()]

# Load YOLOv5s model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# Set device to CPU
device = torch.device('cpu')
model = model.to(device)

# Setting up camera
camera = cv.VideoCapture(0)
counter = 0
capture = False
number = 0

while True:
    ret, frame = camera.read()

    original = frame.copy()
    frame = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
    results = model(frame)

    for result in results.xyxy[0]:
        class_id = int(result[5])
        confidence = float(result[4])
        if confidence > CONFIDENCE_THRESHOLD:
            x, y, w, h = [int(coord) for coord in result[:4]]
            color = COLORS[class_id % len(COLORS)]
            label = f"{class_names[class_id]}: {confidence:.2f}"
            cv.rectangle(original, (x, y), (w, h), color, 2)
            cv.putText(original, label, (x, y - 10), fonts, 0.5, color, 2)

    cv.imshow('original', original)

    if capture and counter < 10:
        counter += 1
        cv.putText(original, f"Capturing Img No: {number}", (30, 30), fonts, 0.6, PINK, 2)
    else:
        counter = 0

    cv.imshow('frame', original)
    key = cv.waitKey(1)

    if key == ord('c'):
        capture = True
        number += 1
        cv.imwrite(f'ReferenceImages/image{number}.png', original)

    if key == ord('q'):
        break

cv.destroyAllWindows()