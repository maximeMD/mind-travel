var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb://max:test@ds119028.mlab.com:19028/mindtravel", function(error, db) {
  if (error) return funcCallback(error);

  const mindtravel_db = db.db('mindtravel');
  const users_collection = mindtravel_db.collection('users');

  console.log("Connecté à la base de données 'mindtravel'");
  // users_collection.find().toArray(function (error, results) {
  //   console.log(results);
  // });
  users_collection.findOne({ username: "max" },function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log("pas trouvé");
      }
      else{
        console.log("trouvé"+user.username);
      }
    });
});


var userList = new Array();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index3.html');
});

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){

  var userPseudo="test";

  console.log('new server connection : '+socket.sessionId);

  socket.emit('pseudo', userPseudo);

  socket.broadcast.emit('datachat','new server connection');

  socket.on('disconnect', function(){
    console.log('user disconnected');
    var i = userList.indexOf(userPseudo);
    userList.splice(i);
    io.emit('userList', userList);
    socket.broadcast.emit('datachat', userPseudo+" left the chat");
  });

  socket.on('datachat', function(msg){
    console.log('message: ' + msg);
    socket.broadcast.emit('datachat', msg);

  });

  socket.on('pseudo', function(pseudo){
    userPseudo = pseudo;
    userList.push(pseudo);
    console.log(pseudo+" joined the chat");
    socket.emit('pseudo', pseudo);
    socket.broadcast.emit('datachat', pseudo+" joined the chat");
    io.emit('userList', userList);
  });

  socket.on("category", function(category){
    var fs = require('fs');
    var sizeOf = require('image-size');
    var path = 'album/'+category + '/';
    var img = fs.readdirSync("public/"+path);
    var img_path = [];
    var img_list = [];
    var img_name = [];
    for(var i=0; i<parseInt(img.length); i++){
      img_name[i] = img[i].split(".jpg",1)
      img_path[i] = path + img[i];
      // console.log('public/'+img_list[i]);
      var dimensions = sizeOf('public/'+img_path[i]);
      img_list[i] = {
        src: img_path[i],
        src_thumbnail: 'album_thumbnail/'+category+'/'+img_name[i]+'_thumb.jpg',
        width: dimensions.width,
        height: dimensions.height
      }
      // console.log(dimensions.width, dimensions.height);
    }

    io.emit("category_img", img_list)
  });


});



http.listen(3000, function(){
  console.log('listening on *:3000');
});
