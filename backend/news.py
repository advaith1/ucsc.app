import feedparser, requests, bs4
from fastapi import APIRouter, BackgroundTasks
from datetime import datetime


router = APIRouter()
cacheControl: datetime = datetime.now()
tagToName: dict = {}
nameToTag: dict = {}
feed: list = []
authorCache: dict = {}

"""
Campus News                             https://news.ucsc.edu/rss  or https://news.ucsc.edu/wp-json/wp/v2/posts/
Arts & Culture                          https://news.ucsc.edu/topics/arts-culture/rss              https://news.ucsc.edu/?_topics=arts-culture
Climate & Sustainability                https://news.ucsc.edu/topics/climate-sustainability/rss    https://news.ucsc.edu/?_topics=climate-sustainability
Earth & Space                           https://news.ucsc.edu/topics/earth-space/rss               https://news.ucsc.edu/?_topics=earth-space
Health                                  https://news.ucsc.edu/topics/health/rss                    https://news.ucsc.edu/?_topics=health
Social Justice & Community              https://news.ucsc.edu/topics/social-justice-community/rss  https://news.ucsc.edu/?_topics=social-justice-community
Student Experience                      https://news.ucsc.edu/topics/student-experience/rss        https://news.ucsc.edu/?_topics=student-experience
Technology                              https://news.ucsc.edu/topics/technology/rss                https://news.ucsc.edu/?_topics=technology
Baskin Engineering Undergrad Newsletter https://undergrad.engineering.ucsc.edu/rss                 
BE Community News                       https://engineering.ucsc.edu/topics/news/rss         

the news.ucsc.edu rss feeds have the title, link, summary but not the date
the date is only accessible in the ?_topic= api response. For those sites, use both to get the api.


update: https://news.ucsc.edu/wp-json/wp/v2/posts?per_page=100
https://news.ucsc.edu/wp-json/wp/v2/categories
"""

async def UpdateFeed():
    print('updating cache')
    await GetTagMap()
    await GetArticles()
    global cacheControl
    cacheControl = datetime.now()

def GetTextFromRendered(rendered: str) -> str:
    return bs4.BeautifulSoup(rendered, 'lxml').get_text(strip=True)

async def GetTagMap() -> None:
    response: requests.Response = requests.get('https://news.ucsc.edu/wp-json/wp/v2/categories')
    apiData: dict = response.json()
    global tagToName
    tagToName.clear()
    for category in apiData:
        id, name = category["id"], category["name"].replace('&amp;', '&')
        
        tagToName[id] = name
        nameToTag[name] = id

async def GetAuthor(id: int) -> dict[str, str] | None:
    global authorCache
    if not id in authorCache:
        response: requests.Response = requests.get(f'https://news.ucsc.edu/wp-json/wp/v2/users/{id}')
        if not response.ok:
            authorCache[id] = None
        else:
            apiData: dict = response.json()
            authorCache[id] = {
                "name": apiData["name"],
                "pfp": apiData["avatar_urls"]["96"]
            }
    
    return authorCache[id]

async def GetArticles() -> None:
    response: requests.Response = requests.get('https://news.ucsc.edu/wp-json/wp/v2/posts?per_page=100')
    apiData: dict = response.json()
    feed.clear()
    for articleInfo in apiData:
        feed.append({
            "title": GetTextFromRendered(articleInfo["title"]["rendered"]),
            "link": articleInfo["link"],
            "summary": GetTextFromRendered(articleInfo["excerpt"]["rendered"]),
            "published": articleInfo["date_gmt"],
            "categories": list(map(lambda x: tagToName[x], articleInfo["categories"])),
            "author": await GetAuthor(articleInfo["author"])
        })

def FilterArticles(category: str) -> list:
    return list(filter(lambda x: category in x["categories"], feed))

@router.get("/rss")
async def getAll(bgTasks: BackgroundTasks):
    if (datetime.now() - cacheControl).seconds > 86400: 
        bgTasks.add_task(UpdateFeed)

    global feed
    return feed


# @router.get("/rss/arts-culture")
# async def getRSSArtsCulture(bgTasks: BackgroundTasks):
#     if (datetime.now() - cacheControl).seconds > 86400: 
#         bgTasks.add_task(UpdateFeed)

#     return FilterArticles("Arts & Culture")


# @router.get("/rss/climate-sustainability")
# async def getRSSClimateSustainability(bgTasks: BackgroundTasks):
#     if (datetime.now() - cacheControl).seconds > 86400: 
#         bgTasks.add_task(UpdateFeed)

#     return FilterArticles("Climate & Sustainability")


# @router.get("/rss/earth-space")
# async def getRSSEarthSpace(bgTasks: BackgroundTasks):
#     if (datetime.now() - cacheControl).seconds > 86400:
#         bgTasks.add_task(UpdateFeed)

#     return FilterArticles("Earth & Space")


# @router.get("/rss/health")
# async def getRSSHealth(bgTasks: BackgroundTasks):
#     if (datetime.now() - cacheControl).seconds > 86400:
#         bgTasks.add_task(UpdateFeed)

#     return FilterArticles("Health")


# @router.get("/rss/social-justice-community")
# async def getRSSSocialJusticeCommunity(bgTasks: BackgroundTasks):
#     if (datetime.now() - cacheControl).seconds > 86400:
#         bgTasks.add_task(UpdateFeed)

#     return FilterArticles("Social Justice & Community")


# @router.get("/rss/student-experience")
# async def getRSSStudentExperience(bgTasks: BackgroundTasks):
#     if (datetime.now() - cacheControl).seconds > 86400:
#         bgTasks.add_task(UpdateFeed)

#     return FilterArticles("Student Experience")


# @router.get("/rss/technology")
# async def getRSSTechnology(bgTasks: BackgroundTasks):
#     if (datetime.now() - cacheControl).seconds > 86400:
#         bgTasks.add_task(UpdateFeed)

#     return FilterArticles("Technology")


# @router.get("/rss/newsletter")
# async def getNewsLetter(bgTasks: BackgroundTasks):
#     if (datetime.now() - cacheControl).seconds > 86400:
#         bgTasks.add_task(UpdateFeed)

#     return FilterArticles("Social Justice & Community")


# @router.get("/rss/be-news")
# async def getBENews(bgTasks: BackgroundTasks):
#     if (datetime.now() - cacheControl).seconds > 86400:
#         bgTasks.add_task(UpdateFeed)

#     return feed['be-news']


# @router.get("/rss/campus-news")
# async def getCampusNews(bgTasks: BackgroundTasks):
#     if (datetime.now() - cacheControl).seconds > 86400:
#         bgTasks.add_task(UpdateFeed)

#     return feed['campus-news']
