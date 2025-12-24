import feedparser, requests, bs4
from fastapi import APIRouter, BackgroundTasks
from datetime import datetime


router = APIRouter()
cacheControl: datetime = datetime.now()
feed: dict = {}

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
"""

async def getRSSFeedWithScraping(topic: str) -> list[dict]:
    # make a request to the topic page, and extract the title and dates
    response: requests.Response = requests.post(
        'https://news.ucsc.edu/wp-json/facetwp/v1/refresh',
        headers={
            'Referer': f'https://news.ucsc.edu/?_topics={topic}',
            'content-type': 'application/json',
        },
        json={
            "action": "facetwp_refresh",
            "data": {
                "facets": {"topics": [topic]},
                "frozen_facets": {},
                "http_params": {"get": {"_topics": topic}, "uri": "", "url_vars": []},
                "template": "explore_stories",
                "extras": {"sort": "default", "per_page": 100},
                "soft_refresh": 0,
                "is_bfcache": 1,
                "first_load": 0,
                "paged": 1
            }
        }
    )
    
    api_data = response.json()
    soup: bs4.BeautifulSoup = bs4.BeautifulSoup(api_data["template"], 'lxml')

    resultArticles = soup.find_all(class_='fwpl-result')
    articleToDate: dict[str, str] = {}
    for article in resultArticles:
        title: str = article.find(class_='ucsc-explore-stories__title').get_text(strip=True)
        date: str = article.find(class_='ucsc-explore-stories__date').get_text(strip=True)
        
        articleToDate[title] = date

   
    # extract stuff out of the rss feed
    feed = feedparser.parse(f'https://news.ucsc.edu/topics/{topic}/rss')
    return [
        {
            "title": entry.title,
            "link": entry.link,
            "summary": entry.summary,
            "published": articleToDate[entry.title]
        }
        for entry in feed.entries if entry.title in articleToDate
    ]

async def getRSSFeed(url: str):
    feed = feedparser.parse(url)
    return [
        {
            "title": entry.title,
            "link": entry.link,
            "summary": bs4.BeautifulSoup(entry.summary, 'lxml').get_text(strip=True).replace(' ...Read more', '...'),
            "published": entry.published
        }
        for entry in feed.entries
    ]

async def getCampusNewsFeed():
    # this endpoint returns a list of the latest posts on the webpage
    # category 1 is "campus news" (see https://news.ucsc.edu/wp-json/wp/v2/categories)
    # filter out all news that isnt in that category
    response: requests.Response = requests.get('https://news.ucsc.edu/wp-json/wp/v2/posts/')
    apiData = response.json()
    campusNews = list(filter(lambda x: 1 in x["categories"], apiData))
    return [
        {
            "title": entry["title"]["rendered"],
            "link": entry["link"],
            "summary": bs4.BeautifulSoup(entry["excerpt"]["rendered"], 'lxml').get_text(strip=True),
            "published": entry["date"]
        }
        for entry in campusNews
    ]

async def UpdateFeed():
    print('updating cache')
    for f in ["arts-culture", "climate-sustainability", 'earth-space', 'health', 'social-justice-community', 'student-experience', 'technology']:
        feed[f] = await getRSSFeedWithScraping(f)
        
    for f in ["newsletter", "be-news"]:
        feed[f] = await getRSSFeed(f)
        
    feed["campus-news"] = await getCampusNewsFeed()
    global cacheControl
    cacheControl = datetime.now()

    
@router.get("/rss/arts-culture")
async def getRSSArtsCulture(bgTasks: BackgroundTasks):
    if (datetime.now() - cacheControl).seconds > 86400: 
        bgTasks.add_task(UpdateFeed)

    return feed['arts-culture']


@router.get("/rss/climate-sustainability")
async def getRSSClimateSustainability(bgTasks: BackgroundTasks):
    if (datetime.now() - cacheControl).seconds > 86400:
        bgTasks.add_task(UpdateFeed)

    return feed['climate-sustainability']


@router.get("/rss/earth-space")
async def getRSSEarthSpace(bgTasks: BackgroundTasks):
    if (datetime.now() - cacheControl).seconds > 86400:
        bgTasks.add_task(UpdateFeed)

    return feed['earth-space']


@router.get("/rss/health")
async def getRSSHealth(bgTasks: BackgroundTasks):
    if (datetime.now() - cacheControl).seconds > 86400:
        bgTasks.add_task(UpdateFeed)

    return feed['health']


@router.get("/rss/social-justice-community")
async def getRSSSocialJusticeCommunity(bgTasks: BackgroundTasks):
    if (datetime.now() - cacheControl).seconds > 86400:
        bgTasks.add_task(UpdateFeed)

    return feed['social-justice-community']


@router.get("/rss/student-experience")
async def getRSSStudentExperience(bgTasks: BackgroundTasks):
    if (datetime.now() - cacheControl).seconds > 86400:
        bgTasks.add_task(UpdateFeed)

    return feed['student-experience']


@router.get("/rss/technology")
async def getRSSTechnology(bgTasks: BackgroundTasks):
    if (datetime.now() - cacheControl).seconds > 86400:
        bgTasks.add_task(UpdateFeed)

    return feed['technology']


@router.get("/rss/newsletter")
async def getNewsLetter(bgTasks: BackgroundTasks):
    if (datetime.now() - cacheControl).seconds > 86400:
        bgTasks.add_task(UpdateFeed)

    return feed['newsletter']


@router.get("/rss/be-news")
async def getBENews(bgTasks: BackgroundTasks):
    if (datetime.now() - cacheControl).seconds > 86400:
        bgTasks.add_task(UpdateFeed)

    return feed['be-news']


@router.get("/rss/campus-news")
async def getCampusNews(bgTasks: BackgroundTasks):
    if (datetime.now() - cacheControl).seconds > 86400:
        bgTasks.add_task(UpdateFeed)

    return feed['campus-news']
