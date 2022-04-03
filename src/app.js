//Import Packages
const express = require('express')
const hbs =require('hbs')
const morgan = require('morgan')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

//Intialize express and server
const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Creating Logs
if(process.env.NODE_ENV){
    app.use(morgan('dev'))
}

//use Json and routers
app.use(express.json())

//Define Paths for express config
const publicDireectoryPath = path.join(__dirname,'../public')
//Setup Static directory for handelebar
app.use(express.static(publicDireectoryPath))

module.exports = {app,server, io}