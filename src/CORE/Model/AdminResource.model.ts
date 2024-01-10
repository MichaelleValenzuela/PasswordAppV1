import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    name_type: String,

    type_encrypt: {
        type: String,
        default: 'RFC 7519'
    },
    fields: [{
        input_name: String,
        input_type: String,
        input_atr_name: String
    }]
});
export default mongoose.model('AdminResource', schema);