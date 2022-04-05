const {app,server, io} = require('./app')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
// app.get('',(req,res)=>{
//     res.render('index')
// })

//Create port
const port = process.env.PORT || 4000



io.on('connection', (socket) =>{
    console.log('New WebSocket connection')
    socket.emit('message', generateMessage('Welcome!!'))
    socket.broadcast.emit('message', generateMessage('A new user joined'))

    socket.on('sendMessage', (message ,callback) => {
        const filter  = new Filter()
       if(filter.isProfane(message)){
           return callback('Profanity is not allowed')
       }

        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('shareLocation', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })

    socket.on('disconnect',() => {
        io.emit('message', generateMessage('User left'))
    })
})


server.listen(port, ()=>{
    console.log("Listening on http://localhost:"+port)
})