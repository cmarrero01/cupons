module.exports = function(model,mongoose){

    var bcrypt = require('bcrypt-nodejs'),
        path = require('path'),
        fs = require('fs');

    var im = require('imagemagick');

    var demons = {

        checkForClose:function(){
            var interval = setInterval(function(){
                model.cp.cupon.find({status:'Activa'},function(err,doc){
                    if(!err){
                        if(doc.length){
                            var now = new Date().valueOf();
                            for(var d in doc){
                                var document = doc[d];
                                var expireDate = document.expireDate.valueOf();
                                if(now >= expireDate){
                                    model.cp.cupon.findByIdAndUpdate(document._id,{status:'Cerrada'},function(err,doc){
                                    });
                                }
                            }
                        }
                    }
                });
            },600000);
        }
    };

    demons.checkForClose();

    var ofertas = {
        get:function(req,res){
	     var aId = req.session._id;
            var status = req.route.params['status'];
            var results = {
                partials:{
                    header:'header',
                    footer:'footer'
                }
            };
            model.cp.cupon.find({status:status,accountId:aId})
                .skip(req.route.params['skip'])
                .limit(req.route.params['limit'])
                .exec(function(err,doc){
                    if(!err){
                        if(doc.length){
                            results.ofertas = doc;
                            if(status == "Activa"){
                                results.showButton = true;
                            }else{
                                results.showButton = false;
                            }

                            res.render('private/ofertas.html',results);
                        }else{
                            res.render('private/ofertas.html',results);
                        }
                    }else{
                        res.render('public/404.html',{err:err});
                    }
                });
        },

        close:function(req,res){
            model.cp.cupon.findByIdAndUpdate(req.route.params['cId'],{status:'Cerrada'},function(err,doc){
                res.redirect('/myAccount/ofertas/Activa');
            });
        },

        uploadImage:function(req,res,cuponId){

            if(req.files && req.files.image){

                var accountId = req.body.accountId;

                fs.mkdir('./upload/'+accountId+'/'+cuponId,function(e){
                    if(!e || (e && e.code === 'EEXIST')){
                        var tempPath = req.files.image.path;

                        var targetPath = path.resolve('./upload/'+accountId+'/'+cuponId+'/cupon.jpg');
                        var thumbPath = path.resolve('./upload/'+accountId+'/'+cuponId+'/cupon_298x127.jpg');
                        var thumbPath110x110 = path.resolve('./upload/'+accountId+'/'+cuponId+'/cupon_110x110.jpg');

                        if (path.extname(req.files.image.name).toLowerCase() === '.jpg' || path.extname(req.files.image.name).toLowerCase() === '.bmp') {
                            fs.rename(tempPath, targetPath, function(err) {
                                console.log('A ver que onda',err);
                                if(!err){
                                    im.resize({
                                        srcPath: targetPath,
                                        dstPath: thumbPath,
                                        width:   298,
                                        height:127
                                    }, function(err, stdout, stderr){
                                        if (err) throw err;
                                        console.log('resized image to fit within 298x127');
                                    });

                                    im.resize({
                                        srcPath: targetPath,
                                        dstPath: thumbPath110x110,
                                        width:   110,
                                        height:110
                                    }, function(err, stdout, stderr){
                                        if (err) throw err;
                                        console.log('resized image to fit within 110x110px');
                                    });
                                }
                            });
                        } else {
                            fs.unlink(tempPath, function () {
                            });
                        }
                    } else {
                        //debug
                        console.log(e);
                    }
                });

            }
        },

        add:function(req,res){

            var set = {};

            if(req.body.name)set.name = req.body.name;
            if(req.body.description)set.description = req.body.description;
            if(req.body.quantity)set.quantity = req.body.quantity;
            if(req.body.expireDate)set.expireDate = req.body.expireDate;


            var days = [];
            if(req.body.Lunes)days.push(req.body.Lunes);
            if(req.body.Martes)days.push(req.body.Martes);
            if(req.body.Miercoles)days.push(req.body.Miercoles);
            if(req.body.Jueves)days.push(req.body.Jueves);
            if(req.body.Viernes)days.push(req.body.Viernes);
            if(req.body.Sabado)days.push(req.body.Sabado);
            if(req.body.Domingo)days.push(req.body.Domingo);

            if(days.length)set.daysEnabled = days;

            if(req.body.accountId)set.accountId = req.body.accountId;

            var query = {};
            if(req.body.accountId)query.accountId = req.body.accountId;

            if(req.body.cuponId){
                if(req.body.status)set.status = req.body.status;
                query.cuponId = req.body.cuponId;
                ofertas.update(req,res,set,query);
            }else{
                set.status = 'Activa';
                ofertas.nuevo(req,res,set,query);
            }
        },

        nuevo:function(req,res,set,query){
            var newCupon = new model.cp.cupon(set);
            newCupon.save(function(err,doc){
                if(!err){
                    if(doc){
                        ofertas.uploadImage(req,res,doc._id);
                        res.redirect('/myAccount/ofertas/Activa');
                    }else{
                        res.redirect('/myAccount/ofertas/Activa');
                    }
                }else{
                    console.log(err);
                    res.redirect('/private/404.html');
                }
            });
        },

        update:function(req,res,set,query){

            model.cp.cupon.findByIdAndUpdate(query.cuponId,set,function(err,doc){
                if(!err){
                    if(doc){
                        ofertas.uploadImage(req,res,req.body.cuponId);
                        res.redirect('/myAccount/ofertas/Activa');
                    }else{
                        res.redirect('/myAccount/ofertas/Activa');
                    }
                }else{
                    res.redirect('/private/404.html');
                }
            });
        },

        newForm:function(req,res){
            var results = {
                accountId:req.session._id,
                partials:{
                    header:'header',
                    footer:'footer'
                }
            };
            res.render('private/nueva.html',results);
        },

        edit:function(req,res){
            var cId = req.route.params['cId'];
            model.cp.cupon.findById(cId).exec(function(err,doc){
                if(!err){
                    if(doc){
                        var results = {
                            oferta:doc,
                            partials:{
                                header:'header',
                                footer:'footer'
                            }
                        };

                        var days = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
                        var enabled = [];
                        for(var d in days){
                            if(results.oferta.daysEnabled.indexOf(days[d]) != -1){
                                enabled.push({day:days[d],enabled:true});
                            }else{
                                enabled.push({day:days[d],enabled:false});
                            }
                        }
                        results.oferta.daysList = enabled;

                        res.render('private/edit.html',results);
                    }else{
                        res.render('private/404.html');
                    }
                }else{
                    res.render('private/404.html');
                }
            });
        },

        validate:function(req,res){
            res.render('private/validate.html',{partials:{
                header:'header',
                footer:'footer'
            }});
        },

        cpValidate:function(req,res){
            model.dCp.dwCupon.findOne({code:req.route.params['code'],isValid:0}).exec(function(err,doc){
                console.log(err,doc);
                if(!err){
                    if(doc){
                        doc.update({isValid:1},function(e,d){

                        });
                        res.json({response:true,result:doc});
                    }else{
                        res.json({response:false,result:null});
                    }

                }else{
                    res.json({response:false,result:null,error:err});
                }
            });

        }
    };

    return ofertas;
};