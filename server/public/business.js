module.exports = function(model,mongoose){

    var business = {

        getOne:function(req,res){
            model.bss.business.findById(req.route.params['bId'])
                .exec(function(err,doc){
                    if(!err){
                        if(doc){
                            var result = {
                                business:doc,
                                partials:{
                                    header:'header',
                                    footer:'footer'
                                }
                            };
                            model.cp.cupon.find({status:'Activa',accountId:doc.accountId, quantity: { $gt: 0}})
                                .skip(0)
                                .limit(3)
                                .exec(function(e,d){
                                    if(!e){
                                        if(d.length){
                                            result.suggest = d;
                                            result.partials.sidebar = 'suggest';
                                            res.render('public/business.html',result);
                                        }else{
                                            res.render('public/business.html',result);
                                        }
                                    }else{
                                        res.render('public/business.html',result);
                                    }
                                });
                        }else{
                            res.render('public/404.html',{});
                        }
                    }else{
                        res.render('public/404.html',{err:err});
                    }
                });
        }

    };

    return business;
};