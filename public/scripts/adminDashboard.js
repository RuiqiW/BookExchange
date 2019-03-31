// load list of messages received, need server call in Phase2
const thisUser = "admin"; //TODO: get current user from cookie
let currentChatId = 0;

let postEdited = 0;
let shownUserNum = 2;


// load data on DOM loaded, will use database query instead in Phase 2
document.addEventListener('DOMContentLoaded', function () {
    loadUserNum();
    loadPostNum();
    loadTransactionNum();
    loadMessageNum();
    loadTransaction();
    loadPost();
    loadUserList();

});

function loadUserNum() {
    document.querySelector('#userData').innerText = users.length;
}

function loadPostNum() {
    document.querySelector('#postData').innerText = posts.length;
}

function loadTransactionNum() {
    document.querySelector('#transactionData').innerText = transactions.reduce((total, transaction) =>
        total + (transaction.status === 0 ? 1 : 0), 0);
}

function loadMessageNum() {
    const request = new Request("/api/allChats", {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    });
    fetch(request).then((res) => {
        if (res.status === 200) {
            const chatHistories = JSON.parse(res.body);
            const newChatNum = chatHistories.reduce((total, chat) => {
                total += chat.newMessages
            }, 0);

            document.querySelector('#msgData').innerText = newChatNum;

        } else {
            document.querySelector('#msgData').innerText = 0;
        }
    });

}

function loadTransaction() {
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].status === 0) {
            createTransactionEntry(transactions[i]);
        }
    }
}

function loadPost() {
    let j = 5;
    for (let i = 0; i < posts.length; i++) {
        if (j > 0) {
            if (posts[i].isSold === false) {
                createPost(posts[i]);
            }
            j--;
        } else {
            break;
        }
    }

    const deleteItems = document.querySelectorAll('.deleteItem');
    Array.from(deleteItems).forEach(function (element) {
        element.addEventListener('click', deleteItem);
    });
}


function loadUserList() {
    const length = Math.min(users.length - shownUserNum, 3);
    for (let i = 0; i < length; i++) {
        const userEntry = createUserEntry(users[i + shownUserNum]);
        userTable.appendChild(userEntry);
    }
    shownUserNum += length;
}


/********** navigation bar expansion and close ***********/


const main = document.querySelector("#main");
const navExpansion = document.querySelector("#navExpansion");
const navClose = document.querySelector('#navClose');
navExpansion.addEventListener('click', openSideNav);
navClose.addEventListener('click', closeSideNav);

function openSideNav(e) {
    e.preventDefault();
    document.querySelector("#sideNav").style.width = "250px";
    main.style.marginLeft = "250px";
}

function closeSideNav(e) {
    e.preventDefault();
    document.querySelector("#sideNav").style.width = "0";
    main.style.marginLeft = "0";
}


/***************** Post Management *****************/

const editPost = document.querySelector("#editPost");
editPost.addEventListener('click', changeEditMode);

function changeEditMode(e) {
    e.preventDefault();

    if (postEdited === 0) {
        postEdited = 1;
        editPost.innerText = "save";
        const deleteItems = document.querySelectorAll('.deleteItem');
        for (let i = 0; i < deleteItems.length; i++) {
            deleteItems[i].style.display = "inline-block";
        }
    } else {
        postEdited = 0;
        editPost.innerText = "edit";
        loadPostNum();
        const deleteItems = document.querySelectorAll('.deleteItem');
        for (let i = 0; i < deleteItems.length; i++) {
            deleteItems[i].style.display = "none";
        }
    }
}

function deleteItem(e) {
    e.preventDefault();

    if (window.confirm("Do you want to delete this post?")) {

        // get postId
        const post = e.target.parentElement.parentElement;
        const postNum = post.lastElementChild.previousSibling;
        const postId = parseInt(postNum.innerText);

        // delete post from posts array, will need server in Phase 2
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].postId === postId) {
                posts.splice(i, 1);
                break;
            }
        }

        // remove post in DOM
        removePost(e);
        window.alert("You have deleted this post.");
    }
}


function removePost(e) {
    const post = e.target.parentElement.parentElement.parentElement;
    const entry = post.parentElement;
    entry.removeChild(post);
}


