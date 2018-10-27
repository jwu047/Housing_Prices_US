
# coding: utf-8

# In[94]:


# from splinter import Browser
import requests
from bs4 import BeautifulSoup
import pandas as pd
import pymongo


def realtweet():

    url = 'https://twitter.com/hashtag/realestate?lang=en'

    # Retrieve page with the requests module
    response = requests.get(url)
    # Create BeautifulSoup object; parse with 'lxml'
    soup = BeautifulSoup(response.text, 'lxml')

    tweet_content = {}

    browser.visit(url)
    time.sleep(0.2)

    html=browser.html
    soup=bs(html,"html.parser")

    tweet = soup.find("p", class_="TweetTextSize  js-tweet-text tweet-text").text
    username = soup.find("strong", class_="fullname show-popup-with-id u-textTruncate ").text
    handle = soup.find("span", class_="username u-dir u-textTruncate").text

    tweet_content['tweet'] = tweet
    tweet_content['username'] = username
    tweet_content['handle'] = handle

    tweet_content = {"tweet":tweet, 'username':username, 'handle': handle}
    return tweet_content
