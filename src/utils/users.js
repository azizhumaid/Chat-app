const users = []

//Add user to the array
const addUser = (id, username, room) =>{

    //Validate the data
    if(!username || !room){
        return{
            error: "Username or room are required"
        }
    }

    //Clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser){
        return{
            error: "Username is in use"
        }
    }

    //Store User
    const user = {id, username, room}
    users.push(user)
    return {user}
}

//Remove a user
const removeUser = (id) =>{
    const index= users.findIndex((user) =>user.id === id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

//Read a user's data
const getUser = (id) =>{
    if(!id){
        return{
            error: "Please provide a user's id"
        }
    }

    const existingUser = users.find((user)=> user.id === id)

    if(!existingUser){
        return {
            error: "Could not find user"
        }
    }


    return existingUser
} 

//Get all users in a room
const getUsersInRoom = (room) =>{
    room = room.trim().toLowerCase()
    if(!room){
        return{
            error: "Please provide a room"
        }
    }

    const usersInRoom = users.filter((user)=>user.room === room)

    if(!usersInRoom){
        return {
            error: "Could not find users"
        }
    }

    return usersInRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}