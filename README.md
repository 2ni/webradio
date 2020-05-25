### about
This is a simple webradio player for a raspberry pi written in expressjs and vanilla javascript based on omxplayer.
It supports a list of streams which can be administrated on a separate page (no login) and played stopped by the control button.
Connect your rpi to an amplifier run docker and you're good to go.

### run in docker
```
docker-compose up
connect to <ip of rpi>:3001
```

### optionally setup local hostname
- set eg http://radio to your rpi on your router
- setup nginx with docker on your rpi
```
cd nginx
docker-compose up
```


### run in dev mode for debugging or development
```
npm install
once: npm patchomx // patch the omxplayer to avoid crashes beacuse of osd use
npm run dev
optionally: npm run ui
output on port 3001 or 3002, eg http://mouette:3002/  # browsersync to restart server on changes
```
