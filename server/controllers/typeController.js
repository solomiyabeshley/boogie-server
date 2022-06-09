const {Type} = require('../models/models')
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");

class TypeController {
    async create(req, res) {
        const {name} = req.body
        const type = await Type.create({name})
        return res.json(type)
    }

    async getAll(req, res) {
        let {limit, icon} = req.query
        let options = {limit}
        if (icon) {
            options = {where: {
                    icon: {
                        [Op.ne]: null
                    }
                }, limit}
        }
        const types = await Type.findAll(options)
        return res.json(types)
    }

}

module.exports = new TypeController()