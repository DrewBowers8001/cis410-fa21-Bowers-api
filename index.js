const express = require("express")
const bcrypt = require("bcryptjs")
const db = require("./dbconnectExec.js")
const jwt = require("jsonwebtoken");
const app = express(); 
const config = require("./config.js");
//const auth = require("./middleware/authenticate")
app.use(express.json());

const PORT = process.env.PORT || 5000;


app.listen(5000,() => {
    console.log(" app is running on port 5000")
});
const auth = async(req,res,next)=> { 
 console.log(" in middleware", req)  
} 
app.post("/Availibility", auth, async (req,res)=> { 

  try{ 
    let AvailibilityPK = req.body.AvailibilityPK;  
    let time = req.body.time;
    let preffered_hours = req.body.preffered_hours;
    let EmployeePK = req.body.EmployeePK;

    console.log(AvailibilityPK,time,preffered_hours,EmployeePK);
    if(!AvailibilityPK || !time || !preffered_hours || !EmployeePK ){
      return res.status(400).send("bad Request")}
   
     

     
  }
  catch(err){ 
    console.log(" error is here in /Availibiliity", err)
    res.status(500).send();
  }
});
 


/*app.post("/Availibility",  async (req,res) => {
try{
  
    let AvailibilityPK = req.body.AvailibilityPK;  
  let time = req.body.time;
  let Pref = req.body.preffered_hours;
  let EmployeePK = req.body.EmployeePK;
    if(!AvailibilityPK || !time  || !Pref || !EmployeePK ){ 
        return res.status(400).send("bad Request")

    
    }
    res.send("here is the response")
}
catch(err){ 
    console.log("error in reviews", err)
    res.status(500).send();
}



}); 
*/




    app.post("/Employee/login", async (req, res) => {
        // console.log("/customer/login called", req.body);
      
        //1. Data validation
        let email = req.body.email;
        let password = req.body.password;
      
        if (!email || !password) {
          return res.status(400).send("Bad request");
        }
      
        // 2. Check that user exists in DB
      
        let query = `SELECT *
        FROM Employee
        WHERE Email = '${email}'`;
     
        let result;
        try { 
          result = await db.executeQuery(query);
        } catch (myError) {
          console.log("error is  /Employee/login", myError);
          return res.status(500).send(); 
        }
      
        console.log("result", result);
       
        if (!result[0]) {
          return res.status(401).send("Invalid user credentials");
        }
      
        // 3. check Password
      
        let user = result[0];
        console.log("user", user);
      
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).send("Invalid credentials");
        }
      
        // 4. generate token 
      
        let token = jwt.sign({ pk: user.EmployeePK }, config.JWT, {
          expiresIn: "60 minutes",
        });
        console.log("token", token);
      
        // 5. Save token in DB and send response back
      
        let setTokenQuery = `UPDATE Employee
        SET Token = '${token}'
        WHERE EmployeePK = '${user.EmployeePK}'`;
      
        try {
          await db.executeQuery(setTokenQuery);
      
          res.status(200).send({
            token: token,
            user: {
              NameFirst: user.first_name,
              NameLast: user.last_name,
              Email: user.Email,
              EmployeePK: user.EmployeePK,
            }, 
          });
        } catch (myError) {
          console.log("error in setting user token", myError);
          res.status(500).send();
        }
      });








app.get("/hi",(req, res) => { res.send("hello world ")


})

app.get("/", (req, res) => { res.send("API is running ")})



app.post("/Employee/get", async (req, res) => {
   res.send("/Employee called");
  
     console.log("request body", req.body);
    
    let  first_name= req.body.first_name;
    let last_name = req.body.last_name;
    let Email = req.body.Email;
    let Phone = req.body.phone;
    let Position = req.body.Position;
    let password = req.body.password;


    
  
    if (!first_name || !last_name || !Email || !Position || !Phone ||  !password  ) {
      return res.status(409).send("Bad request");
   }
     
  
  let PasswordCheckQuery = `SELECT Email From Employee Where Email = '${Email}'`;

  let existingUser = await db.executeQuery(PasswordCheckQuery);
    if(existingUser[0]){ return res.status(409).send("Duplicate Email")};
    let hashedID = bcrypt.hashSync(password)
    let insertQuery = `INSERT INTO Employee(First_Name, Last_Name, Position , phone, Email, password)
    VALUES('${first_name}','${last_name}','${Position}','${Phone}','${Email}','${hashedID}')`
 
    db.executeQuery(insertQuery) 
    .then(()=> {
        res.status(201).send(); 
    })
    .catch((err) => { 
        console.log("Error in post", err);
        res.status(500).send 
    })
});

app.get("/Employee", (req,res ) => {

    db.executeQuery(
        `Select * 
        from Employee`)
    .then((theResults)=> {
        res.status(200).send(theResults)
    })
    .catch((myError) => { 
    console.log(myError);
    
    res.status(500).send(); 
    })
}); 
 


app.get("/Employee/:pk", (req, res) => { 
    let pk = req.params.pk

    console.log(pk)

   let myQuery = `Select * from shifts left join Employee on Employee.EmployeePK = ShiftsPK where ShiftsPK = ${pk}`;


db.executeQuery(myQuery)
.then((result) => {
console.log("result", result) 
if (result[0]){ 
    res.send(result[0]);

} else { res.status(404).send(`bad request`)

}

}).catch((err)=> {

    console.log("Error",err);

    res.status(500).send();
})

});

//app.put();