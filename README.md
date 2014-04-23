strava-private-to-public
========================
Somewhere along the line I managed to make a bunch of outside rides private, and a bunch of trainer rides public. This will not do. Thus a quick and dirty bulk updater that will show me the rides in error, and fix them to my liking. Trainer rides become prviate, outside rides become public. Simply looks at the booleans the Strava API provides, does not do anything fancy about checking distance or anything... 

To setup: 
Register a new strava app (https://www.strava.com/settings/api)
Create a new virtual env
pip install requirements.txt
Change the strava client ID to whatever yours is in private-to-public.py
export CLIENT_SECRET=whatever strava told you your client secret was
python public-to-private.py
navigate to http://localhost:5000

Could proabably be hosted, should there be enough interest raise an issue and I'll stick it on openshift of something.
