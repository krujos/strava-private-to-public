from __future__ import print_function
import requests
from flask import Flask, redirect, url_for, request, session, abort, jsonify
import os
import sys
import logging

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
app.config['SECRET_KEY'] = client_secret
redirect_url = "http://127.0.0.1:5000"


@app.get('/')
def index():
    """Return static content, index.html only, or handle callbacks."""

    #Call back from Strava for token exchange.
    if request.args.get('code'):
        code = request.args.get('code')
        session['CODE'] = code
        app.logger.debug("Code = %s " % code)
        get_token(request.args.get('code'))
        return redirect(url_for('static', filename='loggedin.html'))

    return redirect(url_for('static', filename='index.html'))


@app.get('/athleteinfo')
def get_current_user():
    try:
        return jsonify(session['athlete'])
    except KeyError:
        abort(404)


def get_token(code):
    data = {"client_id": STRAVA_CLIENT_ID,
            "client_secret": client_secret,
            "code": code}

    url = 'https://www.strava.com/oauth/token'
    app.logger.debug("Post URL = %s" % url)
    response = requests.post(url, data=data)
    app.logger.info("Login post returned %d" % response.status_code)
    app.logger.debug(response.json())
    session['TOKEN'] = response.json()['access_token']
    session['athlete'] = response.json()['athlete']


@app.get('/login')
def login():
    return "https://www.strava.com/oauth/authorize?client_id=%s&response_type=code&redirect_uri=%s&scope=view_private,write" \
           % (STRAVA_CLIENT_ID, redirect_url)


if __name__ == '__main__':
    app.logger.setLevel(logging.DEBUG)
    file_handler = logging.FileHandler('strava.log')
    app.logger.addHandler(file_handler)
    app.run(host='0.0.0.0', port=5000)


