var restricAccess = {
    check:function(req,res,next){
        if(req.session._id){
            next();
        }else{
            res.redirect('/');
        }
    }
};

module.exports = function(app,model){

    /* PUBLIC ENDPOINTS */
    app.get('/',model.home.get);
    app.get('/ofertas/:skip/:limit',model.ofertas.get);
    app.get('/oferta/:cpId',model.ofertas.getOne);
    app.get('/oferta/:cpId/sended/:send',model.ofertas.getOne);
    app.get('/download/:cpId',model.ofertas.download);
    app.post('/enviar/a/un/amigo',model.ofertas.sendSuggest);
    app.get('/createCupon/:cpId/:aprove/:code',model.ofertas.createCupon);

    //Informacion del negocio seleccionado
    app.get('/business/:bId',model.business.getOne);

    /* SATIC ENDPOINTS */
    app.get('/ayuda',function(req,res){
        model.m.txt.text.findOne({name:'Help'},function(err,doc){
            if(!err && doc){
                res.render('public/statics/ayuda.html',{partials:{header:'../header',footer:'../footer'},help:doc});
            }
        });
    });
    app.get('/contacto',function(req,res){
        res.render('public/statics/contacto.html',{partials:{header:'../header',footer:'../footer'}});
    });
    app.get('/privacidad',function(req,res){
        model.m.txt.text.findOne({name:'Privacy'},function(err,doc){
            if(!err && doc){
                res.render('public/statics/privacidad.html',{partials:{header:'../header',footer:'../footer'},privacy:doc});
            }
        })
    });
    app.get('/legales',function(req,res){
        model.m.txt.text.findOne({name:'Legals'},function(err,doc){
            if(!err && doc){
                res.render('public/statics/legales.html',{partials:{header:'../header',footer:'../footer'},legals:doc});
            }
        })
    });

    //Envio de emails
    app.post('/send-contact',model.home.sendEmail);

    /* PRIVATE ENDPOINTS */

    app.post('/login',model.account.login);
    app.get('/logout',model.account.logOut);
    app.post('/register',model.account.register);

    //restricted enpoints
    app.get('/myAccount',restricAccess.check,model.account.myAccount);
    app.post('/myAccount/business/update',restricAccess.check,model.private.business.update);
    //Listado de ofertas
    app.get('/myAccount/ofertas/:status',restricAccess.check,model.private.ofertas.get);
    //Mosramos el formulario para editar una oferta
    app.get('/myAccount/oferta/editar/:cId',restricAccess.check,model.private.ofertas.edit);
    app.post('/myAccount/oferta/save',restricAccess.check,model.private.ofertas.add);

    app.get('/myAccount/oferta/nueva',restricAccess.check,model.private.ofertas.newForm);

    app.get('/myAccount/oferta/cerrar/:cId',restricAccess.check,model.private.ofertas.close);

    app.get('/myAccount/oferta/validar', restricAccess.check, model.private.ofertas.validate);
    app.get('/myAccount/oferta/cupon/validate/:code',restricAccess.check, model.private.ofertas.cpValidate);
};
