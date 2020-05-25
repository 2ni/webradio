### about
This is a simple webradio player for a raspberry pi written in expressjs and vanilla javascript based on omxplayer.
It supports a list of streams which can be administrated on a separate page (no login) and played stopped by the control button.
Connect your rpi to an amplifier run docker and you're good to go.

### patch node-omxplayer to avoid crashes because of osd usage
```
npm patchomx
```

### run in dev mode for debugging or development
```
npm install
npm run dev
optionally: npm run ui
output on port 3001 or 3002, eg http://mouette:3002/  # browsersync to restart server on changes
```

### run in docker
```
docker-compose up
```
