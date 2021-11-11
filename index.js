const express = require("express")
const bcrypt = require("bcryptjs")
const db = require("./dbconnectExec.js")
const app = express(); 
app.use(express.json());


app.listen(5000,() => {
    console.log(" app is running on port 5000")
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