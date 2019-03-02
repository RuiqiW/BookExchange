/**
 * This module contains a User class with some inheritable methods
 */
export default class User {
  constructor(firstName, lastName, username, email, password) {
    // --- Private attributes ---
    this._firstName = firstName;
    this._lastName = lastName;
    this._username = username;
    this._email = email;
    this._password = password;        // we can fix this in phase 2
    this._bio = '';
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

  get bio() {
    return this._bio;
  }

  set bio(newBio) {
    this._bio = newBio;
  }

}


/**
 * Create some static Users for the purpose of phase 1
 */
const users = [];

// Add some users as specified for phase 1
users.push(new User('user', 'user', 'user', 'user@example.com', 'user'));
users.push(new User('admin', 'admin', 'admin', 'admin@example.com', 'admin'));

for (let i = 2; i < 51; i++) {
  users.push(new User(`user${i}`, `user${i}`, `user${i}`, `user${i}@example.com`, `user${i}`));
  users.push(new User(`admin${i}`, `admin${i}`, `admin${i}`, `admin${i}@example.com`, `admin${i}`));
}

users.push(new User('Donald', 'Trump', 'America', 'dtrump@president.com', 'user'));
users.push(new User('Kim', 'Jong-un', 'NorthKorea', 'kimJongUn@president.com', 'user'));
users.push(new User('Justin', 'Trudeau', 'Canada', 'trudeau@president.com', 'user'));
users.push(new User('Xi', 'Jinping', 'China', 'jinping@president.com', 'user'));
users.push(new User('George', 'Washington', 'America1', 'gwashinton@president.com', 'user'));




export { users };