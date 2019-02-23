"use strict";

const messageBox = document.querySelector("#messageBox");
const sendButton = document.querySelector("#sendButton");
const chat = document.querySelector('#chat');

messageBox.addEventListener('keydown', resize);
sendButton.addEventListener('click', sendMessage);

function resize(){
    const e = this;
        e.style.padding = '0 px';
        e.style.height = 'auto';
        e.style.height = e.scrollHeight + 'px';
}

function sendMessage(e){
    e.preventDefault();

    if(e.target.classList.contains("submit")){
        const message = document.querySelector("#messageBox").value;
        if(message.length > 0 && message.length < 200){
            addMessage(message);
        }
        // messageBox.value = "";
    }
}

function addMessage(msg){
    const newMessage = document.createElement('p');
    newMessage.className = "chatText";
    newMessage.innerText = msg;
    const bubble = document.createElement('div');
    bubble.className = "chatBubble";
    bubble.appendChild(newMessage);
    const messageContainer = document.createElement('div');
    messageContainer.appendChild(bubble);
    chat.appendChild(messageContainer);
}

