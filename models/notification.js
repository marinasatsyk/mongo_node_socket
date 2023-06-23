const Mongoose = require('mongoose');

const notificationSchema = new Mongoose.Schema({
    senderUserId: {type: String, required: true},
    receiverUserId: {type: String, required: true},
    message: {type: String, required: true},
    view : {type: Boolean, default: false},
    creationDateTime: {type: Date, required: true}
}, {collection: "notification"})

const NotificationModel = Mongoose.model("Notification", notificationSchema);
module.exports = NotificationModel;