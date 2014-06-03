module.exports = function(mongoose){
    var Schema   = mongoose.Schema;

    try {
        if (mongoose.model('category'))var category = mongoose.model('category');
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
            var categorySchema = new Schema({
                name:{ type: String, required: true, unique: true}
            });
            var category = mongoose.model('category', categorySchema, 'categoryModel');
        }
    }

    var model = {
        category:category
    };

    return model;
};
