const {Device, DeviceInfo, BasketDevice} = require('../models/models')
const ApiError = require('../error/ApiError');

class CartController {
    async create(req, res, next) {
        try {
            let {basketId , deviceId} = req.body
           let devices = await BasketDevice.findOne({where:{basketId,deviceId}})
            if (devices && devices) {
                const device = await BasketDevice.update({count: devices.dataValues.count + 1}, { where: { id: devices.dataValues.id } });
                return res.json(device)

            }else {
                const device = await BasketDevice.create({count: 1 ,basketId, deviceId,});
                return res.json(device)

            }

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        let {cartId} = req.query
        let devices;
            devices = await BasketDevice.findAndCountAll({where:{basketId: cartId}, include: {model: Device, as: 'device'}})
        return res.json(devices)
    }

    async deleteDevice(req, res) {
        const {id} = req.query
         await BasketDevice.destroy(
            {
                where: {id},
            },
        )
        return res.json({id})
    }
    async changeCount(req, res) {
        const {id, count} = req.body
        console.log(id,count)
        const device = await BasketDevice.update({count: count}, { where: { id } });

        return res.json({id, count})
    }
}

module.exports = new CartController()