import feedparser, requests, bs4, json
from fastapi import APIRouter, BackgroundTasks
from datetime import datetime, timezone
from urllib.parse import unquote


"""
Intended method is to use these two endpoints for the main feeds:
https://news.ucsc.edu/wp-json/wp/v2/posts?per_page=100
https://news.ucsc.edu/wp-json/wp/v2/categories

Then use RSS feeds for the BE Newsletter and BE News.



Prior to UCSC's migration to Wordpress, each individual news.ucsc.edu topic had an RSS feed, and this code originally read that. 
Post migration, the RSS feeds do still exist, but they suck now. The new news.ucsc.edu RSS feeds only have the title, link, and summary, but not the date. In
order to get the date, you would need to make a second network request to the ?_topics= API response and read that. 

However, the Baskin Engineering RSS feeds still have all the required data, so I just pull from that.

I've still archived the links to each RSS feed/topic endpoint here, because it took me a while to find them and I don't want to lose it.

Campus News                             https://news.ucsc.edu/rss
Arts & Culture                          https://news.ucsc.edu/topics/arts-culture/rss              https://news.ucsc.edu/?_topics=arts-culture
Climate & Sustainability                https://news.ucsc.edu/topics/climate-sustainability/rss    https://news.ucsc.edu/?_topics=climate-sustainability
Earth & Space                           https://news.ucsc.edu/topics/earth-space/rss               https://news.ucsc.edu/?_topics=earth-space
Health                                  https://news.ucsc.edu/topics/health/rss                    https://news.ucsc.edu/?_topics=health
Social Justice & Community              https://news.ucsc.edu/topics/social-justice-community/rss  https://news.ucsc.edu/?_topics=social-justice-community
Student Experience                      https://news.ucsc.edu/topics/student-experience/rss        https://news.ucsc.edu/?_topics=student-experience
Technology                              https://news.ucsc.edu/topics/technology/rss                https://news.ucsc.edu/?_topics=technology
Baskin Engineering Undergrad Newsletter https://undergrad.engineering.ucsc.edu/rss                 
BE Community News                       https://engineering.ucsc.edu/topics/news/rss         

"""


router = APIRouter()
# cacheControl: datetime = datetime.now()
tagToName: dict = {}
# nameToTag: dict = {}
feed: list = []
# authorCache: dict = {}

def GetTextFromRendered(rendered: str) -> str:
	return bs4.BeautifulSoup(rendered, 'lxml').get_text(strip=True)

async def GetTagMap() -> dict:
	response: requests.Response = requests.get('https://news.ucsc.edu/wp-json/wp/v2/categories')
	apiData: dict = response.json()
	# global tagToName
	# tagToName.clear()
	tagToName: dict = {}
	# nameToTag: dict = {}

	for category in apiData:
		id, name = category["id"], category["name"].replace('&amp;', '&')
		
		tagToName[id] = name
		# nameToTag[name] = id
	
	tagToName[-10] = "Baskin Undergrad Newsletter"
	# nameToTag["Baskin Undergrad Newsletter"] = -10

	tagToName[-11] = "Baskin Community News"
	# nameToTag["Baskin Community News"] = -11

	return tagToName

# dedicated function to scrape and cache news. ran via cron job
async def UpdateFeed():
	print("Updating news feed...")
	startTime: datetime = datetime.now()

	tagToName: dict = await GetTagMap()

	feed: list[dict] = await GetArticles(tagToName)
	beNewsletterPosts: list[dict] = await getRSSFeed('https://undergrad.engineering.ucsc.edu/rss', -10, tagToName)
	beCommunityNews: list[dict] = await getRSSFeed('https://engineering.ucsc.edu/topics/news/rss', -11, tagToName)

	feed = feed + beNewsletterPosts + beCommunityNews
	feed = sorted(feed, key=lambda a: datetime.fromisoformat(a["published"]), reverse=True)
	
	with open('cache/news.json', 'w', encoding='utf-8') as file:
		json.dump(feed, file)
	
	print("Finished updating news feed. Time taken:", datetime.now() - startTime)


async def GetArticles(tagToName: dict) -> list[dict]:
	response: requests.Response = requests.get('https://news.ucsc.edu/wp-json/wp/v2/posts?per_page=100')
	apiData: dict = response.json()

	feed: list[dict] = []
	for articleInfo in apiData:
		dt = datetime.fromisoformat(articleInfo["date_gmt"])
		if dt.tzinfo is None:
			dt = dt.replace(tzinfo=timezone.utc)
			
		feed.append({
			"title": GetTextFromRendered(articleInfo["title"]["rendered"]),
			"link": articleInfo["link"],
			"summary": GetTextFromRendered(articleInfo["excerpt"]["rendered"]),
			"published": dt.isoformat(),
			"categories": list(map(lambda x: tagToName[x], articleInfo["categories"]))
		})
	
	return feed


async def getRSSFeed(url: str, category: int, tagToName: dict) -> list[dict]:
	feed: feedparser.FeedParserDict = feedparser.parse(url)
	return [
		{
			"title": entry.title,
			"link": entry.link,
			"summary": GetTextFromRendered(entry.summary).replace(' ...Read more', '...'), #type: ignore
			"published": datetime.strptime(str(entry.published), '%a, %d %b %Y %H:%M:%S %z').isoformat(),
			"categories": [tagToName[category]]
		}
		for entry in feed.entries
	]


c: list[str] = [
	"Campus News",
	"Arts & Culture",
	"Climate & Sustainability",
	"Earth & Space",
	"Health",
	"Social Justice & Community",
	"Student Experience",
	"Technology",
	"Baskin Undergrad Newsletter",
	"Baskin Community News"
]

@router.get("/rss")
async def getAll(categories: int|None = None):
	with open('cache/news.json', 'r', encoding='utf-8') as file:
		feed: list = json.load(file)

	if not categories: return feed

	cList: set[str] = set()
	for i in range(len(c)):
		if categories & (0x01 << i): 
			cList.add(c[i])
	
	print(categories, cList)
	return [article for article in feed if len(set(article["categories"]).intersection(cList)) > 0]
