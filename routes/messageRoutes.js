const Message = require('../models/message');
const Notification = require('../models/notification')

const withAuth = require('../withAuth');


function messageRoutes(app, io) {
   
    app.post("/message/add", withAuth, async (req, res)=>{
        const messageData = {
            senderUserId : req.body.senderUserId,
            receiverUserId: req.body.receiverUserId,
            body: req.body.body,
            creationDateTime: new Date(),
            lastUpdateDateTime: new Date()
        }

        const notificationData = {
            senderUserId: req.body.senderUserId,
            receiverUserId: req.body.receiverUserId,
            message: 'you have one new message',
            creationDateTime: new Date()
        }

        const message = new Message(messageData);
        const notification = new Notification(notificationData);

        const result = await message.save();
        

        if(result.code){
            res.status(result.code).json({result})
            return;
        }
        
        const  resultNotification = await notification.save();
        console.log(resultNotification);
        io.emit('newMessage', {receiverUserId: req.body.receiverUserId})
        io.emit('newNotification', {receiverUserId: req.body.receiverUserId})

        res.status(200).json({result, resultNotification})

    })

    app.get('/message/all', async (req, res)=>{
        const messages = await Message.find({})
        
        if(messages.code) {
            res.status(messages.code).json({messages})
        }

        res.status(200).json({messages})
    })

    app.get('/messagesByUser/:user_id', withAuth, async (req, res) => {
        const user_id = req.params.user_id;
        const messages = await Message.find({$or: [{senderUserId: user_id}, {receiverUserId: user_id}]});

        console.log("message", messages.code);

        if(messages.code){
            res.status(messages.code).json({messages})
        }
        res.status(200).json({messages})

    })

    app.get('/message/:id', withAuth, async (req, res) => {
        const id = req.params.id;
        const message = await Message.findOne({_id : id});

        console.log("message", message.code);

        if(message.code){
            res.status(message.code).json({message})
        }
        res.status(200).json({message})

    })

    app.delete('/message/:id', withAuth, async (req, res)=>{
        const id = req.params.id;
        const message = await Message.findOne({_id: id})
        console.log(message)
        if(message.code) {
            res.status(message.code).json({message})
        }
        
        const result = await Message.deleteOne({_id: id});
        if(result.code) {
            res.status(result.code).json({result})
        }
        io.emit('updateDeleteMessage', {receiverUserId: message.receiverUserId, senderUserId: message.senderUserId})
        res.status(200).json({result})

    })

    app.put('/message/:id', withAuth, async (req, res)=>{
        const id = req.params.id;
        const result = await Message.updateOne({_id: id}, {body: req.body.body});

        if(result.code) {
            res.status(result.code).json({result})
        }

        const message = await Message.findOne({_id: id})
        console.log(message)
        if(message.code) {
            res.status(message.code).json({message})
        }

        io.emit('updateDeleteMessage', {receiverUserId: message.receiverUserId, senderUserId: message.senderUserId})


        res.status(200).json({result})
    })

    
}

module.exports = messageRoutes;
