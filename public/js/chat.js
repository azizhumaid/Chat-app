//Import required lib
const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationUrlTemplate = document.querySelector('#share-location-template').innerHTML
//Show any message from server
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

//Listen to share a location from a server
socket.on('shareLocation', (url) => {
    console.log(url)
    const html = Mustache.render(locationUrlTemplate,{
        url:url.url,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

//Form Listner
$messageForm.addEventListener('submit', (e) => {
    //Prevent the page from reloading
    e.preventDefault()
    //Disable the button while sending the message
    $messageFormButton.setAttribute('disabled', 'disabled')
    //Send the message
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error)=>{
        //Enable users to click send again
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
    })
})


//Share location
$sendLocation.addEventListener('click', () =>{
    $sendLocation.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation){
        $sendLocation.removeAttribute('disabled')
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) =>{
        const location = {
            longitude: position.coords.longitude,
            latitude:position.coords.latitude
        }
        socket.emit('sendLocation',location, () => {
            $sendLocation.removeAttribute('disabled')
            console.log('Location Shared!!')
        })
    })
})