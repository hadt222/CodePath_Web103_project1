const renderDestination = async () => {
  const destinationContent = document.getElementById('destination-content')
  const requestedID = Number.parseInt(window.location.pathname.split('/').pop(), 10)

  if (Number.isNaN(requestedID)) {
    destinationContent.innerHTML = ''
    destinationContent.append(Object.assign(document.createElement('h2'), { textContent: 'Invalid destination ID' }))
    return
  }

  try {
    const response = await fetch(`/destinations/${requestedID}`, {
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const destination = await response.json()
    const submittedBy = destination.submittedBy ?? destination.submittedby ?? destination.submitted_by ?? 'Unknown'
    const submittedOn = destination.submittedOn ?? destination.submittedon ?? destination.submitted_on

    document.getElementById('image').src = destination.image
    document.getElementById('image').alt = destination.name
    document.getElementById('name').textContent = destination.name
    document.getElementById('submittedBy').textContent = `Submitted by: ${submittedBy}`
    document.getElementById('submittedOn').textContent = submittedOn
      ? `Submitted on: ${new Date(submittedOn).toLocaleDateString()}`
      : 'Submitted on: Unknown'
    document.getElementById('state').textContent = `State: ${destination.state}`
    document.getElementById('category').textContent = `Category: ${destination.category}`
    document.getElementById('description').textContent = destination.description
    document.title = `${destination.name} - Discover US`
  } catch (error) {
    console.error('Failed to load destination:', error)
    const noDestinations = document.createElement('h2')
    noDestinations.textContent = 'Unable to load destination details.'
    destinationContent.innerHTML = ''
    destinationContent.append(noDestinations)
  }
}

renderDestination()
