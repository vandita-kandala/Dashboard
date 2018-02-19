var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

router.post('/', function (req, res, next) {

    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    });
    user.save(function(err, result) {
        if(err){
            return res.status(500).json({
                title: 'Error occured',
                error: err
            });
        }
        res.status(201).json({
            message: 'User created',
            obj: result
        });
    });
});


router.post('/signin', function (req, res, next) {

    User.findOne({email: req.body.email}, function (err, user)  {
        if(err){
            return res.status(500).json({
                title: 'Error occured',
                error: err
            });
        }
        if(!user) {
            return res.status(401).json({
                title: 'Invalid Credentials',
                error: {message: 'Invalid details'}
            });
        }
        if(!bcrypt.compareSync(req.body.password, user.password)){
            return res.status(401).json({
                title: 'Invalid Credentials',
                error: {message: 'Invalid details'}
            });
        }
        var token = jwt.sign({user:user},'secret',{expiresIn:7200});
        res.status(200).json({
            message: 'Logged in',
            token: token,
            userId: user._id
        });
    });
});
module.exports = router;

