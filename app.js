#!/usr/bin/env node

const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const app = express()
const os = require('os')
const omx = require('node-omxplayer')
const stationsDir = 'playlist'
const fs = require('fs')
const util = require('util')
const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const asyncMiddleware = require('./utils/asyncMiddleware')
const common = require('./utils/common')
// const lock = require('./utils/lock')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

// see https://helpdev.eu/node-js-lowdb-a-lightweight-database-alternative
// https://github.com/typicode/lowdb
const adapter = new FileSync('db.data')
const db = low(adapter)
const shortid = require('shortid')
db.defaults({ stations: [], playerStatus: 'stop', selectedStation: ''}).write()

const port = process.env.PORT || "3001"

app.locals.player = omx()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', express.static('public'))

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  helpers: require('./helpers/handlebars')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on http://${os.hostname()}:${port}`)
})

app.get('/', asyncMiddleware( async(req, res, next) => {
  //db.get('stations').push({name: 'SRF3', url: 'http://stream.srg-ssr.ch/m/drs3/aacp_96', pos: 8}).write()
  let stations = db.get('stations').sortBy('pos').value()

  /*
  const files = await readdir(stationsDir)
  await Promise.all(files.map(async (fn) => {
    if (/\.m3u$/.test(fn)) {
      const content = await readFile(path.join(stationsDir, fn), 'utf8')
      const name = fn.replace(/\.[^.]*$/, '')
      stations.push({name: name, url: content.split('\n')[0]})
    }
  }));
  */
  console.log('selectedStation', db.get('selectedStation').value())
  console.log('playerStatus', db.get('playerStatus').value())

  res.render('home', {
    stations: stations,
    currentStation: db.get('selectedStation').value(),
    playerStatus: db.get('playerStatus').value(),
    route: 'home'
  })
}))

app.get('/editstations', asyncMiddleware( async(req, res, next) => {
  let stations = db.get('stations').sortBy('pos').value()
  res.render('editstations', {
    layout: 'main',
    stations: stations,
    route: 'editstations'
  })
}))

app.get('/play/:id', (req, res) => {
  db.set('playerStatus', 'play').write()
  db.set('selectedStation', req.params.id).write()
  let station = db.get('stations').find({id: req.params.id}).value()
  console.log('player started ' + req.params.id + ' (' + station.url  + ')')
  req.app.locals.player.newSource(station.url)
  res.json({status: 'play ' + station.url})
})

app.get('/stop', (req, res) => {
  db.set('playerStatus', 'stop').write()
  console.log('player stopped')
  try {
    req.app.locals.player.quit()
  } catch (err) {
    // if message in error that player was already closed -> ignore it
    if (!err.toString().match(/player is closed/gi)) {
      res.status(500).json({err: 'could not stop player'})
      return
    }
  }

  res.json({status: 'stop'})
})

app.get('/station/:id', (req, res) => {
  db.set('selectedStation', req.params.id).write()
  let station = db.get('stations').find({id: req.params.id}).value()
  console.log('switching to ' + station.id)
  if (db.get('playerStatus').value() === 'play') {
    console.log('playing ' + station.name + ' (' + station.url  + ')')
    req.app.locals.player.newSource(station.url)
  }
  res.json({select: station.id})
})

/*
 * create new station
 */
app.post('/station/', (req, res) => {
  if (req.body.id) {
    res.status(500).json({err: 'invalid given id'})
    return
  }
  let pos = 0
  try {
    pos = parseInt(db.get('stations').sortBy('pos').last().value().pos) + 1
  } catch {}

  let data = {
    id: shortid.generate(),
    pos: pos
  }
  const id = db.get('stations').push({...data, ...common.filterObj(req.body, ['name', 'url'])}).write()
  const station = db.get('stations').find({id: data.id}).value()
  res.json(station)
})

/*
 * update a station
 */

app.put('/station/:id', (req, res) => {
  let station = db.get('stations').find({id: req.params.id})
  const curPos = parseInt(station.value().pos)

  if (!station.value()) {
    res.status(404).json({err: 'station does not exist'})
    return
  }

  let filtered = common.filterObj(req.body, ['name', 'url'])
  if (filtered) {
    station.assign(filtered).value()
  }


  if (req.body.pos) {
    let newPos = parseInt(req.body.pos)
    const lower = Math.min(curPos, newPos)
    let upper = Math.max(curPos, newPos)

    let stations = ''
    let inc = 1
    if (curPos > newPos) {
      stations = db.get('stations').filter(function(o) { return o.pos >= lower && o.pos < upper }).value()
    } else {
      inc = -1
      stations = db.get('stations').filter(function(o) { return o.pos > lower && o.pos < upper }).value()
      newPos = stations[stations.length-1].pos
    }
    stations.forEach(function(s) {
      const ss = db.get('stations').find({id: s.id})
      ss.assign({'pos': ss.value().pos + inc}).value()
    })
    station.assign({'pos': newPos}).value()
    db.write()
  }

  // return new record
  // TODO return every new position and update it in the frontend
  // TODO can't delete station if on air
  res.json(station.value())
})

/*
 * delete a station
 */
app.delete('/station/:id', (req, res) => {
  db.get('stations').remove({id: req.params.id}).write()

  res.json({'status': 'ok'})
})


/*
app.get('/volume_up', (req, res) => {
  req.app.locals.player.volUp()
  res.json({status: 'volume_up'})
})

app.get('/volume_down', (req, res) => {
  req.app.locals.player.volDown()
  res.json({status: 'volume_down'})
})
*/
