import sys
from flask import Flask, render_template, redirect, request
from flask_pymongo import PyMongo
import news_scrap
import tweet

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/mortgage_app"
mongo = PyMongo(app)

@app.route("/", methods = ['GET', 'POST'])
@app.route("/index", methods = ['GET', 'POST'])
def index():
    #if request.method =='POST':
    #    return redirect(url_for('index'))
    #else:
        news_scrap = mongo.db.collection.find_one()
        return render_template("index.html", news_scrap=news_scrap, tweet=tweet)

@app.route("/scrap", methods = ['GET', 'POST'])
def scraper():

    news_info = mongo.db.collection
    news_data = news_scrap.scrap()
    news_info.update({}, news_data, upsert=True)
    return redirect("/", code=302)

@app.route("/dataexploration", methods = ['GET', 'POST'])
def dataexploration():
	return render_template("dataexploration.html")

@app.route("/mortgate-rate-table", methods = ['GET', 'POST'])
def ratetable():
	return render_template("mortgage_rate_table.html")


@app.route("/price-factors", methods = ['GET', 'POST'])
def pricefactor():
	return render_template("price_factors.html")

@app.route("/timeseries", methods = ['GET', 'POST'])
def timeseries():
	return render_template("timeseries.html")

@app.route("/leaflet", methods = ['GET', 'POST'])
def leaflet():
    return render_template("leaflet.html")

@app.route("/housing-price-states-map", methods = ['GET','POST'])
def hps():
    return render_template("housing_prices_states_map.html")

if __name__ == "__main__":
    app.run(debug=True)
