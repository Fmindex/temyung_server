var express = require('express');
var router = express.Router();

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
    var db = req.db;
    var collection = db.get('coworking');
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

// router.put('/addcoworking', function(req, res) {
//     var db = req.db;
//     var collection = db.get('coworking');
//     collection.insert(req.body, function(err, result){
//         res.send(
//             (err === null) ? { msg: '' } : { msg: err }
//         );
//     });
// });

module.exports = router;