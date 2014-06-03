module.exports = function(model,mongoose){

    var e = require('mailer');

    var home = {

        get:function(req, res){
            model.cat.category.find().exec(function(err,doc){
                if(!err && doc){
                    model.txt.text.findOne({name:'Description'},function(e,d){
                        if(!e && d){
                            model.txt.text.findOne({name:'Terms & Conditions'},function(a,b){
                                if(!a && b){
                                    res.render('public/index.html',{categories:doc,description:d,tos:b});
                                }
                            })
                        }
                    });
                }
            })
        },

        sendEmail:function(req,res){
            if(req.body.email && req.body.name && req.body.comment){

                var settings = {
                    domain: "ilcupone.com",
                    host: "smtp.mailgun.org",
                    port : 25,
                    authentication: "login",
                    username: "postmaster@ilcupone.com",
                    password: "9lh4xu6un4x4"
                };

                settings.to = "fciceri@hotmail.com";
                settings.from = req.body.email;
                settings.subject = 'Mensaje desde el sitio web ilCupone';
                settings.body = req.body.name+": "+req.body.comment;

                e.send(settings, function(e, result){
                    if(e) {
                        console.log('error:',e);
                    }
                });
            }

            res.render('public/statics/send-contact.html',{partials:{header:'../header',footer:'../footer'}});

        }
    };

    return home;

};