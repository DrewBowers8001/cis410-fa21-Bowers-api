const jwt = require("jsonwebtoken")
const config = require("../config.js")
const db = require("../dbconnectExec.js")
const auth = async(req,res,next)=> { 
  console.log(" in middleware", req.header("Authorization"))  
 //next();

 try { 
   //decode token
  let myToken = req.header("Authorization").replace("Bearer ", "");
   console.log("Token", myToken);

  let decoded = jwt.verify(myToken, config.JWT);
  console.log(decoded);
  let EmployeePK = decoded.pk;

  //compare token with database 
 let query = `SELECT EmployeePK, First_Name, Last_Name, Email
    FROM Employee
    WHERE EmployeePK= ${EmployeePK} and Token = '${myToken}'`;
    let returnedUser = await db.executeQuery(query);

    console.log("returned user", returnedUser);
    console.log

    //3. // Save the user information in the request
    if (returnedUser[0]) {

    
      req.Employee = returnedUser[0];
      console.log("Employee", req.Employee)
      next();
    } else {
      return res.status(401).send("Invalid  thr credentials");
    }


} catch(err){
  console.log("err",err)
  return res.status(401).send("invalid credentials ")

//decode token 


}

}


module.exports = auth