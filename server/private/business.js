module.exports = function(model,mongoose){

    var bcrypt = require('bcrypt-nodejs'),
        path = require('path'),
        fs = require('fs');

    var im = require('imagemagick');

    var business = {

        uploadImage:function(req,res){

            if(req.files && req.files.image){

                var accountId = req.body.accountId;
                fs.mkdir('./upload/'+accountId,function(e){
                    if(!e || (e && e.code === 'EEXIST')){
                        var tempPath = req.files.image.path;
                        var targetPath = path.resolve('./upload/'+accountId+'/business.jpg');
                        var thumbPath80x80 = path.resolve('./upload/'+accountId+'/business_80x80.jpg');
                        if (path.extname(req.files.image.name).toLowerCase() === '.jpg' || path.extname(req.files.image.name).toLowerCase() === '.bmp') {
                            fs.rename(tempPath, targetPath, function(err) {
                                im.resize({
                                    srcPath: targetPath,
                                    dstPath: thumbPath80x80,
                                    width:   80,
                                    height:80
                                }, function(err, stdout, stderr){
                                    if (err) throw err;
                                    console.log('resized image to fit within 80x80');
                                });
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

        update:function(req,res){

            var accountId = req.body.accountId;

            business.uploadImage(req);

            var set = {};

            if(req.body.name)set.name = req.body.name;
            if(req.body.address)set.address = req.body.address;

            var lat = req.body.lat;
            var lon = req.body.lon;
            var location = [lon,lat];

            if(lat&&lon)set.location = location;
            if(req.body.web)set.web = req.body.web;
            if(req.body.email)set.email = req.body.email;
            if(req.body.phone)set.phone = req.body.phone;

            set.mPayd = {};
            set.mPayd.Visa = (req.body.Visa)?req.body.Visa:'';
            set.mPayd.Mastercard = (req.body.Mastercard)?req.body.Mastercard:'';
            set.mPayd.Maestro = (req.body.Maestro)?req.body.Maestro:'';
            set.mPayd.Nativa = (req.body.Nativa)?req.body.Nativa:'';
            set.mPayd.Efectivo = (req.body.Efectivo)?req.body.Efectivo:'';
            set.mPayd.AmericanExpress = (req.body.AmericanExpress)?req.body.AmericanExpress:'';
            set.mPayd.Nevada = (req.body.Nevada)?req.body.Nevada:'';
            set.mPayd.Naranja = (req.body.Naranja)?req.body.Naranja:'';


            set.social = {};
            set.social.facebook = (req.body.facebookUrl)?req.body.facebookUrl:'';
            set.social.twitter = (req.body.twitterUrl)?req.body.twitterUrl:'';
//            set.social.google = (req.body.gplusUrl)?req.body.gplusUrl:'';

            set.image = '/image/business/'+accountId+'/business.jpg';
            set.description = req.body.description;
            set.categoryId = req.body.category;

            model.bss.business.update({accountId:accountId},set,{upsert:true},function(err,doc){
                if(!err){
                    console.log(doc);
                    res.redirect('/myAccount');
                }else{
                    console.log(err);
                    res.redirect('/myAccount');
                }
            });
        }
    };

    return business;
};