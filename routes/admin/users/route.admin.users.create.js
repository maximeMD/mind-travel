const User = require('../../../app/models/model.user');
var validator = require('validator');
var bcrypt   = require('bcrypt-nodejs');

module.exports = (req, res) => {
  try{

    userNameIsValid = validator.isAlphanumeric(req.body.userName);
    emailIsValid =  validator.isEmail(req.body.email);

    hashPassword = bcrypt.hashSync(req.body.password);
    // hashPassword = shajs('sha256').update(req.body.password).digest('hex');

    if(userNameIsValid && emailIsValid){
      var newUser = new User({
        "name": req.body.userName,
        "local" : {
          "email" : req.body.email,
          "password" : hashPassword
        },
        "level" : req.body.level
      });
      newUser.save(function(err){
        if (err) throw err;
        console.log("User successfully saved");
      });
      res.status(201).send('User created with name : ' + newUser.name);
    }
    else{
      res.status(400).send("User name must be composed with alphanumeric-only characters")
    }
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
};
