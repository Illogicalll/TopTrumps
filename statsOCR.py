import easyocr
import cv2
import numpy as np

image = cv2.imread("Sets/1982 Top Trumps Cars/98647-6871984Fr.jpg")
image2 = cv2.resize(image, (0,0), fx=1.5, fy=1.5)
kernel = np.array([[0, -1, 0],
                   [-1, 5,-1],
                   [0, -1, 0]])
image2 = cv2.filter2D(src=image2, ddepth=-1, kernel=kernel)
# cv2.imshow('window',image2)
# cv2.waitKey()
reader = easyocr.Reader(['en'], gpu=False)
result = reader.readtext(image2, detail=0)
for detection in result:
    print(detection)
