# import cv2 as cv 
# import numpy as np
# import cv2
# import torch
# from torch import cuda
# from PIL import Image
# from yolov5.models.experimental import attempt_load
# from yolov5.utils.general import non_max_suppression
# from yolov5.utils.torch_utils import select_device
# import pyttsx3


# # Initialize pyttsx3 TTS engine
# engine = pyttsx3.init()

# # Distance constants 
# KNOWN_DISTANCE = 45 #INCHES
# PERSON_WIDTH = 16 #INCHES
# MOBILE_WIDTH = 3.0 #INCHES

# # Object detector constant 
# CONFIDENCE_THRESHOLD = 0.4
# NMS_THRESHOLD = 0.3

# # colors for object detected
# COLORS = [(255,0,0),(255,0,255),(0, 255, 255), (255, 255, 0), (0, 255, 0), (255, 0, 0)]
# GREEN =(0,255,0)
# BLACK =(0,0,0)
# # defining fonts 
# FONTS = cv.FONT_HERSHEY_COMPLEX

# # getting class names from classes.txt file 
# class_names = []
# with open("classes.txt", "r") as f:
#     class_names = [cname.strip() for cname in f.readlines()]
# #  setttng up opencv net
# device = select_device('')
# weights = 'yolov5s.pt'  # Provide the path to your YOLOv5 weights file
# model = attempt_load(weights)
# model.to(device).eval()


# def scale_coords(img_shape, coords, img0_shape):
#     gain = min(img_shape[0] / img0_shape[0], img_shape[1] / img0_shape[1])
#     pad = (img_shape[1] - img0_shape[1] * gain) / 2, (img_shape[0] - img0_shape[0] * gain) / 2
#     coords[:, :4] -= torch.tensor([pad[0], pad[1], pad[0], pad[1]])
#     coords[:, :4] /= gain
#     coords[:, :4] = coords[:, :4].clamp(0, img_shape[1]), coords[:, :4].clamp(0, img_shape[0])
#     return coords


# # object detector funciton /method
# def object_detector(image):
#     img = Image.fromarray(image)  # Convert BGR to RGB (removed the conversion step)
#     img = img.resize((32*10, 32*10))  # Resize image to YOLOv5 input size
#     img_tensor = torch.from_numpy(np.array(img) / 255.0).permute(2, 0, 1).float().unsqueeze(0).to(device)

#     with torch.no_grad():
#         detections = model(img_tensor)[0]
#         detections = non_max_suppression(detections, CONFIDENCE_THRESHOLD, NMS_THRESHOLD)

#     data_list = []
#     for detection in detections:
#         if detection is not None and len(detection) > 0:
#             detection[:, :4] = detection[:, :4].clip(0, image.shape[1])  # Clip coordinates to image size
#             for x1, y1, x2, y2, conf, cls in detection:
#                 class_id = int(cls)
#                 color = COLORS[class_id % len(COLORS)]
#                 label = f'{class_names[class_id]}: {conf:.2f}'

#                 x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
#                 cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
#                 cv2.putText(image, label, (x1, y1 - 14), FONTS, 0.5, color, 2)

#                 if class_id == 0:  # Person class ID
#                     data_list.append([class_names[class_id], x2 - x1, (x1, y1 - 2)])
#                 elif class_id == 67:  # Cell phone class ID
#                     data_list.append([class_names[class_id], x2 - x1, (x1, y1 - 2)])

#     return data_list

# def focal_length_finder (measured_distance, real_width, width_in_rf):
#     focal_length = (width_in_rf * measured_distance) / real_width

#     return focal_length

# # distance finder function 
# def distance_finder(focal_length, real_object_width, width_in_frmae):
#     distance = (real_object_width * focal_length) / width_in_frmae
#     return distance

# # reading the reference image from dir 
# ref_person = cv2.imread('ReferenceImages/image14.png')
# ref_mobile = cv2.imread('ReferenceImages/image4.png')


# mobile_data = object_detector(ref_mobile)
# mobile_width_in_rf = mobile_data[1][1]

# person_data = object_detector(ref_person)
# person_width_in_rf = person_data[0][1]

# print(f"Person width in pixels : {person_width_in_rf} mobile width in pixel: {mobile_width_in_rf}")

# # finding focal length 
# focal_person = focal_length_finder(KNOWN_DISTANCE, PERSON_WIDTH, person_width_in_rf)

# focal_mobile = focal_length_finder(KNOWN_DISTANCE, MOBILE_WIDTH, mobile_width_in_rf)
# cap = cv2.VideoCapture(0)

# while True:
#     ret, frame = cap.read()

#     frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB
#     data = object_detector(frame)

