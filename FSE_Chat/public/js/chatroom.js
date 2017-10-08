/*
public/js/chatroom.js
Contains all of the client side logic for the chatroom page, handles
all of the client side socket events and binds actions to the socket
events as well as certain GUI interactions
*/
var init = function() {

  // determine the user name of the client
  var userName = document.getElementById('name-place').innerHTML;

  // set the action for the send button click
  $(".chat-message button").on('click', function(e) {
    // grab and prepare the message
    var textareaEle = $("textarea[name='message']");
    var messageContent = textareaEle.val().trim();
    // check is there's anything to send
    if(messageContent !== '') {
      // pack the data object
      var message = {
        content: messageContent,
        username: userName,
        date: Date.now()
      };
      // send message object out with a emitted socket event
      socket.emit('newMessage', message);
      // clear the text area
      textareaEle.val('');
    }
  });

  // client to the server side socket
  var socket = io('/', { transports: ['websocket'] });

  //Helper function to update the participants' list
  function updateParticipants(users) {
    // ensure users is an array
    if(users.constructor !== Array){
      users = [users];
    }
    var html = '';
    // loop through users and add them to the list
    for(var user of users) {
      html += `<li class="clearfix">
      <div class="about">
      <div class="name">${user.name}</div>
      </div></li>`;
    }
    // check there is something to write and write it
    if(html === ''){ return; }
    $('.users-list ul').html('').html(html);
  }

  /*
  Upon client connection, notify the server along with the username
  and socket id
  */
  socket.on('connect', function () {
    socket.emit('newUser', {
      name: userName,
      id : socket.id
    });
  });

  /*
  When the server indicates a new connection, check if this socket is the
  new connection, if so write chat history. Otherwise just update user list
  */
  socket.on('newConnection', function (data) {
    if(data.newID === socket.id){
      addChatHistory(data.messages);
    }
    addMember(data.newPerson);
    updateParticipants(data.participants);
  });

  /*
  Add the incoming message from the server
  */
  socket.on('incomingMessage', function(data){
    addMessage(data);
  });

  /*
  When a user disconnects we must update the user list and post a disconnect
  message
  */
  socket.on('userDisconnected', function(data) {
    removeUser(data.leaver.name);
    updateParticipants(data.participants);
  });


  /*
  Helper function to display new message
  */
  var addMessage = function(message){
    message.date      = (new Date(message.date)).toLocaleString();
    message.username  = message.username;
    message.content   = message.content;

    var html = `<li>
    <div class="message-data">
    <span class="message-data-name">${message.username}</span>
    <span class="message-data-time">${message.date}</span>
    </div>
    <div class="message my-message" dir="auto">${message.content}</div>
    </li>`;
    $(html).hide().appendTo('.chat-history ul').slideDown(200);

    // Keep scroll bar down
    $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
  };

  /*
  Helper function to place a user connection message
  */
  var addMember = function(data){
    var message = {};
    message.date      = (new Date()).toLocaleString();
    message.username  = data;
    message.content  = data + " just joined the chat!"
    var html = `<li>
    <div dir="auto">${message.content}
    <span class="message-data-time">${message.date}</span>
    </div>
    </li>`;
    $(html).hide().appendTo('.chat-history ul').slideDown(200);
    $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
  }

  /*
  Helper function to place a user disconnect message
  */
  var removeUser = function(data){
    var message = {};
    message.date      = (new Date()).toLocaleString();
    message.username  = data;
    message.content  = data + " just left the chat!"
    var html = `<li>
    <div dir="auto">${message.content}
    <span class="message-data-time">${message.date}</span>
    </div>
    </li>`;
    $(html).hide().appendTo('.chat-history ul').slideDown(200);
    $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
  }

  /*
  Helper function for newly connected user to loop through all messages
  in chat history and add them
  */
  var addChatHistory = function(messages){
    for(var message of messages){
      addMessage({content: message.message, username : message.user, date : message.date});
    }
  }
}

init();
