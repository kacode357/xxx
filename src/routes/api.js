const express = require('express');
const { createUser, handleLogin, getUser, updateAccount, generateAdmin, getCurrentAccount,  } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.all("*", auth)
routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world");
});
routerAPI.post("/users/generate", generateAdmin)
routerAPI.post("/register" , createUser)
routerAPI.post("/login" , handleLogin)
routerAPI.post("/user" , delay, getUser)
routerAPI.put("/account/:id", updateAccount); 
routerAPI.get("/auth", getCurrentAccount);  





module.exports = routerAPI; //export default