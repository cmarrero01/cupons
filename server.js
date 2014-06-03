var express = require('express'),
    app     = express(),
    cons    = require('consolidate'),
    hogan = require('hogan.js'),
    io = require('socket.io').listen(8023),
    mongoose = require('mongoose');

io.set('log level', 1, 'log color', true);

// assign the swig engine to .html files
app.engine('html', cons.hogan);
app.set('view engine', 'html');
app.set('views', __dirname + '/web/templates');

//Options for connect to mongodb
var options = {
    db: { native_parser: false },
    user: 'cupone',
    pass: 'cu2013$'
};

//Conexion a la base de datos Mongo Db - NoSQL
mongoose.connect('mongodb://127.0.0.1/ilcupone',options, function(err) {
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
        process.exit();
    }
});

//Configuraciones de Express
app.configure(function(){
    //Set default configurations
    app.use(express.bodyParser( { keepExtensions: true, uploadDir: __dirname + '/tmp' } ));
    app.use(express.limit('35mb'));
    app.use(express.methodOverride());
    app.use(express.logger());
    app.use(express.query());
    app.use(express.cookieParser());
    app.use(express.session({secret: '1234567890QWERTY'}));
    //Cross origin
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    app.use('/static/',express.static(__dirname + '/web/client'));
    app.use('/private/',express.static(__dirname + '/web/account'));
    app.use('/image/business',express.static(__dirname + '/upload'));
    app.use('/dw',express.static(__dirname + '/dw'));
});

//Endpoints
require('./server/core.js')(app,mongoose,io);
//Server listen
app.listen(80);
