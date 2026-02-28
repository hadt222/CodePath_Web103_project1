const renderDestinations = async () => {
  const response = await fetch('/destinations')
  const data = await response.json()

  const mainContent = document.getElementById('main-content')

  if (data) {
    data.map(destination => {
      const card = document.createElement('div')
      card.className = 'card'

      const topContainer = document.createElement('div')
      topContainer.className = 'top-container'
      topContainer.style.backgroundImage = `url("${destination.image}")`

      const bottomContainer = document.createElement('div')
      bottomContainer.className = 'bottom-container'

      const nameEl = document.createElement('h3')
      nameEl.textContent = destination.name
      bottomContainer.append(nameEl)

      const stateEl = document.createElement('p')
      stateEl.textContent = destination.state
      bottomContainer.append(stateEl)

      const categoryEl = document.createElement('p')
      categoryEl.textContent = destination.category
      bottomContainer.append(categoryEl)

      const link = document.createElement('a')
      link.textContent = 'Read More >'
      link.href = `/destinations/${destination.id}`
      link.setAttribute('role', 'button')
      bottomContainer.append(link)

      card.append(topContainer, bottomContainer)
      mainContent.append(card)
    })
  } else {
    const noDestinations = document.createElement('h2')
    noDestinations.textContent = 'No Destinations Available 😞'
    mainContent.append(noDestinations)
  }
}

const pathSegments = window.location.pathname.split('/').filter(Boolean)

if (pathSegments.length === 0) {
  renderDestinations()
} else if (pathSegments[0] === 'destinations' && pathSegments.length === 2 && /^\d+$/.test(pathSegments[1])) {
  // Valid destination detail URL; index.html was served (e.g. Vite SPA fallback). Force full load so server returns destination.html.
  window.location.href = window.location.pathname
} else {
  window.location.href = '/404.html'
}
