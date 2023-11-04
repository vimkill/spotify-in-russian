const { pool } = require("../../dependes")

async function getUserData() {
    let data = {
        message: 'error',
        statusCode: 400,
    }
    try {
        const check = await pool.query(`SELECT * FROM users`)
        data = {statusCode: 200, message: check[0]}
    } catch (e) {
        console.log(e)
    }
    return data
}

module.exports = {
    getUserData: getUserData
}