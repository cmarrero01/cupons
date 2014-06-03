module.exports = function(mongoose){

    var Schema   = mongoose.Schema;

    try {
        if (mongoose.model('business'))var business = mongoose.model('business');
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
            var businessSchema = Schema({
                name:{type: String},
                description:{type: String},
                categoryId:{type: Schema.Types.ObjectId, ref:"category"},
                address:{type: String},
                location:[Number],
                web:{type: String},
                email:{type: String},
                phone:{type: String},
                mPayd:{
                    Visa:{type: String},
                    Mastercard:{type: String},
                    Maestro:{type: String},
                    Nativa:{type: String},
                    Efectivo:{type: String},
                    AmericanExpress:{type: String},
                    Nevada:{type: String},
                    Naranja:{type: String}
                },
                social:{
                    facebook:{type: String},
                    twitter:{type: String},
                    google:{type: String}
                },
                image:{type: String},
                accountId:{type: Schema.Types.ObjectId, ref:"account", required: true}
            });
            businessSchema.index({location: '2d'});
            var business = mongoose.model('business', businessSchema, 'businessModel');
        }
    }

    var model = {
        business:business
    };

    return model;
};
