var {mongoose} = require('./mongoose');

var weatherSchema = new mongoose.Schema({},{strict: false});
var Weather = mongoose.model('Weather ',weatherSchema);

module.exports = {Weather};