function createPost(post) {

    const close = document.createElement("span");
    close.className = "deleteItem";
    const icon = document.createElement('i');
    icon.classList.add("fa");
    icon.classList.add("fa-fw");
    icon.classList.add("fa-close");
    close.appendChild(icon);

    const img = document.createElement('img');
    img.src = post.images[0];
    img.alt = "textbook";
    img.className = "textbookImg";

    const id = document.createElement("span");
    id.className = "postId";
    id.innerText = `postId: ${post.postId}`;

    const seller = document.createElement("span");
    seller.className = "seller";
    seller.innerText = `seller: ${post.seller.user.username}`;

    const postContainer = document.createElement('div');
    postContainer.className = "post";
    postContainer.appendChild(close);
    postContainer.appendChild(img);
    postContainer.appendChild(id);
    postContainer.appendChild(seller);

    const container = document.createElement('div');
    container.classList.add("col-lg-2");
    container.classList.add("col-md-4");
    container.appendChild(postContainer);

    const viewAll = document.querySelector("#viewAll");
    viewAll.before(container);
}


/******************** User Management ********************/

const userList = document.querySelector("#userList");
const userTable = document.querySelector("#userTable");
const listEnd = document.querySelector("#userListEnd");
const sampleViewUser = document.querySelector("#sampleViewUser");

const showLessButton = document.querySelector("#showLessUser");
const showMoreButton = document.querySelector('#showMoreUser');
const userSearchButton = document.querySelector('#userSearchButton');

sampleViewUser.addEventListener('click', viewUserDetail);
showLessButton.addEventListener('click', showLess);
showMoreButton.addEventListener('click', showMore);
userSearchButton.addEventListener('click', searchUser);


// view the user profile of the sample user
// will require server call to find the url of the personal profile page in Phase 2
function viewUserDetail(e) {
    e.preventDefault();

    window.open("../pages/userProfile.html");
}


// show less user, remove userEntry in DOM
function showLess(e) {
    e.preventDefault();

    const userEntries = document.querySelectorAll('.userEntry');
    const num = shownUserNum;
    for (let i = 1; i <= num; i++) {
        try {
            userTable.removeChild(userEntries[i]);
            shownUserNum--;
        } catch (error) {
        }
    }
}


// show more user
function showMore(e) {
    e.preventDefault();

    loadUserList();
}


function searchUser(e) {
    e.preventDefault();

    const keyword = document.querySelector('#userKeyword').value;
    if (keyword !== "") {

        // code below need server call to find the user matching the keyword
        for (let i = 0; i < users.length; i++) {
            if (keyword === users[i].user.username) {
                showResult(users[i]);
                return;
            }
        }
        showNoResult();

    } else {
        userTable.style.display = "block";
        listEnd.style.display = "block";

        // hide search result table
        const userTable1 = document.querySelector('#userTable1');
        if (userTable1 !== null) {
            userTable1.style.display = "none";
        }
    }
}


function showResult(user) {

    const resultTableOld = document.querySelector("#userTable1");
    if (resultTableOld !== null) {
        userList.removeChild(resultTableOld);
    }

    const userTable1 = document.createElement('div');
    userTable1.id = "userTable1";

    const userEntry = createUserEntry(user);

    userTable1.appendChild(userEntry);
    listEnd.before(userTable1);

    userTable.style.display = "none";
    listEnd.style.display = "none";

}


// helper function for show search user, deals with the situation when
// no result has been found
function showNoResult() {

    const resultTableOld = document.querySelector("#userTable1");
    if (resultTableOld !== null) {
        userList.removeChild(resultTableOld);
    }

    const userTable1 = document.createElement('div');
    userTable1.id = "userTable1";

    const noResultEntry = document.createElement('div');
    noResultEntry.className = "userEntry";
    noResultEntry.innerText = "No Result Found";

    userTable1.appendChild(noResultEntry);
    listEnd.before(userTable1);

    userTable.style.display = "none";
    listEnd.style.display = "none";
}


