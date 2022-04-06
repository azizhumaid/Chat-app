const {app,server, io} = require('./app')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')
const { get } = require('express/lib/response')
const async = require('hbs/lib/async')

//Create port
const port = process.env.PORT || 4000



io.on('connection', (socket) =>{
    console.log('New WebSocket connection')


    socket.on('join', ({username, room}, callback)=>{
       const{error, user} = addUser(socket.id, username, room)
       if(error){
        return callback(error)
       }
        socket.join(user.room)
        const users = {
            room:user.room,
            users:getUsersInRoom(user.room)
        }
        socket.emit('message', generateMessage('Chat Bot','Welcome!!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Chat Bot',`${user.username} has joined`))
        io.to(user.room).emit('roomData', users)
       callback()
    })

    socket.on('sendMessage', (message ,callback) => {
        const user = getUser(socket.id)
        const filter  = new Filter()
       if(filter.isProfane(message)){
           return callback('Profanity is not allowed')
       }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('shareLocation', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            users = {
                room: user.room,
                users: getUsersInRoom(user.room)
            }
            io.to(user.room).emit('message', generateMessage('Chat Bot',`${user.username} has left`))
            // console.log('user ' + users)
            // console.log(getUsersInRoom(user.room))
            io.to(user.room).emit('roomData', users)
        }
    })
})


server.listen(port, ()=>{
    console.log("Listening on http://localhost:"+port)
})