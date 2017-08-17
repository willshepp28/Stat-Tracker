// REQUIRE MODULES =========================== /////
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
mongoose.Promise = require('bluebird');


mongoose.connect('mongodb://localhost:27017/activityTracker');


const index = require('./routes/index');
const api = require('./routes/api');


const application = express();


application.engine('handlebars', handlebars({ defaultLayout: 'main' }));
application.set('view engine', 'handlebars');

application.use('/assets', express.static(path.join(__dirname, 'public')))

// parse applicationlication/x-www-form-urlencoded
application.use(bodyParser.urlencoded({ extended: false }))

// parse applicationlication/json
application.use(bodyParser.json());

application.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


// application.use(function(request,response, next){

//   if (!request.session.isAuthenticated){
//       request.session.isAuthenticated = false;
//   }
//   next();
// });




// ROUTES =========================== /////
application.use('/api', api);
application.use('/', index);





// SERVER =========================== /////
application.listen(8000, function () {
    console.log('Server listening on port 8000');
});