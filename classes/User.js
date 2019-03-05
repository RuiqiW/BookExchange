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
let picture = "../images/profilePic.jpg";
export class UserProfile{
  constructor(user){
    this._userId = userId;
    this._user = user;
    this._picture = picture;
    this._avatar = "../images/profilePic.jpg";                  // src of default avatar
    this._bio = "";
    this._phone = "0123456789";
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
  
  get picture() {
    return this._picture;
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

  set avatar(newAvatar) {
    this._avatar = newAvatar;
  }
}


