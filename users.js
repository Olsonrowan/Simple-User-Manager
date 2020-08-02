class User {
    constructor(name, id, email, password, age){
        this.name = name,
        this.id = id,
        this.email = email,
        this.password = password,
        this.age = age
    }
    validatePassword(password){
        if(password === this.password){
             return true;
        }else{ 
            return false;
        }
    }
    updateName(updatedName){
        this.name = updatedName
    }
    updateEmail(updatedEmail){
        this.email = updatedEmail
        
    }
    updateAge(updatedAge){
        this.age = updatedAge
        
    }
}

function randomID(){
    return Math.floor(Math.random(1000) * 100)
}

class Users {
    constructor(){
        this.userCollection = []
    }
    addUser(user){
        this.userCollection.push(user)
    }
    findOne(email, callback){
        this.userCollection.filter(user =>{
            if(user.email === email) {
                callback(null, user);
            }
        })
    }
    findById(id){
        console.log(id)
        return this.userCollection.find(
            
            function(user){
                if(user.id == id){
                    return true;
                } else {
                    return false;
                }
            }
        )
    }
    updateById(id, newData){
       let foundUser = this.findById(id)
       console.log(foundUser)
       foundUser.updateAge(newData.age)
       foundUser.updateEmail(newData.email)
       foundUser.updateName(newData.name)
    

    }
    deleteById(id){
        let userPosition = this.userCollection.findIndex(
            function(user){
            if(user.id == id){
                return true;
            } else {
                return false;
            }
        })
        this.userCollection.splice(userPosition, 1)

    }
}

module.exports = {
    randomID,
    users: Users,
    user: User
}