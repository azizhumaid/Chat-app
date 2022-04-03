const socket = io()

const formMessage = document.querySelector('#message-form')
formMessage.addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})

socket.on('message', (message) => {
    console.log(message)
})