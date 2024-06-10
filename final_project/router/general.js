const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  }
  
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const getBookList = new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let data =  JSON.stringify(books, null, 4)
        resolve(data);
      } catch (err) {
        reject(err);
      }
    }, 3000);
  });

  getBookList.then(
    (data) => res.send(data),
    (err) => res.send("Book list could not be retrieved.")
  );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const getBookDetails = new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let details = books[isbn];
        resolve(details);
      } catch(err) {
        reject(err);
      }
    }, 3000);
  })
  
  getBookDetails.then(
    (details) => res.send(details),
    (err) => res.send("Book details could not be retrieved.")
  )
  });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const getBookDetails = new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        for (const [key, value] of Object.entries(books)) {
          if(books[key].author == author) {
            let data = books[key];
            resolve(data);
          }
        }

      } catch(err) {
        reject(err);
      }
    }, 3000);
  })
  
  getBookDetails.then(
    (details) => res.send(details),
    (err) => res.send("No book withe the author found.")
  )
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const getBookDetails = new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        for(const [key, value] of Object.entries(books)) {
          if(books[key].title == title) {
            let data = books[key];
            resolve(data)
          }
        }

      } catch(err) {
        reject(err);
      }
    }, 3000);
  })
  
  getBookDetails.then(
    (details) => res.send(details),
    (err) => res.send("No book withe the title found.")
  )
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
