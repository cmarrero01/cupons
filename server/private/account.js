module.exports = function(model,mongoose){

    var bcrypt = require('bcrypt-nodejs'),
        path = require('path'),
        fs = require('fs');

    var account = {

        login:function(req,res){

            var email = req.body.email;
            var password = req.body.password;

            if(email && password){
                model.acc.account.findOne({email:email},function(err,doc){
                    if(!err){
                        if(doc){
                            var pass = bcrypt.compareSync(password,doc.password);
                            if(pass){
                                req.session._id = doc._id;
                                res.redirect('/myAccount');
                            }else{
                                res.render('public/index.html',{err:'Incorrect Password'});
                            }
                        }else{
                            res.render('public/index.html',{err:'You doesnt exist'});
                        }
                    }else{
                        res.render('public/index.html',{err:err});
                    }
                });
            }else{
                res.render('public/index.html',{err:'Wrong parameters, are undefined'});
            }
        },

        register:function(req,res){
            var name = req.body.name;
            var email = req.body.email;
            var planePassword = req.body.password;
            password = bcrypt.hashSync(planePassword);

            if(email && password){

                var newAccount = new model.acc.account({
                    name:name,
                    email:email,
                    password:password
                });

                newAccount.save(function(err,doc){
                    console.log(err,doc);
                    if(!err){
                        if(doc){
                            req.session._id = doc._id;
                            res.redirect('/myAccount');
                        }else{
                            res.render('public/index.html',{err:'What you try to make?'});
                        }
                    }else{
                        res.render('public/index.html',{err:err});
                    }
                });
            }else{
                res.render('public/index.html',{err:'Wrong parameters, are undefined'});
            }
        },

        myAccount:function(req,res){
            account.getBusiness(req,res,account.myAccountCallback);
        },

        getBusiness:function(req,res,callback){
            var aId = req.session._id;
            model.bss.business.findOne({accountId:aId},function(err,doc){
                    model.cat.category.find().exec(function(e,d){
                        if(!err && doc) {
                            doc.categories = d;
                        }else{
                            doc = {
                                categories :d
                            }
                        }
                        callback(req,res,err,doc);
                    });

            });
        },

        myAccountCallback:function(req,res,err,doc){
            var result = {
                accountId:req.session._id,
                cache:new Date().valueOf(),
                partials:{
                    header:'header',
                    footer:'footer'
                }
            };

            if(!err){
                if(doc){
                    result.business = doc;
                    res.render('private/negocio.html',result);
                }else{
                    res.render('private/negocio.html',result);
                }
            }else{
                result.error = err;
                res.render('private/negocio.html',result);
            }
        },

        logOut:function(req,res){
            req.session.destroy();
            res.redirect('/');
        }

    };

    return account;
};
