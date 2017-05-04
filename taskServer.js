var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9090;
app.listen(port);

var router = express.Router();

var ITask = require('./app/models/task');

var mongoose   = require('mongoose');
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };  
				
var mongodbUri = "mongodb://taskmanager:t45km4n4g3r@ds042898.mlab.com:42898/dashboard_tasks";
mongoose.connect(mongodbUri, options);
var dbConnection = mongoose.connection;             
dbConnection.on('error', console.error.bind(console, 'connection error:'));  
dbConnection.once('open', function() {
  // Wait for the database connection to establish, then start the app.                         
});


router.use(function(req, res, next){
    console.log('Something is happening...');
	next();
});

router.get('/', function(req, res) {
    res.json({ message: "It's API here"})
});

router.route('/tasks')
	.post(function(req, res){
		var task = new ITask();
		task.taskText = req.body.taskText;
		task.isCompleted = false;
		
		task.save(function(err){
			if (err)
				res.send(err);
			res.json({message: "Task created"});
		});
	})

	.get(function(req, res){
		ITask.find(function(err, tasks){
			if(err)
				res.send(err);
			res.json(tasks);
		});
	});
	
router.route('/tasks/:task_id')
	.get(function(req, res){
		ITask.findById(req.params.task_id, function(err, task){
			if(err)
				res.send(err);
			res.json(task);
		});
	})
	
	.put(function(req, res){
		ITask.findById(req.params.task_id, function(err, task){
			if(err)
				res.send(err);
			task.isCompleted = req.body.isCompleted;
			task.taskText = req.body.taskText || task.taskText;
			
			task.save(function(err){
				if(err)
					res.send(err);
				res.json(ITask.find())
			});
			
		});
	})
	
	.delete(function(req, res){
		ITask.remove({
			_id: req.params.task_id
		}, function(err, task){
			if(err)
				res.send(err);
			res.json({message:"Task deleted"});
		});
	});

console.log("Running taskServer on " + port + "...");
	
app.use('/api', router);