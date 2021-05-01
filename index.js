const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const {signIn , welcome} = require("./handlers");

app.post("/signin" , signIn);
app.get("/welcome" , welcome);
app.listen(8000);