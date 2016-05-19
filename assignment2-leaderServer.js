var mongoose = require('mongoose'),
    assert = require('assert');

var Leaderships = require("./models/leaderships");

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    // we're connected!
    console.log("Connected correctly to server");
    
    // create a new promotion
    Leaderships.create({
        name: 'Peter Pan',
        image: 'images/alberto.png',
        designation: 'Chief Epicurious Officer',
        abbr: 'CEO',
        description: 'Our CEO, Peter, ...'
    }, function(err, leader) {
        if (err) throw err;
        
        console.log("Leader created!");
        console.log(leader);
        //console.log('Price: ' + (leader.price / 100).toFixed(2));
        var id = leader._id;
        
        // get all the Leaderships
        setTimeout(function() {
            Leaderships.findByIdAndUpdate(id, {
                $set: { description: 'Updated Test' }
            }, { 
                new: true 
            })
            .exec(function(err, leader) {
                if (err) throw err;
                
                console.log('Updated Leader!');
                console.log(leader);
                
                db.collection('leaderships').drop(function() {
                    db.close();
                });
                
            });
            
        }, 3000);
        
    });
    
});