function deleteUserEntry(e) {
    e.preventDefault();

    if (window.confirm("Do you want to delete this user?")) {

        // get userId
        const user = e.target.parentElement.parentElement;
        const usernameContainer = user.firstElementChild.lastElementChild.firstElementChild;
        const username = usernameContainer.innerText;
        // delete user from users array, will need server in Phase 2
        for (let i = 0; i < users.length; i++) {
            if (users[i].user.username === username) {
                users.splice(i, 1);
                break;
            }
        }

        // remove post in DOM
        removeUser(e);
        loadUserNum();
        window.alert("You have deleted this user.");
    }
}


function removeUser(e) {
    const user = e.target.parentElement.parentElement;
    const table = user.parentElement;
    table.removeChild(user);
}


// Create an entry for user table
function createUserEntry(user) {

    const userEntry = document.createElement("div");
    userEntry.className = "userEntry";

    const userContainer = document.createElement('div');
    userContainer.className = "user";
    userEntry.appendChild(userContainer);

    // User Picture
    const userPicContainer = document.createElement('div');
    userPicContainer.className = "userPicContainer";
    userContainer.appendChild(userPicContainer);

    const userPic = document.createElement('img');
    userPic.src = user.avatar;
    userPic.className = "userPic";
    userPic.alt = "userPic";
    userPicContainer.appendChild(userPic);

    // User Description
    const userContent = document.createElement('div');
    userContent.className = "userContent";
    userContainer.appendChild(userContent);

    const username = document.createElement('strong');
    username.innerText = user.user.username;
    userContent.appendChild(username);

    const bio = document.createElement('p');
    bio.innerText = user.bio;
    userContent.appendChild(bio);


    const userAction = document.createElement('div');
    userAction.className = "userAction";
    userEntry.appendChild(userAction);

    const viewUser = document.createElement('button');
    viewUser.className = "viewUserDetail";
    viewUser.innerText = "View Detail";
    userAction.appendChild(viewUser);

    const deleteUser = document.createElement("button");
    deleteUser.className = "deleteUser";
    deleteUser.innerText = "Delete";
    deleteUser.addEventListener('click', deleteUserEntry);
    userAction.appendChild(deleteUser);

    return userEntry;
}


/***************** Transaction Management *****************/


const approveButtons = document.querySelectorAll(".approve");
const denyButtons = document.querySelectorAll(".deny");

Array.from(approveButtons).forEach(function (element) {
    element.addEventListener('click', checkTransaction);
});
Array.from(denyButtons).forEach(function (element) {
    element.addEventListener('click', checkTransaction);
});

function checkTransaction(e) {
    e.preventDefault();

    if (e.target.classList.contains('approve')) {
        if (window.confirm("Do you want to approve this transaction?")) {

            // change the status of the entry
            const row = e.target.parentElement.parentElement.parentElement;
            const transaction = row.firstElementChild;
            const transactionNum = parseInt(transaction.innerText);
            transactions[transactionNum].status = 1;

            // change num of new transactions
            loadTransactionNum();

            deleteTransactionEntry(e);
            window.alert("You have approved this transaction.");
        }
    } else if (e.target.classList.contains('deny')) {
        if (window.confirm("Do you want to deny this transaction?")) {

            // change the status of the entry
            const row = e.target.parentElement.parentElement.parentElement;
            const transaction = row.firstElementChild;
            const transactionNum = parseInt(transaction.innerText);
            transactions[transactionNum].status = -1;

            // change num of new transactions
            loadTransactionNum();

            deleteTransactionEntry(e);
            window.alert("You have denied this transaction.");
        }
    }
}

function deleteTransactionEntry(e) {
    const row = e.target.parentElement.parentElement.parentElement;
    const tableBody = document.querySelector("#transactionTable").lastElementChild;
    tableBody.removeChild(row);
}

