module.exports = function(app,mongoose,io){
    //Todos los controladores
    var model = require('./controllers.js')(mongoose);
    //Routes
    require('./routes.js')(app,model);
    //Socket
    require('./socket.js')(io,mongoose);
};
