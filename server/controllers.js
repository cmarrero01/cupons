module.exports = function(mongoose){

    var models = {
        cat:require('./models/category.js')(mongoose),
        txt:require('./models/texts.js')(mongoose),
        bss:require('./models/business.js')(mongoose),
        acc:require('./models/account.js')(mongoose),
        cp:require('./models/cupon.js')(mongoose),
        dCp:require('./models/dwCupons.js')(mongoose)
    };

    var endpoints = {
        home:require('./public/home.js')(models,mongoose),
        ofertas:require('./public/ofertas.js')(models,mongoose),
        business:require('./public/business.js')(models,mongoose),
        account:require('./private/account.js')(models,mongoose),
        private:{
            business:require('./private/business.js')(models,mongoose),
            ofertas:require('./private/ofertas.js')(models,mongoose)
        },
        m:models
    };

    return endpoints;
};
