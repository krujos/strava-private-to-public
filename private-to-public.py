from __future__ import print_function
import requests
from flask import Flask, redirect, url_for, request, session, abort, jsonify, g
import os
import sys
import logging
import json

STRAVA_CLIENT_ID = 1367

Flask.get = lambda self, path: self.route(path, methods=['get'])
Flask.put = lambda self, path: self.route(path, methods=['put'])
Flask.post = lambda self, path: self.route(path, methods=['post'])
Flask.delete = lambda self, path: self.route(path, methods=['delete'])

app = Flask(__name__)

if not os.environ.get("CLIENT_SECRET"):
    print("ERROR: CLIENT_SECRET is not defined", file=sys.stderr)
    exit(1)

client_secret = os.environ.get("CLIENT_SECRET")
Flask.secret_key = client_secret
app.secret_key = client_secret
redirect_url = "http://127.0.0.1:5000"

@app.get('/')
def index():
    """Return static content, index.html only, or handle callbacks."""

    #Call back from Strava for token exchange.
    if request.args.get('code'):
        code = request.args.get('code')
        session.permanent = True
        session['CODE'] = code
        app.logger.debug("Code = %s " % code)
        get_token(request.args.get('code'))
        return redirect(url_for('static', filename='loggedin.html'))

    return redirect(url_for('static', filename='index.html'))


def get_token(code):
    data = {"client_id": STRAVA_CLIENT_ID,
            "client_secret": client_secret,
            "code": code}

    url = 'https://www.strava.com/oauth/token'
    app.logger.debug("Post URL = %s" % url)
    response = requests.post(url, data=data)
    app.logger.info("Login post returned %d" % response.status_code)
    app.logger.debug(response.json())

    session['token'] = response.json()['access_token']
    athlete = response.json()['athlete']
    session['athlete_id'] = athlete['id']
    session['athlete_name'] = athlete['firstname'] + " " + athlete['lastname']

@app.get('/athlete')
def get_current_user():
    try:
        return jsonify({"id": session['athlete_id'],
                        "name": session['athlete_name']})
    except KeyError:
        abort(404)


@app.get('/login')
def login():
    return "https://www.strava.com/oauth/authorize?client_id=%s&response_type=code&redirect_uri=%s&scope=view_private,write" \
           % (STRAVA_CLIENT_ID, redirect_url)


@app.get('/privaterides')
def get_private_rides():
    """Attempt to get all of a users rides so we can filter out the private ones"""
    url = "https://www.strava.com/api/v3/athlete/activities"
    data = {"per_page": 50, "page": 1, "access_token": session['token']}
    response = requests.get(url, data=data)
    app.logger.debug("Strava return code = %d" % response.status_code)
    app.logger.debug(response.json())
    return json.dumps(response.json())#there has to be a better way.


if __name__ == '__main__':
    app.logger.setLevel(logging.DEBUG)
    file_handler = logging.FileHandler('strava.log')
    app.logger.addHandler(file_handler)
    app.run(host='0.0.0.0', port=5000)


