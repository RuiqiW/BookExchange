const thisUser = "will"; //TODO: get current user from cookie

let num_posts = 0;

const sortingOpt = document.querySelector("#sortingOption");
sortingOpt.addEventListener("change", onSortingOptChange);

let posts;
let user;
let isRealUser;


function onSortingOptChange() {
    const newOption = sortingOpt.value;
    if (newOption === "timeNewToOld") {
        posts.sort(function (a, b) {
            if (a.postingDate <= b.postingDate) {
                return 1;
            } else {
                return -1;
            }
        });
    } else if (newOption === "timeOldToNew") {
        posts.sort(function (a, b) {
            if (a.postingDate <= b.postingDate) {
                return -1;
            } else {
                return 1;
            }
        });
    } else if (newOption === "priceLowToHigh") {
        posts.sort(function (a, b) {
            if (a.price <= b.price) {
                return -1;
            } else {
                return 1;
            }
        });
    } else {//priceHighToLow
        posts.sort(function (a, b) {
            if (a.price <= b.price) {
                return 1;
            } else {
                return -1;
            }
        });
    }
    generateSearchResult(posts, users[0]);
}

function init() {
    // Server call to request the search results to display and the current user
    // Here we use the hard-coded posts in the class.js as an demonstration
    //By default sorting by posting date from new to old
    const keyword = localStorage.keyword;
    if (keyword) {
        const request = new Request("/api/search/keyword");

        fetch(request).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.user === null) {
                //Create a trivial user for page generation
                user =
                    new User('user', 'user', 'user', 'user@example.com', 'user', false);
                posts = json.result;
                posts.sort(function (a, b) {
                    if (a.postingDate <= b.postingDate) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
            } else {
                isRealUser = true;
                user = json.user;
                posts = json.result;
            }
            if (isRealUser) {
                const cartNumber = user.shortlist.length;
                updateShoppingCart(cartNumber);
                const signInDiv = document.querySelector("#signIn");
                signInDiv.removeChild(signInDiv.lastElementChild);

                const a = document.createElement("a");
                a.setAttribute("href", "/pages/userProfile.html");
                const imageContainer = document.createElement("div");
                imageContainer.className = "topBarImageContainer";
                const image = document.createElement("img");
                image.className = "profileImage";
                image.setAttribute("src", user.avatar);
                imageContainer.appendChild(image);
                a.appendChild(imageContainer);
                imageContainer.appendChild(image);
                signInDiv.appendChild(a);
            }
            generateSearchResult(posts, user);
        });
    }
}

function updateShoppingCart(newNumber) {
    const shoppingCartNumber = document.querySelector("#cartNumber");
    shoppingCartNumber.innerText = newNumber;
}

/**
 * Generate the posts onto the page.
 * @param posts the posts should appear on this page
 * @param user
 */
function generateSearchResult(posts, user) {
    //clear the posts currently displayed on screen
    while (document.querySelector("#posts").lastElementChild) {
        document.querySelector("#posts").removeChild(document.querySelector("#posts").lastElementChild)
    }
    for (let i = 0; i < posts.length; i++) {
        generatePost(posts[i], user).then((resultDiv) => {
            document.querySelector("#posts").firstElementChild.before(resultDiv);
        }).catch((error) => {
            console.log(error);
        });
    }
}

/**
 * Generate the div of this post for the user. Buy item will replaced by "delete this post" if the user is an Admin
 * @param post the post that wanted to be displayed
 * @param user the current user, this is used to check whether item is already in the cart.
 */
