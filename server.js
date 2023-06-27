const users = {};

// Socket.io event handlers
io.on('connection', socket => {
  console.log('A user connected');

  // Handle user login
  socket.on('login', username => {
    // Store the username associated with the socket id
    users[socket.id] = username;
    console.log(`${username} logged in`);

    // Notify other users about the new user
    socket.broadcast.emit('userJoined', username);
  });

  // Handle incoming messages
  socket.on('message', message => {
    console.log('Received message:', message);

    // Get the username of the sender
    const username = users[socket.id];

    // Broadcast the message to all connected clients
    io.emit('message', { username, message });
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log(`${username} disconnected`);

    // Remove the user from the users object
    delete users[socket.id];

    // Notify other users about the user leaving
    socket.broadcast.emit('userLeft', username);
  });
});
