/*
 * navigation listener
 * start/stop/sound
 */
const nav = document.getElementsByClassName('navbar')[0]
nav.addEventListener('click', async (e) => {
  let elm = getElm(e)
  if (elm.classList.contains('admin')) {
    return
  }
  e.preventDefault()

  if (elm.nodeName.toLowerCase() !== 'a') {
    elm = elm.parentNode
  }

  let cmd = elm.href.replace(/^.*?([^/]*)$/, '$1')

  if (cmd === 'play' && isSelected(elm, 'select')) cmd = 'stop'

  if (cmd === 'play' && currentStation === '') {
    return
  }

  let call = '/' + cmd
  if (cmd === 'play') {
    call += '/' + currentStation
  }

  const resp = await fetch(call, {method: 'GET'})
  const data = await resp.json()

  if (resp.status != 200) {
    console.error(data)
  }

  if (resp.status === 200 && ['play', 'stop'].includes(cmd)) {
    playerStatus = cmd
    let iconElm = elm.getElementsByTagName('i')[0]
    if (cmd === 'play') {
      iconElm.innerHTML = 'ON AIR'
      iconElm.classList.remove('material-icons')
    } else {
      iconElm.innerHTML = 'play_arrow'
      iconElm.classList.add('material-icons')
    }
    toggle(elm, 'select')
  }
})

/*
 * stations listener
 */
const stations = document.getElementsByClassName('stations')[0]
if (stations) {
  stations.addEventListener('click', async (e) => {
    e.preventDefault()

    let elm = getElm(e)
    let children = elm.parentNode.children
    for (let i=0; i < children.length; i++) {
      children[i].classList.remove('select')
    }
    currentStation = elm.dataset.id

    elm.classList.add('select')

    const resp = await fetch('/station/' + elm.dataset.id, {method: 'GET'})
    const data = await resp.json()

    if (resp.status != 200) {
      console.error(data)
    }
  })
}