#     for d in data:
#         if d[0] == 'person':
#             distance = distance_finder(focal_person, PERSON_WIDTH, d[1])
#             x, y = d[2]
#         elif d[0] == 'cell phone':
#             distance = distance_finder(focal_mobile, MOBILE_WIDTH, d[1])
#             x, y = d[2]

#     # Get object position
#         x1, y1, x2, y2 = int(x), int(y), int(x + d[1]), int(y + d[1])
#         width = x2 - x1
#         height = y2 - y1
#         center_x = x1 + (width / 2)
#         center_y = y1 + (height / 2)

#         # Determine object position
#         frame_width = frame.shape[1]  # Replace frame.shape[1] with the actual width of your frame
#         frame_height = frame.shape[0]  # Replace frame.shape[0] with the actual height of your frame

#         if center_x < frame_width / 3 and center_y > frame_height / 3 * 2:
#             position = "Bottom Left"
#         elif center_x > frame_width / 3 * 2 and center_y > frame_height / 3 * 2:
#             position = "Bottom Right"
#         elif center_x < frame_width / 3 and center_y < frame_height / 3:
#             position = "Top Left"
#         elif center_x > frame_width / 3 * 2 and center_y < frame_height / 3:
#             position = "Top Right"
#         elif center_x < frame_width / 3:
#             position = "Left"
#         elif center_x > frame_width / 3 * 2:
#             position = "Right"
#         elif center_y < frame_height / 3:
#             position = "Top"
#         elif center_y > frame_height / 3 * 2:
#             position = "Bottom"
#         else:
#             position = "Center"

#         cv2.rectangle(frame, (x, y - 3), (x + 150, y + 23), BLACK, -1)
#         cv2.putText(frame, f'Dis: {round(distance, 2)} inch', (x + 5, y + 13), FONTS, 0.48, GREEN, 2)

#          # Text-to-speech output
#         engine.say(f'{d[0]} is {round(distance, 2)} inches away. {position}')
#         engine.runAndWait()
#     cv2.imshow('frame', frame[..., ::-1])  # Convert RGB to BGR for display

#     key = cv2.waitKey(1)
#     if key == ord('q'):
#         break

# cv2.destroyAllWindows()
# cap.release()


import cv2 as cv
import numpy as np
import cv2
import torch
import torchvision.transforms as transforms 
from torch import cuda
from PIL import Image
from yolov5.models.experimental import attempt_load
from yolov5.utils.general import non_max_suppression
from yolov5.utils.torch_utils import select_device
import pyttsx3

 
# Initialize pyttsx3 TTS engine
engine = pyttsx3.init()

# Distance and speed constants
KNOWN_DISTANCE = 45  # INCHES
PERSON_WIDTH = 16  # INCHES
MOBILE_WIDTH = 3.0  # INCHES
FRAME_RATE = 30  # frames per second

# Object detector constants
CONFIDENCE_THRESHOLD = 0.4
NMS_THRESHOLD = 0.3

# Colors for object detection
COLORS = [(255, 0, 0), (255, 0, 255), (0, 255, 255), (255, 255, 0), (0, 255, 0), (255, 0, 0)]
GREEN = (0, 255, 0)
BLACK = (0, 0, 0)
# Defining fonts
FONTS = cv.FONT_HERSHEY_COMPLEX

# Getting class names from classes.txt file
class_names = []
with open("classes.txt", "r") as f:
    class_names = [cname.strip() for cname in f.readlines()]
# Setting up OpenCV net
device = select_device('')
weights = 'yolov5s.pt'  # Provide the path to your YOLOv5 weights file
model = attempt_load(weights)
model.to(device).eval()


def scale_coords(img_shape, coords, img0_shape):
    gain = min(img_shape[0] / img0_shape[0], img_shape[1] / img0_shape[1])
    pad = (img_shape[1] - img0_shape[1] * gain) / 2, (img_shape[0] - img0_shape[0] * gain) / 2
    coords[:, :4] -= torch.tensor([pad[0], pad[1], pad[0], pad[1]])
    coords[:, :4] /= gain
    coords[:, :4] = coords[:, :4].clamp(0, img_shape[1]), coords[:, :4].clamp(0, img_shape[0])
    return coords


# Object detector function/method
def object_detector(image):
    img = Image.fromarray(image)  # Convert BGR to RGB (removed the conversion step)
    img = img.resize((640, 640))  # Resize image to YOLOv5 input size
    img_tensor = torch.from_numpy(np.array(img) / 255.0).permute(2, 0, 1).float().unsqueeze(0).to(device)

    with torch.no_grad():
        detections = model(img_tensor)[0]
        detections = non_max_suppression(detections, CONFIDENCE_THRESHOLD, NMS_THRESHOLD)

    data_list = []
    for detection in detections:
        if detection is not None and len(detection) > 0:
            detection[:, :4] = detection[:, :4].clip(0, image.shape[1])  # Clip coordinates to image size
            for x1, y1, x2, y2, conf, cls in detection:
                class_id = int(cls)
                color = COLORS[class_id % len(COLORS)]
                label = f'{class_names[class_id]}: {conf:.2f}'

                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
                cv2.putText(image, label, (x1, y1 - 14), FONTS, 0.5, color, 2)

                if class_id == 0:  # Person class ID
                    data_list.append([class_names[class_id], x2 - x1, (x1, y1 - 2)])
                elif class_id == 67:  # Cell phone class ID
                    data_list.append([class_names[class_id], x2 - x1, (x1, y1 - 2)])

    return data_list


