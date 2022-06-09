const uuid = require('uuid')
const path = require('path');
const {Device, DeviceInfo, Type, TypeBrand, Brand, BasketDevice, OrderDevice} = require('../models/models')
const ApiError = require('../error/ApiError');
const {where} = require("sequelize");
const fs = require("fs");

class DeviceController {

    async files(req, res, next) {
        try {
            console.log(req)
            const arr = []
            for (const key in req.files) {
                let fileName = uuid.v4() + ".jpg"
                req.files[key].mv(path.resolve(__dirname, '..', 'static', fileName))
                arr.push(fileName);
            }
            console.log(arr)


            return res.json(arr)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async deleteFiles(req, res, next) {
        try {
        let data = ''
        for (const key in req.query) {
            if (key === 'deviceId'){
                const device = await Device.findOne(
                    {
                        where: {id: req.query[key]},
                        include: [{model: DeviceInfo, as: 'info'}]
                    },
                )
                const parsedImg = (device.dataValues.img ? JSON.parse(device.dataValues.img) : null)
                const img = []
                for (const key in parsedImg) {
                    img.push(parsedImg[key])
                }
                const filterArray = img.filter(res => res !== req.query['id0'])
                let obj = {}
                filterArray.map((res, index) => {
                    obj = {...obj, [`img${index}`]: res }
                })
                 await Device.update({
                    img: JSON.stringify(obj),
                },{where: {id: req.query[key]}});
            }else {
                data = req.query[key]
                fs.unlinkSync(path.resolve(__dirname, '..', 'static', req.query[key]))
            }
        }
            return res.json(data)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async create(req, res, next) {
        try {
            let {
                name,
                price,
                count,
                brandId,
                typeId,
                info,
                color,
                percents,
                saleCount,
                condition,
                description,
                userId,
                file
            } = req.body
            let obj = {}
            JSON.parse(file).map((res, index) => {
                obj = {...obj, [`img${index}`]: res }
            })
            const device = await Device.create({
                name,
                price,
                count,
                brandId,
                typeId,
                color,
                percents,
                saleCount,
                condition,
                description,
                img: JSON.stringify(obj),
                userId
            });

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                )
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }
    async update(req, res, next) {
        try {
            const {id} = req.params

            let {
                name,
                price,
                count,
                brandId,
                typeId,
                info,
                color,
                percents,
                saleCount,
                condition,
                description,
                userId,
                file
            } = req.body
            let obj = {}
            JSON.parse(file).map((res, index) => {
                obj = {...obj, [`img${index}`]: res }

            })
            console.log(req.files)

            const device = await Device.update({
                name,
                price,
                count,
                brandId,
                typeId,
                color,
                percents,
                saleCount,
                condition,
                description,
                img: JSON.stringify(obj),
                // userId
            },{where: {id}});

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                )
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page, userId} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        let params
        if (brandId) {
            params = {brandId}
        }
        if (typeId) {
            params = {...params, typeId}
        }
        if (userId) {
            params = {...params, userId}
        }


        if (params) {
            devices = await Device.findAndCountAll({where: params, limit, offset})

        }else {
            devices = await Device.findAndCountAll({limit, offset})

        }

        return res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            },
        )
       const type = await Type.findOne( {where:  device.typeId,})
       const brand = await Brand.findOne( {where:  device.brandId,})
        const data = {...device.dataValues, type: type.dataValues , brand: brand.dataValues}
        return res.json(data)
    }
    async deleteDevice(req, res) {
        const {id} = req.query
        await Device.destroy(
            {
                where: {id},
            },
        )
        await BasketDevice.destroy(
            {
                where: {deviceId: id},
            },
        )
        await OrderDevice.destroy(
            {
                where: {deviceId: id},
            },
        )
        await DeviceInfo.destroy(
            {
                where: {deviceId: id},
            },
        )

        return res.json({id})
    }

}

module.exports = new DeviceController()