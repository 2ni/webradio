function getElm(e) {
  return e.target || e.srcElement
}

/*
 *  toggle the style className of element elm
 */
function toggle(elm, className) {
  if (elm.classList.contains(className)) elm.classList.remove(className)
  else elm.classList.add(className)
}

/*
 * check if element is selected (contains class className)
 */
function isSelected(elm, className) {
  return (elm.classList.contains(className))
}
