import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user_id: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    resource_admin_id: {
        ref: "AdminResource",
        type: mongoose.Schema.Types.ObjectId
    },
    type_resource: String,
    resource: String
});
export default mongoose.model('UserResource', schema);