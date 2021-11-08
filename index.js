const express = require("express")

const db = require("./dbconnectExec.js")
const app = express(); 

app.listen(5000,() => {
    console.log(" app is running on port 5000")
});


app.get("/hi",(req, res) => { res.send("hello world ")


})

app.get("/", (req, res) => { res.send("API is running ")})


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