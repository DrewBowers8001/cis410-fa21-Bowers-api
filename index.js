const express = require("express")
const bcrypt = require("bcryptjs")
const db = require("./dbconnectExec.js")
const jwt = require("jsonwebtoken");
const app = express(); 
app.use(express.json());


app.listen(5000,() => {
    console.log(" app is running on port 5000")
});



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
        // THIS DID NOT POST CORRECTLY, DID NOT GET THE 500 ERROR IN POST MAN
        let result;
        try {
          result = await db.executeQuery(query);
        } catch (myError) {
          console.log("error is  /Employee/login", myError);
          return res.status(500).send();
        }
      
        // console.log("result", result);
      
        if (!result[0]) {
          return res.status(401).send("Invalid user credentials");
        }
      
        // 3. check Password
      
        let user = result[0];
        //console.log("user", user);
      
        if (!bcrypt.compareSync(password, user.Password)) {
          return res.status(401).send("Invalid user credentials");
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
              CustomerPK: user.EmployeePK,
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



app.post("/Shifts", async (req, res) => {
    // res.send("/Customer called");
  
    // console.log("request body", req.body);
  
    let day = req.body.day;
    let start_time = req.body.start_time;
    let time = req.body.time;
    let end_time = req.body.end_time;
    let AvailibilityPK = req.body.AvailibilityPK;
    let  EmployeePK = req.body.EmployeePK;
    
  
    if (!day || !start_time || !time || !end_time || !AvailibilityPK|| !EmployeePK ) {
      return res.status(409).send("Bad request");
   }
    
  
  let timeCheckQuery = `SELECT EmployeePK From Shifts Where EmployeePK = ${EmployeePK}`;

  let existingUser = await db.executeQuery(timeCheckQuery);
    if(existingUser[0]){ return res.status(409).send("Duplicate time")};
    let hashedID = bcrypt.hashSync(EmployeePK)
    let insertQuery = ` INSERT INTO Shifts(day, start_time ,time , end_time , AvailibilityPK , EmployeePK)
    VALUES('${day}',${start_time},${time},${end_time},${AvailibilityPK},${hashedID})`

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