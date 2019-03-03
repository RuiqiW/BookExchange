let userId = 0;
let postId = 0;
let transactionId = 0;
let date = new Date();

class User{
    constructor(firstName, lastName, userName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.password = password;
    }
}

class UserProfile{
    constructor(user){
        this.userId = userId;
        this.user = user;
        this.avatar = ""; // src of avatar
        this.bio = "";
        this.phone = "1234567890";
        this.sell = []; // selling items
        this.purchase = []; // purchased items
        this.shortlist = []; // Add to Cart items
        userId++;
    }
}

class Post{
    constructor(title, seller){
        this.postId = postId;
        this.title = title;
        this.seller = seller;
        this.image = "";
        this.category = "Textbook";
        this.condition = "New";
        this.description = "";
        this.price = "$10";
        postId ++;
        this.isSold = 0;
        //Should bind with the corresponding transaction if there is one
        this.transaction = null;
        seller.sell.push(this);
    }
}

class Transaction{
    constructor(post, buyer, amount){
        this.id = transactionId;
        this.post = post;
        this.buyer = buyer;
        this.amount = amount;
        this.date = date.getTime();
        this.status = 0;    // 0 for uncompleted, 1 for completed
        transactionId ++;
        post.isSold = 1;
        post.transaction = this;
        buyer.purchase.push(post);

    }
}

// User Profiles
const users = [];
const defaultUser = new User("user", "user", "user", "user@example.com", "user");
users.push(new UserProfile(defaultUser));
const user1 = new User("user1", "user1", "user1", "user1@example.com", "user1");
users.push(new UserProfile(user1));

// Posts
const posts =[];
const post1 = new Post("Calculus", users[0]);
post1.image = "../images/admin/textbook1.jpg";
posts.push(post1);

const post2 = new Post("Algorithms", users[1]);
post2.image = "../images/admin/textbook2.jpg";
posts.push(post2);

const post3 = new Post("Chez Nous", users[1]);
post3.image = "../images/admin/textbook3.jpg";
posts.push(post3);

const post4 = new Post("Microeconomics", users[0]);
post4.image = "../images/admin/textbook4.jpg";
posts.push(post4);

const post5 = new Post("Statistics", users[0]);
post5.image = "../images/admin/textbook5.jpg";
posts.push(post5);

const post6 = new Post("Web Programming", users[0]);
posts.push(post6);

const post7 = new Post("Linear Algebra", users[1]);
posts.push(post7);

const transactions =[];
transactions.push(new Transaction(post6, users[0], "$45"));
transactions.push(new Transaction(post7, users[1], "$24"));