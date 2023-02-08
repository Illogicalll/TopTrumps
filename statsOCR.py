import easyocr
import cv2
import numpy as np
from autocorrect import Speller
from country_list import countries_for_language
import csv
import os

# Upscale Test
image = cv2.imread("Sets/2002 Top Trumps Ultimate Military Jets/89222-6376716Fr.jpg")
image2 = cv2.resize(image, (0,0), fx=1.5, fy=1.5)
kernel = np.array([[0, -1, 0],
                [-1, 5,-1],
                [0, -1, 0]])
image2 = cv2.filter2D(src=image2, ddepth=-1, kernel=kernel)
# cv2.imshow('image',image2)
# cv2.waitKey()
reader = easyocr.Reader(['en'], gpu=False)
header = reader.readtext(image2, detail=0)
print(header)


# Loading Image
directories = [x[1] for x in os.walk(os.getcwd())]
non_empty_dirs = [x for x in directories if x]
sets = non_empty_dirs[8]
for set in sets:
    f = open(f"Sets/{set}/ocrstats.csv", 'w')
    writer = csv.writer(f,delimiter=',', lineterminator='\n')
    for card in os.listdir(f"Sets/{set}"):
        if card == "ocrstats.csv":
            break
        image = cv2.imread(f"Sets/{set}/{card}")

        # OCR Readability Adjustments
        image2 = cv2.resize(image, (0,0), fx=1.5, fy=1.5)
        kernel = np.array([[0, -1, 0],
                        [-1, 5,-1],
                        [0, -1, 0]])
        image2 = cv2.filter2D(src=image2, ddepth=-1, kernel=kernel)
        cv2.imshow('image',image2)
        cv2.waitKey()

        # Attempting to read stats off card
        reader = easyocr.Reader(['en'], gpu=False)
        header = reader.readtext(image2, detail=0)
        spell = Speller(lang='en')
        for i in range (len(header)):
            header[i] = spell(header[i])
        stats = []
        countries = dict(countries_for_language('en'))
        for item in header:
            if item.split(' ')[0].isdigit():
                header.remove(item)
                stats.append(item)
            if item in countries.values():
                header.remove(item)
        writer.writerow(stats)
    print(f"Finished {set}")
    f.close()