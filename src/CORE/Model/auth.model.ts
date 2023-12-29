import mongoose from "mongoose";


const schema = new mongoose.Schema({
    name: String,
    lastname: String,
    user: String,
    email: String,
    password: String,
    birth: String,
    type_encrypt: String, // JWT (HS256-Alg)-Default
    role: String,
    token_confirm_account: String,
    userActive: Boolean

});
export default mongoose.model('User', schema);

