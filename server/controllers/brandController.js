const {Brand, TypeBrand, Device} = require('../models/models')
const ApiError = require('../error/ApiError');

class BrandController {
    async create(req, res) {
        const {name, typeId} = req.body
        const brand = await Brand.create({name, typeId })
        // console.log(brand.dataValues.id)
        // const type = await TypeBrand.create({name,})
        return res.json(brand)
    }

    async getAll(req, res) {
        let { typeId} = req.query
        let brands = []
        if ( typeId) {
           brands = await Brand.findAll({where:{typeId}})
        }
        return res.json(brands)
    }

}

module.exports = new BrandController()