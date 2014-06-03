module.exports = function(model,mongoose){

    var phantom = require('phantom');
    var e = require('mailer');

    var ofertas = {

        sendSuggest:function(req,res){
            var email = req.body.email;
            var cpId = req.body.cpId;


            var settings = {
                domain: "ilcupone.com",
                host: "smtp.mailgun.org",
                port : 25,
                authentication: "login",
                username: "postmaster@ilcupone.com",
                password: "9lh4xu6un4x4"
            };

            settings.to = email;
            settings.from = "cupon@ilcupone.com";
            settings.subject = 'Il Cupone - Un amigo te envio una sugerencia';


            model.cp.cupon.findById(cpId,function(err,doc){
                if(doc){
                    settings.data = { email: email, cpId: cpId, name:doc.name, description:doc.description, expireDate:doc.expireDate};
                    settings.template = "./web/templates/emails/suggest.html";
                    e.send(settings, function(e, result){
                        if(e) {
                            console.log('error:',e);
                        }
                    });
                }
            });

            res.redirect('/oferta/'+cpId+'/sended/1');
        },

        get:function(req, res){
            model.cat.category.findOne({name:req.query.category},function(e,d){
                if(!e && d){
                    model.bss.business.find({categoryId: d._id}, function (error, negocio) {
                        if (!error && negocio) {
                            if(negocio.length){
                                var business_array = [];
                                for (var i = 0; i < negocio.length; i++) {
                                    business_array.push(negocio[i].accountId);
                                    if (i + 1 == negocio.length) {
                                        model.cp.cupon.find({accountId: {$in: business_array}, status: 'Activa', quantity: { $gt: 0}})
                                            .skip(req.route.params['skip'])
                                            .limit(req.route.params['limit'])
                                            .exec(function (err, doc) {
                                                if (!err) {
                                                    if (doc.length) {
                                                        var results = {
                                                            ofertas: doc,
                                                            count: doc.length,
                                                            partials: {
                                                                header: 'header',
                                                                footer: 'footer'
                                                            }
                                                        };
                                                        res.render('public/ofertas.html', results);
                                                    } else {
                                                        res.render('public/404.html', {});
                                                    }
                                                } else {
                                                    res.render('public/404.html', {err: err});
                                                }
                                            });
                                    }
                                }
                            }else{
                                res.render('public/404.html',{});
                            }
                        }
                    });
                }
            });
        },

        getOne:function(req,res){
            model.cp.cupon.find({_id:req.route.params['cpId'], quantity: { $gt: 0}})
                .exec(function(err,doc){
                    if(!err){
                        if(doc.length){
                            ofertas.getBussiness(req,res,doc[0],ofertas.getOneCallback)
                        }else{
                            res.render('public/404.html',{});
                        }
                    }else{
                        res.render('public/404.html',{err:err});
                    }
                });
        },

        getBussiness:function(req,res,cupon,callback){
            model.bss.business.findOne({accountId:cupon.accountId}).exec(function(err,doc){
                if(!err){
                    if(doc){
                        callback(req,res,doc,cupon);
                    }else{
                        res.render('public/404.html',{});
                    }
                }else{
                    res.render('public/404.html',{err:err});
                }
            });
        },

        getOneCallback:function(req,res,business,doc){
            var expire = {
                day:doc.expireDate.getDate().toString(),
                month:(doc.expireDate.getMonth()+1).toString(),
                year: doc.expireDate.getFullYear().toString()
            };

            doc.expire = expire;
            var result = {
                oferta:doc,
                business:business,
                sended:req.route.params['send'],
                partials:{
                    header:'header',
                    footer:'footer'
                }
            };

            model.cp.cupon.find({status:'Activa', quantity: { $gt: 0}})
                .skip(0)
                .limit(3)
                .exec(function(e,d){
                    if(!e){
                        if(d.length){
                            result.suggest = d;
                            result.partials.sidebar = 'suggest';
                            res.render('public/cupon.html',result);
                        }else{
                            res.render('public/cupon.html',result);
                        }
                    }else{
                        res.render('public/cupon.html',result);
                    }
                });
        },

        download:function(req,res){
            var cpId = req.route.params['cpId'];
            var set = {
                $inc:{quantity:-1}
            };
            //RESTAMOS EL CUPON
            model.cp.cupon.update({_id:cpId, quantity: { $gt: 0}},set,function(err,doc){
                if(!err){
                    if(doc){
                        //Guardamos el codigo
                        var code = ofertas.dwCupon(cpId);

                        phantom.create(function(ph){
                            ph.createPage(function(page) {
                                page.open("http://localhost/createCupon/"+cpId+'/1/'+code, function(status) {
                                    var time = new Date().valueOf();
                                    page.render('./dw/cupon-'+cpId+'-'+time+'.jpg', function(){
                                        ph.exit();
                                        res.download('./dw/cupon-'+cpId+'-'+time+'.jpg');
                                    });
                                });
                            });
                        },{port:12301});
                    }else{
                        res.render('public/404.html',{});
                    }
                }else{
                    res.render('public/404.html',{err:err});
                }
            });
        },

        dwCupon:function(cpId){

            var code = Math.random().toString(36).substr(2, 5);

            var newdCp = new model.dCp.dwCupon({
                cupon:cpId,
                isValid:0,
                code:code
            });

            newdCp.save(function(err,doc){

            });

            return code;
        },

        createCupon:function(req,res){
            if(req.route.params['aprove']){
                model.cp.cupon.findById(req.route.params['cpId'],function(err,doc){
                    if(!err){
                        if(doc){
                            model.bss.business.findOne({accountId:doc.accountId}).exec(function(err,bussines){
                                if(!err){
                                    if(bussines){
                                        var results = {
                                            oferta:doc,
                                            business:bussines,
                                            code:req.route.params['code']
                                        };
                                        res.render('public/createCupon.html',results);
                                    }else{
                                        res.render('public/404.html',{});
                                    }
                                }else{
                                    res.render('public/404.html',{err:err});
                                }
                            });
                        }
                    }
                });
            }else{
                res.redirect('/');
            }
        }

    };

    return ofertas;

};