module.exports = function(mongoose){
    var Schema   = mongoose.Schema;

    try {
        if (mongoose.model('text'))var text = mongoose.model('text');
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
            var textSchema = new Schema({
                name:{type: String, required: true},
                content:{type: String, required: true}
            });
            var text = mongoose.model('text', textSchema, 'textModel');
        }
    }

    var model = {
        text:text
    };

    return model;
};