const {app,server, io} = require('./app')


// app.get('',(req,res)=>{
//     res.render('index')
// })

//Create port
const port = process.env.PORT || 4000



io.on('connection', (socket) =>{
    console.log('New WebSocket connection')
    socket.emit('message', 'Welcome!!')
    socket.broadcast.emit('message', 'A new user joined')

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

    socket.on('disconnect',() => {
        io.emit('message', 'User left')
    })
})


server.listen(port, ()=>{
    console.log("Listening on http://localhost:"+port)
})