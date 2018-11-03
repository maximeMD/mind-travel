const User = require('../../../app/models/model.user');

module.exports = (req, res) => {
  try {
    User.findByIdAndRemove(req.body.id, function (err) {
      if (err) throw err;
      res.redirect("/admin/users");
    });
  } catch (error) {
    res.status(500).json({
      error: error.toString()
    });
  }
};