function generatePost(post, user) {
    return new Promise((resolve, reject) => {
        fetch("/api/getUser/" + post.seller).then((result) => {
            return result.json();
        }).then((json) => {
            const seller = json.result;
            const postDiv = document.createElement("div");
            postDiv.className = "post";

            const sellerProfilePhoto = document.createElement("img");
            sellerProfilePhoto.className = "profilePhoto";
            sellerProfilePhoto.setAttribute("src", seller.avatar);
            sellerProfilePhoto.setAttribute("alt", "sellerPhoto");

            const sellerNameSpan = document.createElement("span");
            sellerNameSpan.className = "userName";
            sellerNameSpan.appendChild(document.createTextNode(seller.firstName + " " + seller.lastName));

            postDiv.appendChild(sellerProfilePhoto);
            postDiv.appendChild(sellerNameSpan);
            postDiv.appendChild(document.createElement("br"));

            // const postIdSpan = document.createElement("span");
            // postIdSpan.className = "postId";
            // const postIdNumber = document.createElement("span");
            // postIdNumber.className = "postIdNumber";
            // postIdNumber.appendChild(document.createTextNode(post.postId));
            // postIdSpan.appendChild(postIdNumber);
            // postDiv.appendChild(postIdSpan);
            postDiv.id = post._id;

            const categorySpan = document.createElement("span");
            categorySpan.className = "category";
            categorySpan.appendChild(document.createTextNode("Title: " + post.title));
            postDiv.appendChild(categorySpan);

            const conditionSpan = document.createElement("span");
            conditionSpan.className = "condition";
            conditionSpan.appendChild(document.createTextNode("Condition: " + post.condition));
            postDiv.appendChild(conditionSpan);

            const timeSpan = document.createElement("span");
            timeSpan.className = "timespan";
            const date = new Date(post.postingDate);
            timeSpan.appendChild(document.createTextNode("Posting Time: " +
                +date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ` ${date.getHours()}:${date.getMinutes()}`));
            postDiv.appendChild(timeSpan);

            const priceDiv = document.createElement("div");
            priceDiv.className = "price";
            priceDiv.appendChild(document.createTextNode("CAD " + post.price));
            postDiv.appendChild(priceDiv);

            const descriptionDiv = document.createElement("div");
            descriptionDiv.className = "description";
            descriptionDiv.appendChild(document.createTextNode(post.description));
            postDiv.appendChild(descriptionDiv);

            if (post.image.length > 0) {
                const pictureContainer = document.createElement("div");
                const lightboxAttr = `pictureSet${num_posts}`;
                for (let k = 0; k < post.image.length; k++) {
                    const a = document.createElement("a");
                    a.setAttribute("href", "/" + post.image[k]);
                    a.setAttribute("data-lightbox", lightboxAttr);
                    const image = document.createElement("img");
                    image.className = "itemPicture";
                    image.setAttribute("src", "/" + post.image[k]);
                    a.appendChild(image);
                    pictureContainer.appendChild(a);
                }
                postDiv.appendChild(pictureContainer);
            }

            postDiv.appendChild(document.createElement("hr"));

            const soldItem = document.createElement("button");
            soldItem.className = "soldItem";
            soldItem.addEventListener("click", soldAnItem);
            soldItem.appendChild(document.createTextNode("Mark as Sold"));
            postDiv.appendChild(soldItem);

            if (user.isAdmin) {
                const deletePost = document.createElement("button");
                deletePost.className = "deletePost";
                deletePost.appendChild(document.createTextNode("Delete this post"));
                postDiv.appendChild(deletePost);
            } else {
                const deleteItem = document.createElement("button");
                deleteItem.className = "deleteItem";
                deleteItem.appendChild(document.createTextNode("Delete this Post"));
                deleteItem.addEventListener("click", deleteAnItem);
                postDiv.appendChild(deleteItem);
            }

            resolve(postDiv);
        }).catch((error) => {
            console.log(error);
            reject();
        });
    });
}

init();

const makePostButton = document.querySelector("#makePostButton");
makePostButton.addEventListener("click", makePost);

function makePost(e) {
    //Here should be some code check whether user is logged in
    //If not logged in, should jump to login page
    //Here simply jump to make post page
    document.location = "./post-ad.html";
}

const deleteItemButtons = document.querySelectorAll(".deleteItem");
for (let i = 0; i < deleteItemButtons.length; i++) {
    deleteItemButtons[i].addEventListener("click", deleteAnItem);
}

// TODO: implement func
function deleteAnItem(e) {
    //Server call to update the shopping cart of user
    // Here just use user0
    const postId = parseInt(e.target.parentElement.querySelector(".postIdNumber").innerHTML);
    //Should make a server call to fetch the post, here just use the hardcoded posts array
    const post = posts.filter(x => x.postId === postId)[0];
    if (!post.byCreditCard) {
        alert("The seller want you to pay him/her directly, please contact the seller!");
    } else {
        // jump to the credit card page
        document.location = "./payment.html";
        //Make a server call to submit the credit card Number and the postId!
    }
}


/*********************** Mark an item as sold ************************/

const soldItemButton = document.querySelectorAll('.soldItem');

for (let i = 0; i < soldItemButton.length; i++) {
    soldItemButton[i].addEventListener("click", soldAnItem);
}

// TODO: implement func
function soldAnItem(e) {
    e.preventDefault();

    const postId = e.target.parentElement.id;

    const postRequest = new Request(`/api/findSeller/${postId}`, {
        method: 'get',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }
    });

    fetch(postRequest).then((res) => {
        if (res.status === 200) {
            return res.json();
        }else {
            window.alert("Seller not found.");
        }
    }).then((json) => {
        const keyword = json.username;

        if(keyword === thisUser){
            window.alert("This is your item.");
            return;
        }

        // find if the user to chat exists
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
    })

}
