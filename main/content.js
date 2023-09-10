const main = () => {
  if (window.location.href.indexOf('https://www.youtube.com/shorts/') === -1) return
  const newDiv = document.createElement('a')
  newDiv.className = 'ytp-menuitem'
  newDiv.target = '_blank'
  newDiv.role = 'menuitem'
  newDiv.href = ''
  newDiv.id = 'to-full-video'

  const newDivInnerHTML = `
    <div class="ytp-menuitem-icon" style="color:white">
    <svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" width="100px" height="100px" fill="white" stroke="#fff">
  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="SVGRepo_iconCarrier">
    <style type="text/css">
      .st0{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
      .st1{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
      .st2{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:5.2066,0;}
    </style>
    <rect x="4" y="4" class="st0" width="24" height="16"/>
    <polygon class="st0" points="14,9 14,15 18,12 "/>
    <circle class="st0" cx="10" cy="26" r="2"/>
    <line class="st0" x1="4" y1="26" x2="8" y2="26"/>
    <line class="st0" x1="15" y1="26" x2="28" y2="26"/>
  </g>
</svg>

    </div>
    <div class="ytp-menuitem-label">To full video</div>
    <div class="ytp-menuitem-content"></div>
  `

  newDiv.innerHTML = newDivInnerHTML

  document.removeEventListener('yt-navigate-finish', addConversionLink)
  document.addEventListener('yt-navigate-finish', addConversionLink)

  function addConversionLink(elem) {
    const currentUrl = window.location.href
    const videoID = currentUrl.split('/').pop()
    const newVideoUrl = `https://www.youtube.com/watch?v=${videoID}`
    elem.href = newVideoUrl
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    const targetNode = document.querySelector('body > div.ytp-popup.ytp-contextmenu > div > div')
    targetNode.style.height = 'fit-content'

    if (targetNode) {
      observer.disconnect() // Отключаем наблюдение, так как элемент найден
      const elemExist = document.querySelector('#to-full-video')
      if (elemExist) addConversionLink(elemExist)
      else {
        // Вставляем элемент перед пятым ребенком
        addConversionLink(newDiv)
        targetNode.insertBefore(newDiv, targetNode.children[4])
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

let oldHref = document.location.href
let firstLoad = true
const observeEvent = new Event('windowUrlChange')

const observeUrlChange = () => {
  if (firstLoad) {
    window.dispatchEvent(observeEvent)
    firstLoad = false
  }
  const body = document.querySelector('body')
  const observer = new MutationObserver((mutations) => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href
      window.dispatchEvent(observeEvent)
    }
  })
  observer.observe(body, { childList: true, subtree: true })
}

window.addEventListener('load', observeUrlChange)
window.addEventListener('windowUrlChange', main)
