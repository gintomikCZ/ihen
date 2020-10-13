export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const get2DigitsString = (numb) => {
  if (typeof numb !== 'number') return null
  return numb < 10 ? '0' + numb : '' + numb
}
export const thousandSeparators = (string) => {
  if (!string) return ''
  const str = string.toString()
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
export const getUniqueId = () => {
  const a = Date.now()
  return '_' + (Number(String(Math.random()).slice(2)) + a + Date.now()).toString(36)
}
export const ucfirst = (value) => {
  if (!value) return ''
  const str = value.toString()
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
export const ucwords = (value) => {
  if (!value) return ''
  const str = value.toString().split(' ')
  return str.reduce((acc, cur) => {
    return acc + ' ' + cur.charAt(0).toUpperCase() + cur.slice(1).toLowerCase()
  }, '')
}
export const isNumeric = str => {
  return /^[0-9]*$/.test(str)
}
export const trim = (value) => {
  if (!value) return ''
  return value.toString().trim()
}
export const lower = (value) => {
  if (!value) return ''
  return value.toString().toLowerCase()
}
export const generateZindex = () => {
  const body = document.querySelector('body')
  if (Object.prototype.hasOwnProperty.call(body, 'highestZindex')) {
    body.highestZindex += 1
    return body.highestZindex
  }
  Object.defineProperty(body, 'highestZindex', { value: 99, writable: true })
  return 99
}
export const getViewport = () => {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight
  }
}
export const range = (start, end) => {
  return Array.from({ length: end - start + 1 }, (item, i) => i + start)
}
export const getWindowScrollTop = () => {
  const doc = document.documentElement
  return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
}
export const getWindowScrollLeft = () => {
  const doc = document.documentElement
  return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
}
export const getHiddenElementDimensions = (element) => {
  const dimensions = {}
  element.style.visibility = 'hidden'
  element.style.display = 'block'
  dimensions.width = element.offsetWidth
  dimensions.height = element.offsetHeight
  element.style.display = 'none'
  element.style.visibility = 'visible'
  return dimensions
}
export const setCaretPosition = (input, position = 'end') => {
  const pos = position === 'end' ? input.value.length : position
  // Modern browsers
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(pos, pos);
  // IE8 and below
  } else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}
export const absolutePosition = (element, target, topOffset = 0, leftOffset = 0) => {
  // offsetParent serves to determine whether the element is hidden or not
  const elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : getHiddenElementDimensions(element)
  const elementOuterHeight = elementDimensions.height
  const elementOuterWidth = elementDimensions.width
  const targetOuterHeight = target.offsetHeight
  const targetOuterWidth = target.offsetWidth
  const targetOffset = target.getBoundingClientRect()
  const windowScrollTop = window.pageYOffset
  const windowScrollLeft = window.pageXOffset
  const viewport = getViewport()
  let top
  let left
  let heightRatio = 1
  let widthRatio = 1
  console.log(targetOffset, elementOuterWidth)
  const availableHeight = viewport.height - topOffset
  const availableWidth = viewport.width - leftOffset
  // if the element doesn't fit into the available height, we don't care where the target actually is,
  // we make the element smaller and we do respect the top offset (calculating it from the top of the viewport)
  if (elementOuterHeight > availableHeight) {
    top = topOffset
    heightRatio = availableHeight / elementOuterHeight
  }
  // if the element fits under the target, it goes under it (respecting the topOffset from the target bottom)
  else if ((targetOffset.bottom + elementOuterHeight + topOffset) <= viewport.height) {
    top = targetOffset.bottom + topOffset
  }
  //if the element fits above the target, it goes above (respecting the topOffset which is now a space above the target and below the element)
  else if (targetOffset.top >= (elementOuterHeight + topOffset)) {
    top = targetOffset.top - elementOuterHeight - topOffset
  }
  // if no previous option apply, we align the middle of the element to the middle of the target
  else top = (targetOffset.top + (targetOuterHeight / 2)) - (elementOuterHeight / 2)

  //calculating left

  // if the element doesn't fit horizontaly to the viewport avaiilable width, we don't care the tareget width,
  // we make the element narrower and we do respect the left offset (calculating it from the left viewport edge)
  if (elementOuterWidth > availableWidth) {
    console.log('first')
    left = leftOffset
    widthRatio = availableWidth / elementOuterWidth
  }
  // if it fits on right side of the target, it goes right, respecting the left offset from the right side of the targe
  else if ((targetOffset.left + elementOuterWidth + leftOffset) <= viewport.width && 1 === 2) {
    console.log('second')
    left = targetOffset.left + leftOffset
  }

  //if it fits on left side, it goes there, the leftOffset is a space on left from the target
  else if (targetOffset.right >= (elementOuterWidth + leftOffset)) {
    console.log('third')
    console.log(targetOffset.left, elementOuterWidth, leftOffset, targetOuterWidth)
    left = targetOffset.left - elementOuterWidth - leftOffset + targetOuterWidth
  }
  // if no previous option apply, we align the middle of the element to the middle of the target
  else left = (targetOffset.left + (targetOuterWidth / 2)) - (elementOuterWidth / 2)
  if (heightRatio !== 1 || widthRatio !== 1) {
    const ratio = Math.min(heightRatio, widthRatio)
    element.style.transform = 'scale(' + ratio + ')'
    element.style.transformOrigin = 'top left'
  }
  top += windowScrollTop
  left += windowScrollLeft
  left += leftOffset
  element.style.top = top + 'px'
  element.style.left = left + 'px'
  element.style.display = 'block'
  console.log(element.style.top, element.style.left, element.offsetWidth)
}

