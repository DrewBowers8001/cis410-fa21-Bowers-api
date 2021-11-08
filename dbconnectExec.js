const sql = require('mssql')
const dataconfig = require("./config.js");
const config = {
    user: dataconfig.DB.user,
    password:  dataconfig.DB.password,
    server:  dataconfig.DB.server, // You can use 'localhost\\instance' to connect to named instance
    database:  dataconfig.DB.database,
}

async function executeQuery(aQuery){ 
    let connection = await sql.connect(config);

    let result = await connection.query(aQuery);

    console.log(result)

    return result.recordset
}




module.exports = {executeQuery: executeQuery};
