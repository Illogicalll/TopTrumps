import cv2
from cv2 import dnn_superres

# Create an SR object
sr = dnn_superres.DnnSuperResImpl_create()

# Read image
image = cv2.imread('Sets/2002 Top Trumps Ultimate Military Jets/89222-6376716Fr.jpg')

# Read the desired model
path = "EDSR_x2.pb"
sr.readModel(path)

# Set the desired model and scale to get correct pre- and post-processing
sr.setModel("edsr", 3)

# Upscale the image
result = sr.upsample(image)

# Save the image
cv2.imwrite("upscaled.png", result)
# cv2.imshow('image',result)
# cv2.waitKey()