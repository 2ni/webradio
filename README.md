### todo
- create our own docker image based on [balena](https://www.balena.io/docs/reference/base-images/base-images/)
```
FROM balenalib/raspberrypi3:latest
RUN install_packages omxplayer
```

### about
This is a simple webradio player for a raspberry pi written in expressjs and vanilla javascript based on omxplayer.
It supports a list of streams which can be administrated on a separate page (no login) and played stopped by the control button.
Connect your rpi to an amplifier run docker and you're good to go.

### run in docker
! unfortunately omxplayer doesn't seem to work in docker for unknown reasons

```
docker-compose up
connect to <ip of rpi>:3001
```

### run directly

setup:
```
sudo apt-get install omxplayer node npm
npm install
npm run patchomx
```

start application manually:
```
npm run start
```

start application with [systemctl](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service)
```
sudo cp webradio.service /etc/systemd/system/
sudo systemctl [start|stop] webradio
sudo systemctl enable webradio # to enable  on boot
journalctl -u webradio # for logging output
```
listen to http://<ip_of_your_rpi>:3001


### optionally setup local hostname
- set eg http://radio to point to your rpi on your router, eg with a static route
- use nginx with docker on your rpi
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
