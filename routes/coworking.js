var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId; 
var moment = require('moment');
/*
 * GET userlist.
 */
router.get('/coworkinglist', function(req, res) {
    var db = req.db;
    var collection = db.get('coworking');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to adduser.
 */
router.post('/addcoworking', function(req, res) {
    var time = moment().utcOffset('+0700').format('MMMM Do YYYY, HH:mm:ss');
    var db = req.db;
    var collection = db.get('coworking');
    req.body.last_update = time;
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deletecoworking/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('coworking');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

router.put('/editcoworking/:id', function(req, res) {
    var time = moment().utcOffset('+0700').format('MMMM Do YYYY, HH:mm:ss');
    var db = req.db;
    var userToEdit = req.params.id;
    var collection = db.get('coworking');
    req.body.last_update = time;
    collection.findOneAndUpdate({ _id: userToEdit }, req.body ).then(function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

router.put('/addclick/:id', function(req, res) {
    var db = req.db;
    var userToEdit = req.params.id;
    var collection = db.get('coworking');
    // console.log(userToEdit);
    collection.findOne({ _id: userToEdit }).then(function(err, result){
        let newRes = err;
        console.log(err.click);
        newRes.click = parseInt(newRes.click) + 1;
        collection.findOneAndUpdate({ _id: userToEdit }, newRes ).then(function(err, result){
            res.send(
                (err === null) ? { msg: '' } : { msg: err }
            );
        });
    });
});

router.put('/addclick2/:id', function(req, res) {
    var db = req.db;
    var userToEdit = req.params.id;
    var collection = db.get('coworking');
    // console.log(userToEdit);
    collection.findOne({ _id: userToEdit }).then(function(err, result){
        let newRes = err;
        console.log(err.click2);
        if(newRes.click2 == null) {
            newRes.click2 = 0;
        }
        newRes.click2 = parseInt(newRes.click2) + 1;
        collection.findOneAndUpdate({ _id: userToEdit }, newRes ).then(function(err, result){
            res.send(
                (err === null) ? { msg: '' } : { msg: err }
            );
        });
    });
});

router.get('/statclick', function(req, res) {
    var db = req.db;
    var collection = db.get('statclick');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.post('/addstatclick', function(req, res) {
    var time = moment().utcOffset('+0700').format('MMMM Do YYYY, HH:mm:ss');
    var db = req.db;
    var collection = db.get('statclick');
    req.body.time = time;
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});
module.exports = router;