
# coding: utf-8

# In[94]:


# from splinter import Browser
import requests
from bs4 import BeautifulSoup
import pandas as pd
import pymongo

def scrap():

# Set the executable path and initialize the chrome browser in splinter
    # executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    # browser = Browser('chrome', **executable_path)


    # # Market Watch Lastest News

    # In[97]:


    # URL of page to be scraped
    url = 'https://www.marketwatch.com/real-estate'

    # Retrieve page with the requests module
    response = requests.get(url)
    # Create BeautifulSoup object; parse with 'lxml'
    soup = BeautifulSoup(response.text, 'lxml')


    # In[98]:


    #Scrape the NASA Mars News Site and collect the latest News Title and Paragraph Text. 
    #Assign the text to variables that you can reference later

    #News Title from the webpage
    news_block = soup.find_all(class_='Headline2')[0].text
    print(news_block)
    #News Paragraph Text
    news_para = soup.find_all(class_='fourwide')[0]
    news_p = news_para.find('p').text
    print(news_p)


    # # Market Watch Today's Mortgage Rate

    # In[99]:


    #Mortgage Block from the webpage
    rate_block = soup.find_all(class_='block tickertable')
    #Mortgage Header
    rate_header = rate_block[0].find('h3').text
    #Mortgage chart script
    rate_chart = soup.find_all(id = 'bankratechartcontainer')


    # In[100]:


    #Use Pandas to scrape the table
    tables = pd.read_html(url)
    df = tables[0]
    df = df.drop([0])
    df =df.drop(df.columns[[2,3,4]],axis=1)
    df.columns = ['Type', 'Rate']
    df.set_index('Type', inplace=True)
    #convert the data to a HTML table string
    html_table = df.to_html()
    html_table=html_table.replace('\n', '')
    html_table


    # In[101]:


    #save html file
    df.to_html('mortgage_rate_table.html')


    news_scrap = {"news_block":news_block, 'news_p':news_p,'rate_header': rate_header,"html_table":html_table}
    return news_scrap
