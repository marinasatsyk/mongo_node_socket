const Notification = require('../models/notification')
const withAuth = require('../withAuth')


function notificationRoutes(app, io){
   
    app.get('/notificationByUser/:user_id', withAuth,async (req, res)=>{
        const user_id = req.params.user_id;
        const notification = await Notification.find({receiverUserId: user_id});

        if(notification.code) {
            res.status(notification.code).json({notification})
        }

        res.status(200).json({notification})
    })

    app.put('/notification/:id', withAuth, async (req, res)=>{
        const id = req.params.id;
        const result = await Notification.updateOne({_id: id}, {view: req.body.view});

        if(result.code) {
            res.status(result.code).json({result})
        }

        const notification = await Notification.findOne({_id: id})
        console.log(notification)
        if(notification.code) {
            res.status(notification.code).json({notification})
        }

        io.emit('updateNotification', {receiverUserId: notification.receiverUserId})

        res.status(200).json({result})
    })

}

module.exports = notificationRoutes;