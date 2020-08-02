const express = require('express');
let app = express();
const path = require('path')
const passport = require('passport')
const cookieParser = require('cookie-parser');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash')
const Usersclass = require("./users");
let userCollection = new Usersclass.users();

app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));
app.use(require('express-session')({
    secret: 'super secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());
passport.serializeUser((user, done) =>{
    done(null, user);
})
passport.deserializeUser((user,done) =>{
    done(null, user);
})

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
},
(email, password, done) => {
    userCollection.findOne(email, (err, user) =>{
        if (err) {
             return done(err); 
        }if (!user) {
            return done(null, false, { message: 'Incorrect email.' });        
        }if (!user.validatePassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });        
        } else{
        return done(null, user);        
        }
    })
}
))

app.post('/login', passport.authenticate('local', {
    successRedirect: '/UserListing',
    failureFlash: '/login',
    failureFlash: true
}))
app.get('/login', (req, res) =>{
    res.render('login')
})
app.post('/login', (req, res) =>{
    res.redirect('/UserListing')
})

app.get('/logout', (req, res) =>{
    req.logout();
    res.redirect('/')
})
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/login');
}
app.get('/getfile', isLoggedIn, (req, res) =>{
    let filepath = path.join(__dirname, 'data', 'data.json');
    res.sendFile(filepath)
})

app.get('/UserListing', (req, res)=>{
    res.render('UserListing', {
        userList: userCollection
    });
})

app.get('/', (req,res) =>{
    res.render('index', {
        
        date: new Date()
    });
});
app.post('/', (req, res) =>{
    res.render('index', {
        
        date: new Date()
    });
})

app.get('/create', (req,res) =>{
    res.render('create')
})

app.post('/create', (req, res) =>{    
let newUser = new Usersclass.user(
    
    req.body.name,
    Usersclass.randomID(),
    req.body.email,
    req.body.password,
    req.body.age
    )
    userCollection.addUser(newUser)
    
    res.redirect('/UserListing')
   
})


app.get('/edit/:id', (req,res) =>{

    let id = req.params.id;
    let editedUser = userCollection.findById(id)
    res.render('edit', {
        editedUser: editedUser
    })
})

app.post('/edit/:id', (req, res) =>{
    let newUserData = {
    name: req.body.name,
    email: req.body.email,
    age: req.body.age
    }
    console.log(newUserData)
    let id = req.params.id;
    userCollection.updateById(id, newUserData)
    res.redirect('/UserListing')

})

app.post('/delete/:id', (req,res) => {
    let id = req.params.id;
    userCollection.deleteById(id)
    res.redirect('/UserListing')


})

app.listen(3000, ()=>{
    console.log('listening on port 3k');
});