function createTransactionEntry(transaction) {

    const row = document.createElement('tr');
    const id = document.createElement('td');
    id.innerText = transaction.id;
    row.appendChild(id);

    const title = document.createElement('td');
    title.innerText = transaction.post.title;
    row.appendChild(title);

    const buyer = document.createElement('td');
    buyer.innerText = transaction.buyer.user.username;
    row.appendChild(buyer);

    const seller = document.createElement('td');
    seller.innerText = transaction.post.seller.user.username;
    row.appendChild(seller);

    const amount = document.createElement('td');
    amount.innerText = transaction.amount;
    row.appendChild(amount);

    const date = document.createElement('td');
    date.innerText = transaction.date;
    row.appendChild(date);

    const action = document.createElement('td');
    const link1 = document.createElement('a');
    link1.href = "#";
    const icon1 = document.createElement('i');
    icon1.classList.add("fa");
    icon1.classList.add("fa-fw");
    icon1.classList.add("fa-check");
    icon1.classList.add("approve");
    icon1.addEventListener('click', checkTransaction);
    link1.appendChild(icon1);
    const link2 = document.createElement('a');
    link2.href = "#";
    const icon2 = document.createElement('i');
    icon2.classList.add("fa");
    icon2.classList.add("fa-fw");
    icon2.classList.add("fa-close");
    icon2.classList.add("deny");
    icon2.addEventListener('click', checkTransaction);
    link2.appendChild(icon2);
    action.append(link1);
    action.appendChild(link2);
    row.appendChild(action);

    const tableBody = document.querySelector("#transactionTable").lastElementChild;
    tableBody.appendChild(row);

}


/*********************** Chat Box ************************/

const chatShow = document.querySelector("#chatShowButton");
const chatHide = document.querySelector("#chatHide");
chatShow.addEventListener('click', showChatRecords);
chatHide.addEventListener('click', hideChatRoom);

let shownChatRecords = false;
const chatRecords = document.querySelector("#chatRecords");

// show the dropdown list of existing chat

function showChatRecords(e) {
    e.preventDefault();
    if (shownChatRecords === false) {
        const request = new Request("/api/allChats", {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        });
        fetch(request).then((res) => {
            if (res.status === 200) {
                const chatHistories = JSON.parse(res.body);
                const records = document.querySelectorAll('.profile');
                for (let i = 0; i < records.length - 1; i++) {
                    chatRecords.removeChild(chatRecords.lastElementChild);
                }
                for (let i = 0; i < chatHistories.length; i++) {
                    addChatRecord(chatHistories[i]);
                }
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
        const userRequest = new Request("/api/user", {
            method: 'get',
            body: JSON.stringify({username: keyword}),
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
                fetch(request).then((res) => {
                    if (res.status === 200) {

                        // set up chat box
                        const chatName = document.querySelector('#chatName');
                        chatName.innerText = keyword;
                        const chatRoom = document.querySelector('#chatRoom');
                        chatRoom.style.display = "block";

                        loadChatHistory(res.body);
                    }
                });
            } else {
                window.alert("User not found");
            }
        }).catch((error) => {
        })
    }
}


function showChatRoom(e) {
    e.preventDefault();
    const userToChat = e.target.lastElementChild.firstElementChild.innerText;

    if (userToChat !== '') {
        const newChat = {user1: thisUser, user2: userToChat};
        const request = new Request("/api/chat", {
            method: 'get',
            body: JSON.stringify(newChat),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        });
        fetch(request).then((res) => {
            if (res.status === 200) {
                // set up chat box
                const chatName = document.querySelector('#chatName');
                chatName.innerText = userToChat;
                const chatRoom = document.querySelector('#chatRoom');
                chatRoom.style.display = "block";
                loadChatHistory(res.body);
            }
        });
    }
}

function loadChatHistory(chat) {
    const chatHistory = JSON.parse(chat);
    currentChatId = chatHistory._id;

    // remove old chats
    const chatBox = document.querySelector('#chat');
    while(chatBox.hasChildNodes()){
        chatBox.removeChild(chatBox.lastElementChild);
    }

    // load new chats
    for (let i = 0; i < chatHistory.messages.length; i++) {
        if (chatHistory.messages[i].sender === thisUser) {
            addSendMessage(chatHistory.messages[i].content);
        } else {
            addReceivedMessage(chatHistory.messages[i].content);
        }
    }
    const request = new Request(`/api/chat/${currentChatId}`, {
        method: 'update',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    });
}


function hideChatRoom(e) {
    e.preventDefault();
    const chatRoom = document.querySelector('#chatRoom');
    chatRoom.style.display = "none";
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
