from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import news_scrap

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/mortgage_app"
mongo = PyMongo(app)

@app.route("/")
def index():
    news_scrap = mongo.db.collection.find_one()
    return render_template("index.html", news_scrap=news_scrap)


@app.route("/scrap")
def scraper():

    news_info = mongo.db.collection
    news_data = news_scrap.scrap()
    news_info.update({}, news_data, upsert=True)
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)
