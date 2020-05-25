/*
 * stations edit page listener
 */
const editstations = document.getElementsByClassName('editstations')[0]
/*
editstations.addEventListener('click', async (e) => {
  const elm = getElm(e)
  if (elm.parentNode.classList.contains('new')) {
    document.execCommand('selectAll', false, null)
  }
})
*/

async function saveStation(elm) {
  let method = 'PUT'
  const input = {}
  input[elm.dataset.arg] = elm.innerHTML
  const id = elm.parentNode.dataset.id || ''

  // new entry
  if (!id) {
    let neighbour = elm.nextElementSibling
    if (neighbour.tagName != 'DIV') neighbour = elm.previousElementSibling

    if (elm.innerHTML && neighbour.innerHTML) {
      method = 'POST'
      input[neighbour.dataset.arg] = neighbour.innerHTML
    } else {
      // don't make call at all
      return
    }
  }

  const resp = await fetch('/station/' + id, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: method,
    body: JSON.stringify(input)
  })
  const data = await resp.json()

  // new entry
  if (method === 'POST') {
    const newElm = elm.parentNode.cloneNode(true)
    for (let i=0; i < newElm.children.length; i++) {
      const child = newElm.children[i]
      if (child.tagName === 'DIV') child.innerHTML = ''
    }
    elm.parentNode.dataset.id = data.id
    elm.parentNode.dataset.pos = data.pos
    elm.parentNode.setAttribute('draggable', true)
    elm.parentNode.parentNode.appendChild(newElm)
  }

  return data
}

/*
 * edit station
 */
editstations.addEventListener('keydown', async (e) => {
  const elm = getElm(e)
  const esc = e.which === 27, enter = e.which === 13, tab = e.which === 9
  if (esc) {
    document.execCommand('undo')
    elm.blur()
  } else if (enter) {
    e.preventDefault()
    saveStation(elm)
    elm.blur()
    try {
      const x = (elm.nextElementSibling || elm.parentNode.nextElementSibling.children[0]).focus()
    } catch {}
  } else if (tab) {
    saveStation(elm)
  }
})

/*
 * handle overlay to delete station
 */
const shim = document.getElementById('shim')

function showOverlay(elmEditStation) {
  const overlay = document.createElement('div')
  overlay.setAttribute('data-id', '')
  overlay.setAttribute('class', 'msgbox')
  overlay.innerHTML = 'Are you sure to delete the station <span>' + elmEditStation.dataset.name + '</span>?  <div> <button class="btn btn-ok material-icons">check</button> <button class="btn btn-cancel material-icons">cancel</button> </div>'
  elmEditStation.appendChild(overlay)

  shim.style.display = 'block';
}

function destroyOverlay(elmEditstation) {
  const overlay = elmEditstation.getElementsByClassName('msgbox')[0]
  elmEditstation.removeChild(overlay)
  shim.style.display = 'none'
}

async function deleteStation(elmEditstation) {
  const resp = await fetch('/station/' + elmEditstation.dataset.id, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'DELETE'
  })
  const data = await resp.json()
  elmEditstation.parentNode.removeChild(elmEditstation)
  destroyOverlay(elmEditstation)
  return data
}

editstations.addEventListener('click', async (e) => {
  e.preventDefault()
  const elm = getElm(e)
  const cmd  = elm.classList.value.replace(/^.*btn-([^ ]*).*$/, '$1')

  switch (cmd) {
    case 'delete':
      if (elm.parentNode.dataset.id) {
        showOverlay(elm.parentNode)
      }
      break
    case 'cancel':
      destroyOverlay(elm.parentNode.parentNode.parentNode)
      break
    case 'ok':
      deleteStation(elm.parentNode.parentNode.parentNode)
      break
  }
})

window.addEventListener('keydown', async (e) => {
  if (e.which === 13 && shim.style.display === 'block') {
    const elm = getElm(e)
    deleteStation(elm.parentNode)
  } else if (e.which === 27) {
    for (let i=0; i < editstations.children.length; i++) {
      const elmEditstation = editstations.children[i]
      const msgbox = elmEditstation.getElementsByClassName('msgbox')
      if (msgbox[0]) {
        destroyOverlay(elmEditstation)
        return
      }
    }
  }
})

/*
 * handle dragging
 * drag, dragstart, dragend, dragover, dragenter, dragleave, drop
 */
let draggedElm = ''
editstations.addEventListener('dragstart', async (e) => {
  draggedElm = getElm(e)
  draggedElm.style.opacity = .5
})

let lastElm = ''
editstations.addEventListener('dragover', async (e) => {
  let elm = getElm(e)
  if (!elm) return
  if (!elm.getAttribute('draggable')) elm = elm.parentNode
  if (elm === draggedElm || elm.previousElementSibling === draggedElm) {
    elm.style.borderTop = ''
    if (lastElm) lastElm.style.borderTop = ''
    lastElm = elm
    return
  }

  if (elm && elm != lastElm) {
    elm.style.borderTop = '3px dashed black'
    if (lastElm) {
      lastElm.style.borderTop = ''
    }
    lastElm = elm
  }
})

editstations.addEventListener('dragend', async (e) => {
  const elm = getElm(e)
  const pos = lastElm.dataset.pos || parseInt(lastElm.previousElementSibling.dataset.pos) +1
  draggedElm = ''
  elm.parentNode.insertBefore(elm, lastElm)
  elm.style.opacity = ''
  elm.style.border = ''
  lastElm.style.border = ''

  const resp = await fetch('/station/' + elm.dataset.id, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PUT',
    body: JSON.stringify({pos: pos})
  })
  const data = await resp.json()

})

/*
editstations.addEventListener('focusout', async (e) => {
  console.log('blurred', e.which)
})

editstations.addEventListener('focusin', async (e) => {
  console.log('focus')
})
*/
