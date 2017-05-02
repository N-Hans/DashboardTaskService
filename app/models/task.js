var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ITaskSchema = new Schema({
    taskText: String,
	isCompleted: Boolean
});

module.exports = mongoose.model('ITask', ITaskSchema);