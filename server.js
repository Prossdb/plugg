const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const logger = require('morgan');
const cloudinary = require('cloudinary');
const methodOverride = require("method-override");
const connectDB = require('./config/database')
const indexRouter = require('./routes/index');
const menuRouter = require('./routes/menu');
const loginRouter = require('./routes/login');

require('dotenv').config({path: './config/.env'})

//Passport config
//require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
    })
  )

  // Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

  
app.use('/', indexRouter);
app.use('/menu', menuRouter);
app.use('/login', loginRouter);
 
app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})  

//cloudinary
// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });