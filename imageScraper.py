import requests
from bs4 import BeautifulSoup
from os.path import basename
import os

# Establishing Useful Directories/Creating Ones Required
BASE_DIR = os.getcwd()
SETS_DIR = os.path.join(BASE_DIR,'Sets')
if not os.path.exists(SETS_DIR):
    os.mkdir('Sets')

# Scraping HTML From Main Top Trumps Page
url = "https://www.tcdb.com/ViewAll.cfm/sp/Gaming/brand/Top%20Trumps"
HOST_DOMAIN = "https://www.tcdb.com"
html = requests.get(url).content
data = BeautifulSoup(html, 'html.parser')

# Finding List of Decks and Creating List of All Links
parent = data.find("body").find_all("ul")[3]
links = []
for li in parent.find_all("li"):
    for link in li.find_all('a', href=True):
        links.append(link['href'])

# Scraping HTML From Each Specific Deck, Creating Folders For Them and Downloading the Card Images Into Them
for page in links[1::2]:
    html = requests.get(f"{HOST_DOMAIN}{str(page).replace('Gallery','Checklist')}").content
    data = BeautifulSoup(html, 'html.parser')
    title = data.find_all("strong")[0].get_text()
    THIS_SET_DIR = os.path.join(SETS_DIR,title)
    if not os.path.exists(THIS_SET_DIR):
        os.mkdir(THIS_SET_DIR)
    cardlist = data.find_all("table")[4]
    cardlinks = []
    for card in cardlist.find_all('a', href=True):
        curlink = card['href']
        if 'ViewCard' in curlink:
            cardlinks.append(curlink)
    cardimages = []
    for card in cardlinks[1::3]:
        html = requests.get(f"{HOST_DOMAIN}{card}").content
        data = BeautifulSoup(html, 'html.parser')
        for image in data.find_all("img"):
            curimage = image['src']
            if 'Fr.jpg' in curimage:
                img_data = requests.get(f"{HOST_DOMAIN}{curimage}").content
                filename = os.path.join(THIS_SET_DIR, basename(f"{HOST_DOMAIN}{curimage}"))
                with open(filename, "wb") as f:
                    f.write(img_data)