const { Forum } = require('./Forum');
const { User } = require('./User');

const PORT = process.env.PORT || 4000

const io = require('socket.io')(PORT, {
  cors: {
    origin: '*'
  }
});

const forum = new Forum();

io.on("connection", socket => {
  console.log("USUARIO: " + socket.id);
  

  // quando um usuario novo se conecta no forum
  socket.on('newUser', (userInfo, url) => {
    const user = new User(socket.id, userInfo.name, userInfo.image);
    forum.addUser(user);
    forum.addUserInQuestion(user, url);
    socket.join(url);
    io.emit('allUsersForum', forum.getAllUsers());

    // emit all users in the question url
    socket.to(url).emit('allUsersInQuestion', forum.getAllUsersInQuestion(url));
  });

  socket.on('getUsersByUrl', (url) => {
    console.log(url)
    // wait for 2 seconds to simulate a delay
    setTimeout(() => {
      socket.emit('allUsersInQuestion', forum.getAllUsersInQuestion(url));
    }, 2000);
  });

  // quando um usuario envia uma mensagem
  socket.on('clientMessage', async (msg, url) => {
    const user = await forum.getUser(socket.id);
    console.log(url)

    io.to(url).emit("serverMessage", 
      {
        message: msg,
        date: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), // add the date formated to HH:MM
        user: user
      }
    );
  });

  // quando um usuario se desconecta do forum
  socket.on("disconnect", () => {
    console.log("USUARIO DESCONECTADO: " + socket.id);
    // remove o usuario do forum
    forum.removeUser(forum.getUser(socket.id));
    io.emit('allUsersForum', forum.getAllUsers());
  });
});