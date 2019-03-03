/**
 * This module contains a User class with some inheritable methods
 */
export class User {
  constructor(firstName, lastName, username, email, password) {
    // --- Private attributes ---
    this._firstName = firstName;
    this._lastName = lastName;
    this._username = username;
    this._email = email;
    this._password = password;        // we can fix this in phase 2
  }

  // --- Public Methods ---
  get firstName() {
    return this._firstName;
  }

  set firstName(newFirstName) {
    this._firstName = newFirstName;
  }

  get lastName() {
    return this._lastName;
  }

  set lastName(newLastName) {
    this._lastName = newLastName;
  }

  get username() {
    return this._username;
  }

  set username(newUsername) {
    this._username = newUsername;
  }

  get email() {
    return this._email;
  }

  set email(newEmail) {
    this._email = newEmail;
  }

  get password() {
    return this._password;
  }

  set password(newPassword) {
    this._password = newPassword;
  }

}


let userId = 0;
export class UserProfile{
  constructor(user){
    this._userId = userId;
    this._user = user;
    this._avatar = "";                  // src of avatar
    this._bio = "";
    this._phone = "1234567890";
    this._sell = [];                    // selling items
    this._purchase = [];                // purchased items
    this._shortlist = [];               // Add to Cart items
    userId++;
  }

  get userId() {
    return this._userId;
  }

  get user() {
    return this._user;
  }

  get avatar() {
    return this._avatar;
  }

  get bio() {
    return this._bio;
  }

  get phone() {
    return this._phone;
  }

  get sell() {
    return this._sell;
  }

  get purchase() {
    return this._purchase;
  }

  get shortlist() {
    return this._shortlist;
  }
}


/**
 * Create some static Users for the purpose of phase 1
 */
const users = [];

// Add some users as specified for phase 1
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




export { users };