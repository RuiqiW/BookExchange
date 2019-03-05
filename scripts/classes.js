let transactionId = 0;
let date = new Date();

class Transaction{
  constructor(post, buyer, amount) {
    this.id = transactionId;
    this.date = date.toDateString();
    this.status = 0;    // 0 for uncompleted, 1 for completed
    transactionId ++;
    post.isSold = 1;
    post.transaction = this;
    buyer.purchase.push(post);
    this.post = post;
    this.buyer = buyer;
    this.amount = amount;
  }
}

let postId = 0;
class Post {
  constructor(title, seller, price, category, condition, description, images=[]) {
    this.postId = postId++;
    this.title = title;
    this.seller = seller;
    seller.sell.push(this);
    this.images = images;              // default value is empty list
    this.category = category;
    this.condition = condition;
    this.description = description;
    this.price = price;
    this.postingDate = new Date();
    this.isSold = false;
    //Should bind with the corresponding transaction if there is one
    this.transaction = null;
  }
}

class User {
  constructor(firstName, lastName, username, email, password, isAdmin=false) {
    // --- Private attributes ---
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.password = password;  // we can fix this in phase 2
    this.isAdmin = isAdmin;
  }
}


let userId = 0;
let picture = "../images/profilePic.jpg";
class UserProfile{
  constructor(user){
    this.userId = userId;
    this.user = user;
    this.picture = picture;
    this.avatar = "../images/profilePic.jpg";                  // src of default avatar
    this.bio = "This is my bio.";
    this.phone = "0123456789";
    this.sell = [];                    // selling items
    this.purchase = [];                // purchased items
    this.shortlist = [];               // Add to Cart items
    userId++;
  }

}

/**
 * Create some static Users for the purpose of phase 1
 */

// ------------------------------- Add some users as specified for phase 1 --------------------------------------------------
const users = [];
users.push(new UserProfile(new User('user', 'user', 'user', 'user@example.com', 'user', false)));
users.push(new UserProfile(new User('admin', 'admin', 'admin', 'admin@example.com', 'admin', true)));

for (let i = 2; i < 51; i++) {
  users.push(new UserProfile(new User(`user${i}`, `user${i}`, `user${i}`, `user${i}@example.com`, `user${i}`, false)));
}

users.push(new UserProfile(new User('Donald', 'Trump', 'America', 'dtrump@president.com', 'user', false)));
users.push(new UserProfile(new User('Kim', 'Jong-un', 'NorthKorea', 'kimJongUn@president.com', 'user', false)));
users.push(new UserProfile(new User('Justin', 'Trudeau', 'Canada', 'trudeau@president.com', 'user',false)));
users.push(new UserProfile(new User('Xi', 'Jinping', 'China', 'jinping@president.com', 'user',false)));
users.push(new UserProfile(new User('George', 'Washington', 'America1', 'gwashinton@president.com', 'user',false)));

//--------------------------------------Constant post for Phase1-------------------------------------------

const posts =[];
const post1 = new Post("Calculus", users[3], 10, "book", "new", "This is a calculus text book I want to sell");
post1.images.push("../images/admin/textbook1.jpg");
post1.postingDate=new Date("2019-01-01T12:30");
posts.push(post1);

const post2 = new Post("Algorithms", users[2], 99, "book", "new", "This is the required textbook for CSC263" );
post2.images.push("../images/admin/textbook2.jpg");
post2.images.push("../images/intro_to_algo.jpeg");
post2.postingDate=new Date("2019-01-02T12:30");
posts.push(post2);

const post3 = new Post("Chez Nous", users[2], 89, "book"," new", "This is the required textbook for FRC100");
post3.images.push("../images/admin/textbook3.jpg");
post3.postingDate=new Date("2019-01-02T12:30");
posts.push(post3);

const post4 = new Post("Microeconomics", users[0], 99.99, "book", "70%-new", "This is the required textbook for ECO101");
post4.images.push("../images/admin/textbook4.jpg");
post4.postingDate=new Date("2019-01-03T12:30");
posts.push(post4);

const post5 = new Post("Statistics", users[0], 89.99, "book", "80%-new", "Textbook for STA257");
post5.images.push("../images/admin/textbook5.jpg");
post5.postingDate=new Date("2019-01-04T12:30");
posts.push(post5);

const post6 = new Post("Web Programming", users[0], 10.99, "book", "new", "Textbook for CSC309");
post6.postingDate=new Date("2019-01-05T12:30");
posts.push(post6);

const post7 = new Post("Linear Algebra", users[2], 10.88, "book", "new", "Textbook for CSC223/224");
post7.postingDate=new Date("2019-01-06T12:30");
posts.push(post7);

//--------------------------------------Constant Transactions for Phase1-------------------------------------------
const transactions =[];
transactions.push(new Transaction(posts[5], users[2], "$45"));
transactions.push(new Transaction(posts[6], users[0], "$24"));

//--------------------------------------Put some items in the shopping cart------------------------------------------

users[0].shortlist.push(post1);
users[0].shortlist.push(post2);
users[0].avatar = "../images/person.jpg";
users[1].avatar = "../images/items/seller2.png";
users[2].avatar = "../images/items/seller2.jpeg";
users[3].avatar = "../images/items/seller1.jpg";