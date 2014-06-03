module.exports = function(mongoose){

    var Schema   = mongoose.Schema;

    try {
        if (mongoose.model('dwCupon'))var dwCupon = mongoose.model('dwCupon');
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
            var dwCuponSchema = Schema({
                cupon:{type: Schema.Types.ObjectId, ref:"cupon", required: true},
                isValid:{type: Number},
                code:{type: String}
            });
            var dwCupon = mongoose.model('dwCupon', dwCuponSchema, 'dwCuponModel');
        }
    }

    var model = {
        dwCupon:dwCupon
    };

    return model;
};
