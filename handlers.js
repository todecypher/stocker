const jwt = require("jsonwebtoken")
const mysql = require('mysql');
var Promise = require('promise');
const util = require('util');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "users"
  });
  
  
 
const query = util.promisify(con.query).bind(con);
const jwtKey = "thisIsMahSecretahhahahaha"
const jwtExpiryTime  = 300

const signIn = async(req , res) =>{
    const {username , password} = req.body
    var pass;
    var getPass = async function(){
        const sql = "select * from users where username = ?";
        var res 
        try {
           res =  await query( sql, [username])
        }catch(e){
            console.log(e)
            res = [{username : "no" , password: "no"}]
        }finally{
            return res
        }
    } 
   getPass().then(value =>{
       pass = value[0].password;
       if(pass !== password){
           
          return res.status(401).end()
    }
     const token = jwt.sign({username} , jwtKey , {
           algorithm : "HS256",
           expiresIn :  jwtExpiryTime
     })
   console.log("token" , token)
   res.send({"token" : token}).end()
   }).catch(()=> res.status(401).end()) 
}

const welcome = (req, res) =>{
    const token = req.body.token
    const query = req.query
    console.log(query)

    if(!token){
        return  res.status(401).end()
    }

    const data = jwt.verify(token , jwtKey)

    res.send(`Welcome ${data.username}`)
    
}

module.exports = {signIn , welcome}