const User = require('../../../app/models/model.user');

module.exports = (req, res) => {
  try{
    User.find({}, function(err, users){
      res.render('admin/pages/users/all', {
        nav: "users",
        users : users
      });
    });
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
};
