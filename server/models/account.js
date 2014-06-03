module.exports = function(mongoose){
    var Schema   = mongoose.Schema;

    try {
        if (mongoose.model('account'))var account = mongoose.model('account');
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
            var accountSchema = new Schema({
                name:{ type: String, required: true, unique: true},
                email:{ type: String, required: true, unique:true },
                password:{type: String, required:true}
            });
            var account = mongoose.model('account', accountSchema, 'accountModel');
        }
    }

    var model = {
        account:account
    };

    return model;
};
