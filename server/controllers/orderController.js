const {Device, DeviceInfo, BasketDevice, OrderDevice, Order, User} = require('../models/models')
const ApiError = require('../error/ApiError');

class OrderController {
    async create(req, res, next) {
        try {
            let {email , firstname, surname, phone, city, dep_address, orderDevices, userId, basketId} = req.body
                const order = await Order.create({email,firstname,surname,phone,city,dep_address, userId});
                orderDevices.map(dev => {
                    console.log(dev);
                    OrderDevice.create({
                    orderId: order.dataValues.id,
                    status: 0,
                    count: dev.count,
                    deviceId: dev.deviceId,
                    userId: dev.device.userId,
                    });


                    BasketDevice.destroy(
                        {
                            where: {basketId , deviceId: dev.deviceId}
                        },
                    )
                    // console.log(Promise.all([device]))
                    Device.update({
                        count: dev.device.count - dev.count,
                    },{where: {id: dev.deviceId}});


            })
                return res.json(order)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async changeStatusOrderDevice(req,res,next) {
        try {
            let {status, id ,userId, } = req.body
             await OrderDevice.update({
                 status
            },{where: {id}});
            const devices = await OrderDevice.findAndCountAll({
                order: [
                    ["createdAt", "DESC"],
                ],
                    where: {userId},
                    include: [{model: Device, as: 'device'}, {model: Order, as: 'order'}]
                })
                return res.json(devices)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async getAll(req, res, next) {
        try {

            let {userId, type} = req.query
            let devices;
            if (type === 'order') {
            devices = await OrderDevice.findAndCountAll({
                order: [
                    ["createdAt", "DESC"],
                ],
                where: {userId},
                include: [{model: Device, as: 'device'}, {model: Order, as: 'order'}]
            })
                return res.json(devices)

            }  else if(type === 'history') {
                devices = await Order.findAndCountAll({
                    order: [
                        ["createdAt", "DESC"],
                    ],
                    where: {userId},
                    include: [{model: OrderDevice, as: 'order_devices' , include: [{model: Device, as: 'device'}, {model: User ,as: 'user',attributes: ['firstname','surname'] }]}]
                })
                return res.json(devices)

            }
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new OrderController()