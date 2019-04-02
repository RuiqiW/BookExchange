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
    const endOfResults = document.createElement("div");
    endOfResults.id = "endOfResults";
    endOfResults.appendChild(document.createTextNode("End of Results"));
    document.querySelector("#posts").appendChild(endOfResults);

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

            if (user.shortlist.filter((post) => {
                return post._id === postDiv.id;
            }).length === 0) {
                const removeButton = document.createElement("button");
                removeButton.className = "addToCart";
                removeButton.appendChild(document.createTextNode("Add to Cart"));
                removeButton.addEventListener("click", addToCart);
                postDiv.appendChild(removeButton);
            } else {
                const addButton = document.createElement("button");
                addButton.className = "removeFromCart";
                addButton.appendChild(document.createTextNode("Remove from Cart"));
                addButton.addEventListener("click", removeFromCart);
                postDiv.appendChild(addButton);
            }

            const contactSeller = document.createElement("button");
            contactSeller.className = "contactSeller";
            contactSeller.addEventListener("click", contactTheSeller);
            contactSeller.appendChild(document.createTextNode("Contact Seller"));

            if (user.isAdmin) {
                const deletePost = document.createElement("button");
                deletePost.className = "deletePost";
                deletePost.appendChild(document.createTextNode("Delete this post"));
                postDiv.appendChild(deletePost);
            } else {
                const buyItem = document.createElement("button");
                buyItem.className = "buyItem";
                buyItem.appendChild(document.createTextNode("Buy this item"));
                buyItem.addEventListener("click", buyItem);
                postDiv.appendChild(buyItem);
            }

            postDiv.appendChild(contactSeller);
            resolve(postDiv);
        }).catch((error) => {
            console.log(error);
            reject();
        });
    });
}

init();
const addToCartButtons = document.querySelectorAll(".addToCart");
for (let i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener("click", addToCart);
}

const removeFromCartButtons = document.querySelectorAll(".removeFromCart");
for (let i = 0; i < removeFromCartButtons.length; i++) {
    removeFromCartButtons[i].addEventListener("click", removeFromCart);
}

function addToCart(e) {
    const postId = e.target.parentElement.id;
    const request = new Request("/api/addToCart/" + postId, {
        method: 'post',
    });
    fetch(request).then((newUser) => {
        return newUser.json()
    }).then((newUser) => {
        updateShoppingCart(newUser.user.shortlist.length);
        //Change the button to remove the item from shopping cart.
        e.target.className = "removeFromCart";
        e.target.innerHTML = "";
        e.target.appendChild(document.createTextNode("Remove from Cart"));
        e.target.removeEventListener("click", addToCart);
        e.target.addEventListener("click", removeFromCart);
        user = newUser.user;
        updateShoppingCart(user.shortlist.length);
    });

}

function removeFromCart(e) {
    const postId = e.target.parentElement.id;
    const request = new Request("/api/removeFromCart/" + postId, {
        method: 'delete',
    });
    fetch(request).then((newUser) => {
        return newUser.json()
    }).then((newUser) => {
        updateShoppingCart(newUser.newUser.shortlist.length);
        //Change the button to remove the item from shopping cart.
        e.target.className = "addToCart";
        e.target.innerHTML = "";
        e.target.appendChild(document.createTextNode("Add to Cart"));
        e.target.removeEventListener("click", removeFromCart);
        e.target.addEventListener("click", addToCart);
        user = newUser.newUser;
    });
}

const makePostButton = document.querySelector("#makePostButton");
makePostButton.addEventListener("click", makePost);

function makePost(e) {
    //Here should be some code check whether user is logged in
    //If not logged in, should jump to login page
    //Here simply jump to make post page
    document.location = "./post-ad.html";
}

const buyItemButtons = document.querySelectorAll(".buyItem");
for (let i = 0; i < buyItemButtons.length; i++) {
    buyItemButtons[i].addEventListener("click", buyItem);
}

function buyItem(e) {
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


/*********************** Contact Seller by User "user" for Phase 1 ************************/

const contactButton = document.querySelectorAll('.contactSeller');

for (let i = 0; i < contactButton.length; i++) {
    contactButton[i].addEventListener("click", contactTheSeller);
}

function contactTheSeller(e) {
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

const searchButton = document.querySelector("#searchButton");
searchButton.addEventListener("click", searching);

function searching(e) {
    e.preventDefault();
    //Server call to request search result, here just jump to the item.html;
    document.location = "../pages/items.html";
}

/*********************** Drop down select ************************/

// the select drop down box with 3 search options
const x = document.getElementsByClassName("custom-select");
for (let i = 0; i < x.length; i++) {
    const selElmnt = x[i].getElementsByTagName("select")[0];
    // for each element, create a div DIV that will act as the selected item
    const a = document.createElement("div");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    // for each element, create a new div that will contain the option list
    const b = document.createElement("div");
    b.setAttribute("class", "select-items select-hide");
    for (let j = 1; j < selElmnt.length; j++) {
        // for each option in the original select element, create a new div that will act as an option item
        const c = document.createElement("div");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            // when an item is clicked, update the original select box and the selected item
            const s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            const h = this.parentNode.previousSibling;
            for (let l = 0; l < s.length; l++) {
                if (s.options[l].innerHTML === this.innerHTML) {
                    s.selectedIndex = l;
                    h.innerHTML = this.innerHTML;
                    const y = this.parentNode.getElementsByClassName("same-as-selected");
                    for (let k = 0; k < y.length; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        // when the select box is clicked, close any other select boxes and open/close the current select box
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

// closes the select box
function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    const arrNo = [];
    const x = document.getElementsByClassName("select-items");
    const y = document.getElementsByClassName("select-selected");
    for (let i = 0; i < y.length; i++) {
        if (elmnt === y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (let j = 0; j < x.length; j++) {
        if (arrNo.indexOf(j)) {
            x[j].classList.add("select-hide");
        }
    }
}

// Close all select boxes if the user clickes outside of the box
document.addEventListener("click", closeAllSelect);