def focal_length_finder(measured_distance, real_width, width_in_rf):
    focal_length = (width_in_rf * measured_distance) / real_width

    return focal_length


# Distance finder function
def distance_finder(focal_length, real_object_width, width_in_frame):
    distance = (real_object_width * focal_length) / width_in_frame
    return distance


# Speed estimation function
def speed_estimator(previous_positions):
    if len(previous_positions) < 2:
        return 0.0

    dx = previous_positions[-1][0] - previous_positions[-2][0]
    dy = previous_positions[-1][1] - previous_positions[-2][1]
    dt = 1 / FRAME_RATE

    speed = np.sqrt(dx ** 2 + dy ** 2) / dt
    speed_mps = speed * 0.0254  # Convert speed from inches per second to meters per second
    return speed_mps


# Reading the reference image from directory
ref_person = cv2.imread('ReferenceImages/image14.png')
ref_mobile = cv2.imread('ReferenceImages/image4.png')

mobile_data = object_detector(ref_mobile)
mobile_width_in_rf = mobile_data[1][1]

person_data = object_detector(ref_person)
person_width_in_rf = person_data[0][1]

print(f"Person width in pixels: {person_width_in_rf} Mobile width in pixels: {mobile_width_in_rf}")

# Finding focal length
focal_person = focal_length_finder(KNOWN_DISTANCE, PERSON_WIDTH, person_width_in_rf)

focal_mobile = focal_length_finder(KNOWN_DISTANCE, MOBILE_WIDTH, mobile_width_in_rf)
cap = cv2.VideoCapture(0)

previous_positions = []

while True:
    ret, frame = cap.read()

    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # Convert BGR to RGB
    data = object_detector(frame)

    for d in data:
        if d[0] == 'person':
            distance = distance_finder(focal_person, PERSON_WIDTH, d[1])
            x, y = d[2]
        elif d[0] == 'cell phone':
            distance = distance_finder(focal_mobile, MOBILE_WIDTH, d[1])
            x, y = d[2]

        # Get object position
        x1, y1, x2, y2 = int(x), int(y), int(x + d[1]), int(y + d[1])
        width = x2 - x1
        height = y2 - y1
        center_x = x1 + (width / 2)
        center_y = y1 + (height / 2)

        # Determine object position
        frame_width = frame.shape[1]  # Replace frame.shape[1] with the actual width of your frame
        frame_height = frame.shape[0]  # Replace frame.shape[0] with the actual height of your frame

        if center_x < frame_width / 3 and center_y > frame_height / 3 * 2:
            position = "Bottom Left"
        elif center_x > frame_width / 3 * 2 and center_y > frame_height / 3 * 2:
            position = "Bottom Right"
        elif center_x < frame_width / 3 and center_y < frame_height / 3:
            position = "Top Left"
        elif center_x > frame_width / 3 * 2 and center_y < frame_height / 3:
            position = "Top Right"
        elif center_x < frame_width / 3:
            position = "Left"
        elif center_x > frame_width / 3 * 2:
            position = "Right"
        elif center_y < frame_height / 3:
            position = "Top"
        elif center_y > frame_height / 3 * 2:
            position = "Bottom"
        else:
            position = "Center"

        cv2.rectangle(frame, (x, y - 3), (x + 150, y + 23), BLACK, -1)
        cv2.putText(frame, f'Dis: {round(distance, 2)} inch', (x + 5, y + 13), FONTS, 0.48, GREEN, 2)

        # Append current position to previous positions
        previous_positions.append((center_x, center_y))

        # Perform speed estimation
        speed_mps = speed_estimator(previous_positions)
        cv2.putText(frame, f'Speed: {round(speed_mps, 2)} m/s', (x + 5, y + 33), FONTS, 0.48, GREEN, 2)

        # Text-to-speech output
        engine.say(f'{d[0]} is {round(distance, 2)} inches away. {position}. Speed is {round(speed_mps, 2)} m/s')
        engine.runAndWait()

    cv2.imshow('frame', frame[..., ::-1])  # Convert RGB to BGR for display

    key = cv2.waitKey(1)
    if key == ord('q'):
        break

cv2.destroyAllWindows()
cap.release()
