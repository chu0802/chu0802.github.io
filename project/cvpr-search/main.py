# load html from cvpr24.html using beatifulsoup4
from bs4 import BeautifulSoup
import json

with open('cvpr24.html', 'r') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

# fetch all tr elements
trs = soup.find_all('tr')

# for each tr element, read the strong tag, and i tag
publications = []
for tr in trs:
    title = tr.find('strong')
    link = tr.find('a')
    authors =tr.find('i')
    if (title or link) and authors:
        if title is None:
            title = link
            
        publication = {"title": title.text.strip()}
        authors_list = [author.strip().split("(") for author in authors.text.split("·")]
        publication["authors"] = [{"name": k[0].strip(), "affiliation": k[1].strip()[:-1]} for k in authors_list]
        publications.append(publication)
    else:
        if title:
            print(title.text.strip())
        elif authors:
            print(authors.text)
        
with open("cvpr24.json", "w") as f:
    json.dump(publications, f, indent=4)