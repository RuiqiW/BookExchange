import {User, UserProfile} from "./User.js";
import {Post} from "./Post.js";
import {Transaction} from "./Transaction.js";

/**
 * Create some static Users for the purpose of phase 1
 */
const users = [];

// ------------------------------- Add some users as specified for phase 1 --------------------------------------------------
users.push(new UserProfile(new User('user', 'user', 'user', 'user@example.com', 'user')));
users.push(new UserProfile(new User('admin', 'admin', 'admin', 'admin@example.com', 'admin')));

for (let i = 2; i < 51; i++) {
    users.push(new UserProfile(new User(`user${i}`, `user${i}`, `user${i}`, `user${i}@example.com`, `user${i}`)));
}

users.push(new UserProfile(new User('Donald', 'Trump', 'America', 'dtrump@president.com', 'user')));
users.push(new UserProfile(new User('Kim', 'Jong-un', 'NorthKorea', 'kimJongUn@president.com', 'user')));
users.push(new UserProfile(new User('Justin', 'Trudeau', 'Canada', 'trudeau@president.com', 'user')));
users.push(new UserProfile(new User('Xi', 'Jinping', 'China', 'jinping@president.com', 'user')));
users.push(new UserProfile(new User('George', 'Washington', 'America1', 'gwashinton@president.com', 'user')));

export {users};

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

export{ posts };
//--------------------------------------Constant Transactions for Phase1-------------------------------------------
const transactions =[];
transactions.push(new Transaction(posts[5], users[2], "$45"));
transactions.push(new Transaction(posts[6], users[0], "$24"));

export{ transactions };
//--------------------------------------Put some items in the shopping cart------------------------------------------

users[0].shortlist.push(post1);
users[0].shortlist.push(post2);
users[0].avatar = "../images/person.jpg";
users[1].avatar = "../images/profilePic2.png";
users[2].avatar = "../images/items/seller2.jpeg";
users[3].avatar = "../images/items/seller1.jpg";