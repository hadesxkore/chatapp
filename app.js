const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const usernameInput = document.getElementById('username-input');
const loginButton = document.getElementById('login-button');

const socket = io(); // Connect to the Socket.io server
let username = '';

loginButton.addEventListener('click', loginUser);
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', handleInputKeyDown);

// Log in user
function loginUser() {
  const usernameValue = usernameInput.value.trim();
  if (usernameValue) {
    username = usernameValue;
    socket.emit('login', username); // Send the username to the server
    loginButton.disabled = true;
    usernameInput.disabled = true;
    messageInput.focus();
  }
}

// Send message on button click
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('message', { username, message }); // Send the message and username to the server
    displayMessage('You', message); // Display the message in the chat container
    messageInput.value = '';
  }
}

// Send message when Enter key is pressed
function handleInputKeyDown(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// Receive and display messages from other users
socket.on('message', ({ username, message }) => {
  displayMessage(username, message);
});

// Display messages in the chat container
function displayMessage(username, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  if (username === usernameInput.value.trim()) {
    messageElement.classList.add('you');
    messageElement.innerHTML = `<strong>You:</strong> ${message}`;
  } else {
    messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
  }

  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the bottom of the container
}
