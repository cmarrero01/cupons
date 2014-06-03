module.exports = function(mongoose){

    var Schema   = mongoose.Schema;

    try {
        if (mongoose.model('cupon'))var cupon = mongoose.model('cupon');
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
            var cuponSchema = Schema({
                name:{type: String, required: true},
                description:{type: String, required: true},
                quantity:{type: Number, required: true},
                expireDate:{type: Date, required: true},
                daysEnabled:[{type: String, enum: ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo']}],
                images:{type: String},
                accountId:{type: Schema.Types.ObjectId, ref:"account", required: true},
                status:{type: String, enum:['Activa','Cerrada']}
            });
            var cupon = mongoose.model('cupon', cuponSchema, 'cuponModel');
        }
    }

    var model = {
        cupon:cupon
    };

    return model;
};
