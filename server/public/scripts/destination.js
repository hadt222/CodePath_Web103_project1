const renderDestination = async () => {
  const requestedID = parseInt(window.location.href.split('/').pop(), 10)

  const response = await fetch('/destinations')
  const data = await response.json()

  const destinationContent = document.getElementById('destination-content')
  let destination

  if (data) {
    destination = data.find(d => d.id === requestedID)
  }

  if (destination) {
    document.getElementById('image').src = destination.image
    document.getElementById('image').alt = destination.name
    document.getElementById('name').textContent = destination.name
    document.getElementById('submittedBy').textContent = `Submitted by: ${destination.submittedBy}`
    document.getElementById('submittedOn').textContent = `Submitted on: ${new Date(destination.submittedOn).toLocaleDateString()}`
    document.getElementById('state').textContent = `State: ${destination.state}`
    document.getElementById('category').textContent = `Category: ${destination.category}`
    document.getElementById('description').textContent = destination.description
    document.title = `${destination.name} - Discover US`
  } else {
    const noDestinations = document.createElement('h2')
    noDestinations.textContent = 'No Destinations Available 😞'
    destinationContent.innerHTML = ''
    destinationContent.append(noDestinations)
  }
}

renderDestination()
