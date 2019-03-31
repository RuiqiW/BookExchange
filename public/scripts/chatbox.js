let currentChatId = 0;

const chatShow = document.querySelector("#chatShowButton");
const chatHide = document.querySelector("#chatHide");
chatShow.addEventListener('click', showChatRecords);
chatHide.addEventListener('click', hideChatRoom);

let shownChatRecords = false;
let shownChatRoom = false;
const chatRecords = document.querySelector("#chatRecords");

// show the dropdown list of existing chat

function showChatRecords(e) {
    e.preventDefault();
    if (shownChatRecords === false) {
        const request = new Request(`/api/allChats/${thisUser}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        });
        fetch(request).then((res) => {
            if (res.status === 200) {
                return res.json();
            }
        }).then((chatHistories) => {
            const records = document.querySelectorAll('.profile');
            for (let i = 0; i < records.length - 1; i++) {
                chatRecords.removeChild(chatRecords.lastElementChild);
            }
            for (let i = 0; i < chatHistories.length; i++) {
                addChatRecord(chatHistories[i]);
            }
        });

        chatRecords.style.display = 'block';
        shownChatRecords = true;
    } else {
        chatRecords.style.display = 'none';
        shownChatRecords = false;
    }
}


function addChatRecord(chatHistory) {
    const profile = document.createElement('div');
    profile.className = "profile";

    const profileIconContainer = document.createElement('div');
    const icon = document.createElement('img');
    // icon.src =;
    icon.alt = "ProfilePic";
    icon.className = "profileIcon";
    profileIconContainer.appendChild(icon);

    const profileContent = document.createElement('div');
    profileContent.className = "profileContent";
    const user = document.createElement('strong');
    if (chatHistory.user1 === thisUser) {
        user.innerText = chatHistory.user2;
    } else {
        user.innerText = chatHistory.user1;
    }

    profileContent.appendChild(user);

    profile.appendChild(profileIconContainer);
    profile.appendChild(profileContent);
    profile.addEventListener('click', showChatRoom);
    chatRecords.appendChild(profile);
}


const chatCreateButton = document.querySelector('#chatCreateButton');
chatCreateButton.addEventListener('click', addNewChat);

function addNewChat(e) {
    e.preventDefault();
    const keyword = document.querySelector('#userToChat').value;
    if (keyword !== '') {

        // find if the user to chat exists
        const userRequest = new Request(`/api/user/${keyword}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        });

        fetch(userRequest).then((res) => {
            if (res.status === 200) {
                const newChat = {
                    user1: thisUser,
                    user2: keyword
                };

                const request = new Request("/api/createChat", {
                    method: 'post',
                    body: JSON.stringify(newChat),
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    }
                });
                fetch(request).then((res2) => {
                    if (res2.status === 200) {
                        return res2.json();
                    }
                }).then((json) => {

                    loadChatHistory(json);
                    // set up chat box
                    const chatName = document.querySelector('#chatName');
                    chatName.innerText = keyword;
                    const chatRoom = document.querySelector('#chatRoom');
                    chatRoom.style.display = "block";
                })
            } else {
                window.alert("User not found");
            }
        }).catch((error) => {
        })
    }
}


function showChatRoom(e) {
    e.preventDefault();
    let userToChat;
    if (e.target.innerText !== null) {
        userToChat = e.target.innerText;
    } else if (e.target.className.contains('profileContent')) {
        userToChat = e.target.firstElementChild.innerText;
    } else {
        return;
    }

    if (userToChat !== '') {
        const request = new Request(`/api/chat/${thisUser}/${userToChat}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        });
        fetch(request).then((res) => {
            if (res.status === 200) {
                return res.json();
            }
        }).then((json) => {
            loadChatHistory(json);
            const chatName = document.querySelector('#chatName');
            chatName.innerText = userToChat;
            const chatRoom = document.querySelector('#chatRoom');
            chatRoom.style.display = "block";
        }).catch((error) => {
        })
    }
}

function loadChatHistory(chatHistory) {
    currentChatId = chatHistory._id;

    // remove old chats
    const chatBox = document.querySelector('#chat');
    while (chatBox.hasChildNodes()) {
        chatBox.removeChild(chatBox.lastChild);
    }

    // load new chats
    if (chatHistory.messages !== []) {
        for (let i = 0; i < chatHistory.messages.length; i++) {
            if (chatHistory.messages[i].sender === thisUser) {
                addSendMessage(chatHistory.messages[i].content);
            } else {
                addReceivedMessage(chatHistory.messages[i].content);
            }
        }
        const request = new Request(`/api/chat/${currentChatId}/${thisUser}`, {
            method: 'patch',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        });
    }

    shownChatRoom = true;
    chat.scrollTop = chat.scrollHeight;
}


function hideChatRoom(e) {
    e.preventDefault();
    const chatRoom = document.querySelector('#chatRoom');
    chatRoom.style.display = "none";
    shownChatRoom = false;
}


const chat = document.querySelector('#chat');
const sendButton = document.querySelector("#sendButton");
sendButton.addEventListener('click', sendMessage);

function sendMessage(e) {
    e.preventDefault();

    if (e.target.classList.contains("submit")) {
        const message = document.querySelector("#messageBox").value;
        if (message.length > 0 && message.length < 200) {
            const newMessage = {
                time: new Date(),
                sender: thisUser,
                content: message
            };
            const request = new Request(`/api/chat/${currentChatId}`, {
                method: 'post',
                body: JSON.stringify(newMessage),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            });
            fetch(request).then((res) => {
                if (res.status === 200) {
                    addSendMessage(message);
                } else {
                    window.alert("Failed to send message.");
                }
            });

        }
    }
    chat.scrollTop = chat.scrollHeight;
}


// helper function for sendMessage, add message to chat window
function addSendMessage(msg) {
    const newMessage = document.createElement('p');
    newMessage.className = "chatOutText";
    newMessage.innerText = msg;
    const bubble = document.createElement('div');
    bubble.className = "chatOutBubble";
    bubble.appendChild(newMessage);
    const messageContainer = document.createElement('div');
    messageContainer.appendChild(bubble);
    chat.appendChild(messageContainer);
}

function addReceivedMessage(msg) {
    const newMessage = document.createElement('p');
    newMessage.className = "chatInText";
    newMessage.innerText = msg;
    const bubble = document.createElement('div');
    bubble.className = "chatInBubble";
    bubble.appendChild(newMessage);
    const messageContainer = document.createElement('div');
    messageContainer.appendChild(bubble);
    chat.appendChild(messageContainer);
}

while (shownChatRoom === true) {
    setTimeout(function () {
        const request = new Request(`/api/chat/${currentChatId}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        });
        fetch(request).then((res) => {
            if (res.status === 200) {
                const chatHistory = res.body;
                if (thisUser === chatHistory.user1) {
                    for (let i = 0; i < chatHistory.user2Messages.length; i++) {
                        addReceivedMessage(chatHistory.user2Messages[i]);
                    }
                } else {
                    for (let i = 0; i < chatHistory.user1Messages.length; i++) {
                        addReceivedMessage(chatHistory.user1Messages[i]);
                    }
                }
            }
            const request = new Request(`/api/chat/${currentChatId}/:${thisUser}`, {
                method: 'patch',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            });
        });
    }, 1000)
}

