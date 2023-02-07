from tkinter import *
from PIL import ImageTk, Image
import os

# Button Functionality
curimage = 0
def nextim():
    global curimage
    curimage += 1
    img1 = ImageTk.PhotoImage(Image.open(images[curimage]))
    label.configure(image=img1)
    label.photo = img1

def updatestat():
    stats = []
    for obj in dobjects.keys():
        if "entrybox" in obj:
            if dobjects[obj].get() == "":
                pass
            else:
                stats.append(dobjects[obj].get())
    print(stats)

# Creating List of All Card File Paths
directories = [x[1] for x in os.walk(os.getcwd())]
non_empty_dirs = [x for x in directories if x]
sets = non_empty_dirs[8]
images = []
for set in sets:
    for card in os.listdir(f"Sets/{set}"):
        images.append(f"Sets/{set}/{card}")

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
for i in range(6):
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