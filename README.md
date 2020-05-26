### about
This is a simple webradio player for a raspberry pi written in expressjs and vanilla javascript based on omxplayer.
It supports a list of streams which can be administrated on a separate page (no login) and played stopped by the control button.
Connect your rpi to an amplifier run docker and you're good to go.

### run in docker
```
docker-compose up
connect to <ip of rpi>:3001
```

### run directly

setup:
```
sudo apt-get install omxplayer node npm
npm install
npm patchomx
```

start application:
```
npm run start
```
listen to http://<ip_of_your_rpi>:3001


### optionally setup local hostname
- set eg http://radio to your rpi on your router
- setup nginx with docker on your rpi
```
cd nginx
docker-compose up
```

### run in dev mode for debugging or development

setup:
```
sudo apt-get install omxplayer node npm
npm install
npm patchomx // patch the omxplayer to avoid crashes beacuse of osd use
```

start application:
```
npm run dev
optionally: npm run ui
```

listen to http://<ip_of_your_rpi>:3002 to use with browsersync :3001 else
