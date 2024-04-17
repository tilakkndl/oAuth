const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path')
const contentType = require('content-type');
const mongoose = require("mongoose")

const authRoutes = require('./auth');
const passportConfig = require('./googleOauth');
const userModel = require('./userModel');

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/oauth").then(()=>console.log("Mongodb Connected")).catch((err)=>console.log("Mongo Error"+err))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'views'), {
    setHeaders: (res, path) => {
      const type = contentType.contentType(path);
      res.set('Content-Type', type);
    },
  }));

app.use(session({
    secret: 'SESSION_SECRET',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);
app.use('/', authRoutes);

authRoutes.get('/dashboard', async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  const user = await userModel.findById(req.user.id);
  res.render('dashboard', { user });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
