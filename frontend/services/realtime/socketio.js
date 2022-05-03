import socketIOClient from 'socket.io-client';

// const socket = socketIOClient(process.env.SOCKETIO_URL);
// const socket = socketIOClient("localhost:4000");

const socket = socketIOClient("ufes-forum-socket.herokuapp.com");

export default socket;