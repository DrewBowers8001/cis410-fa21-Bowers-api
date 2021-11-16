const jwt = require("jsonwebtoken"); 
const config = require("/..config.js")
const auth = async(req,res, next) => {
    console.log("in the middle ware",req.header("Authorization")); 
    next();

    try{  

        let myToken = req.header("Authorization").replace("Bearer ", "");

        let decoded = jwt.verify(myToken, config.JWT)
        console.log("token", myToken)

        let EmployeePK = decoded.pk
        
    let query = `SELECT EmployeePK, first_name, last_name, Email
    FROM Employee
    WHERE EmployeePK=${EmployeePK} and token = '${myToken}'`;

    let returnedUser = await db.executeQuery(query);
    console.log("returned user", returnedUser);

    //3. // Save the user information in the request
    if (returnedUser[0]) {
      req.customer = returnedUser[0];
      next();
    } else {
      return res.status(401).send("Invalid credentials");
    }

    }catch(err){ 
        return res.status(401).send("invalid credentials")
    }
}
module.exports = auth