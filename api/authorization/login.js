
async function Login(req,res) {
    const {login,password} = req.body
    console.log(login,password)
    res.json({login,password, type: "Login"})
}

module.exports = Login