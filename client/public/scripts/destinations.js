const mainContent = document.getElementById('main-content')
let destinations = []

const createField = (labelText, name, type = 'text') => {
  const label = document.createElement('label')
  label.className = 'field'
  label.textContent = labelText

  const input = type === 'textarea'
    ? document.createElement('textarea')
    : document.createElement('input')

  input.name = name
  input.required = true

  if (type === 'textarea') {
    input.rows = 4
  } else {
    input.type = type
  }

  label.append(input)
  return label
}

const controls = document.createElement('section')
controls.className = 'page-controls'

const addButton = document.createElement('button')
addButton.type = 'button'
addButton.className = 'primary-action'
addButton.textContent = 'Add Destination'

const addForm = document.createElement('form')
addForm.className = 'destination-form hidden'
addForm.append(
  createField('Name', 'name'),
  createField('State', 'state'),
  createField('Category', 'category'),
  createField('Image URL', 'image', 'url'),
  createField('Description', 'description', 'textarea'),
  createField('Submitted By', 'submittedBy')
)

const formActions = document.createElement('div')
formActions.className = 'form-actions'

const saveButton = document.createElement('button')
saveButton.type = 'submit'
saveButton.className = 'primary-action'
saveButton.textContent = 'Save Destination'

const cancelButton = document.createElement('button')
cancelButton.type = 'button'
cancelButton.className = 'secondary-action'
cancelButton.textContent = 'Cancel'

formActions.append(saveButton, cancelButton)
addForm.append(formActions)

const message = document.createElement('p')
message.className = 'status-message'

const cardsGrid = document.createElement('section')
cardsGrid.id = 'destinations-grid'

controls.append(addButton, addForm, message)
mainContent.append(cardsGrid, controls)

const setMessage = (text, isError = false) => {
  message.textContent = text
  message.className = isError ? 'status-message error' : 'status-message'
}

const renderCards = () => {
  cardsGrid.innerHTML = ''

  if (destinations.length === 0) {
    const emptyState = document.createElement('h2')
    emptyState.textContent = 'No Destinations Available'
    cardsGrid.append(emptyState)
    return
  }

  destinations.forEach((destination) => {
    const card = document.createElement('article')
    card.className = 'card'

    const cardTop = document.createElement('div')
    cardTop.className = 'card-top'

    const deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.className = 'delete-button'
    deleteButton.textContent = 'x'
    deleteButton.setAttribute('aria-label', `Delete ${destination.name}`)
    deleteButton.addEventListener('click', async () => {
      const confirmed = window.confirm(`Delete ${destination.name}?`)

      if (!confirmed) {
        return
      }

      try {
        const response = await fetch(`/destinations/${destination.id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error(`Delete failed with status ${response.status}`)
        }

        destinations = destinations.filter((item) => item.id !== destination.id)
        renderCards()
        setMessage(`${destination.name} deleted.`)
      } catch (error) {
        console.error('Failed to delete destination:', error)
        setMessage('Unable to delete destination.', true)
      }
    })

    const topContainer = document.createElement('div')
    topContainer.className = 'top-container'
    topContainer.style.backgroundImage = `url("${destination.image}")`

    const bottomContainer = document.createElement('div')
    bottomContainer.className = 'bottom-container'

    const nameEl = document.createElement('h3')
    nameEl.textContent = destination.name

    const stateEl = document.createElement('p')
    stateEl.textContent = destination.state

    const categoryEl = document.createElement('p')
    categoryEl.textContent = destination.category

    const link = document.createElement('a')
    link.textContent = 'Read More >'
    link.href = `/destinations/${destination.id}`
    link.setAttribute('role', 'button')

    bottomContainer.append(nameEl, stateEl, categoryEl, link)
    cardTop.append(deleteButton)
    card.append(cardTop, topContainer, bottomContainer)
    cardsGrid.append(card)
  })
}

const loadDestinations = async () => {
  try {
    const response = await fetch('/destinations')

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    destinations = await response.json()
    renderCards()
  } catch (error) {
    console.error('Failed to load destinations:', error)
    setMessage('Unable to load destinations.', true)
  }
}

addButton.addEventListener('click', () => {
  addForm.classList.toggle('hidden')
  setMessage('')
})

cancelButton.addEventListener('click', () => {
  addForm.reset()
  addForm.classList.add('hidden')
  setMessage('')
})

addForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData(addForm)
  const payload = Object.fromEntries(formData.entries())

  try {
    const response = await fetch('/destinations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Create failed with status ${response.status}`)
    }

    const createdDestination = await response.json()
    destinations = [createdDestination, ...destinations]
    renderCards()
    addForm.reset()
    addForm.classList.add('hidden')
    setMessage(`${createdDestination.name} added.`)
  } catch (error) {
    console.error('Failed to create destination:', error)
    setMessage('Unable to add destination.', true)
  }
})

const pathSegments = window.location.pathname.split('/').filter(Boolean)

if (pathSegments.length === 0) {
  loadDestinations()
} else if (pathSegments[0] === 'destinations' && pathSegments.length === 2 && /^\d+$/.test(pathSegments[1])) {
  window.location.href = window.location.pathname
} else {
  window.location.href = '/404.html'
}
