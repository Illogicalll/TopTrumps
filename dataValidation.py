from tkinter import *
from PIL import ImageTk, Image
import os
import csv
import pandas as pd


# Creating List of All Card File Paths
directories = [x[1] for x in os.walk(os.getcwd())]
non_empty_dirs = [x for x in directories if x]
sets = non_empty_dirs[8]
images = []
for set in sets:
    for card in os.listdir(f"Sets/{set}"):
        if card == "stats.csv":
            pass
        else:
            images.append(f"Sets/{set}/{card}")

# Button Functionality
curimage = 0
relativecurimage = 0
def nextim():
    global curimage
    global relativecurimage
    relativecurimage += 1
    SET_DIR = os.path.abspath(images[curimage]).rstrip(images[curimage])
    if relativecurimage == len(os.listdir(SET_DIR))-1:
        for obj in dobjects.keys():
            if "entrybox" in obj:
                dobjects[obj].delete(0,END)
        relativecurimage = 0
    else:
        for obj in dobjects.keys():
            if "valueentrybox" in obj:
                dobjects[obj].delete(0,END)
            elif "nameentrybox0" in obj:
                dobjects[obj].delete(0,END)
    curimage += 1
    img1 = ImageTk.PhotoImage(Image.open(images[curimage]))
    label.configure(image=img1)
    label.photo = img1
    curset = os.listdir(SET_DIR)
    currow = []
    with open(f"{SET_DIR}/stats.csv", 'r') as f:
        rownum = curset.index(images[curimage].split('/')[2])
        reader = csv.reader(f)
        rows = list(reader)
        currow = rows[rownum]
    row = 0
    for obj in dobjects.keys():
        if "valueentrybox" in obj:
            if row > len(currow):
                break
            try:
                dobjects[obj].insert(0,currow[row])
            except IndexError:
                pass
            row += 1

def updatestat():
    global relativecurimage
    SET_DIR = os.path.abspath(images[curimage]).rstrip(images[curimage])
    stats = ['Name']
    for obj in dobjects.keys():
        if "entrybox" in obj:
            if dobjects[obj].get() == "":
                pass
            else:
                stats.append(dobjects[obj].get())
    with open(f"{SET_DIR}stats.csv", 'a') as f:
        writer = csv.writer(f,delimiter=',', lineterminator='\n')
        try:
            pd.read_csv(f"{SET_DIR}stats.csv")
        except:
            writer.writerow(stats[::2])
        writer.writerow(stats[1::2])
    # EDITING OCR GENERATED STATS
    # KINDA BROKEN
    # data = []
    # with open(f'{SET_DIR}ocrstats.csv', 'r') as f:
    #     reader = csv.reader(f)
    #     data.extend(reader)
    # overrideline = {relativecurimage:stats}
    # with open(f'{SET_DIR}stats.csv', 'w') as f:
    #     writer = csv.writer(f)
    #     for line, row in enumerate(data):
    #         data = overrideline.get(line, row)
    #         writer.writerow(data)

# GUI
win = Tk()
win.title("Stats Validation")
win.config(bg="BLACK")
win.geometry("1000x600")
frame = Frame(win,width=300, height=400)
frame.pack()
frame.place(anchor='w', rely=0.5)
img = ImageTk.PhotoImage(Image.open(images[curimage]))
label = Label(frame, image = img)
label.pack()
nextimage = Button(win, text="Next Image", command=nextim)
nextimage.place(x=72,y=480)
basey = 200
dobjects = {}
formframe = Frame(win,width=300, height=400)
formframe.pack()
formframe.place(anchor='e', rely=0.5, relx=1)
dobjects["namelabel0"] = Label(formframe, text = f'Card Name')
dobjects["nameentrybox0"] = Entry(formframe)
for i in range(1,7):
    dobjects["namelabel{0}".format(i)] = Label(formframe, text = f'Stat {i} Name')
    dobjects["nameentrybox{0}".format(i)] = Entry(formframe)
    dobjects["valuelabel{0}".format(i)] = Label(formframe, text = f'Stat {i} Value')
    dobjects["valueentrybox{0}".format(i)] = Entry(formframe)
for obj in dobjects.keys():
    if "namelabel" in obj:
        col = 0
    elif "nameentrybox" in obj:
        col = 1
    elif "valueentrybox" in obj:
        col = 2
    else:
        col = 3
    dobjects[obj].grid(row=int(obj[-1]), column=col, sticky="W")
submitdata = Button(win, text = "Update Stats", command=updatestat)
submitdata.place(x=770,y=370)

win.mainloop()