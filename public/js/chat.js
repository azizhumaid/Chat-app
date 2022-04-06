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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})

const autoscroll = ()=>{
    //new message element
    const $newMessage = $messages.lastElementChild

    //Get height of new message
    const newMessageStyle =  getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight =  $messages.offsetHeight

    //height of messages container
    const containerHeight =  $messages.scrollHeight

    //How far have I scrolled
    const scrollOffset =  $messages.scrollTop + visibleHeight

    if(containerHeight-newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
    console.log(newMessageMargin)
}

//Messages
//Show any message from server
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

//Listen to share a location from a server
socket.on('shareLocation', (url) => {
    console.log(url)
    const html = Mustache.render(locationUrlTemplate,{
        username:url.username,
        url:url.url,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
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

//Users in chat room
socket.on('roomData', (users) => {
    const html = Mustache.render(sidebarTemplate,{
        room:users.room,
        users:users.users
    })
    document.querySelector('#sidebar').innerHTML = html
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

socket.emit('join', {username, room}, (error) =>{
    if(error){
        alert(error)
        location.href = '/'
    }
}) 

