const UserSchema = require("../../../database/Schema/UserSchema");

const updateInfoUser = async(id,data) => {
    try {
        let findUser = await UserSchema.findOneAndUpdate({id},data )
        console.log(findUser, data)
        let {name,surname,city,status,birthDay,job,description,portfolio,contacts} = data
        // let update = await findUser.updateOne({data})
        return findUser
    }
    catch(e) {
        return false
    }
}

module.exports = {updateInfoUser}