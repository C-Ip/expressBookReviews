const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Customer Login. Check username and password."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  //console.log("Username: " + bookReview[1].username);
  if(books[isbn].reviews) {
    const book = books[isbn]
    const username = req.session.authorization.username;
    const review = req.body.review;

    if(book.reviews[username]) {
      book.reviews[username].review = review;
    }

    book.reviews[username] = {"review": review};
    res.status(200).json({message: "The review of book with ISBN " + isbn + " has been added/updated."});
  }
  res.status(200).json({message: "No review has been added/updated."});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const sessionUser = req.session.authorization.username;
  const book = books[isbn];
  if(book.reviews[sessionUser]) {
    delete book.reviews[sessionUser];
    res.status(200).json({message: "Review of book with ISBN " + isbn + " from the user has been deleted."});
  }
  res.status(200).json({message: "Failed"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
