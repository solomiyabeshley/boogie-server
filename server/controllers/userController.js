const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, role, firstname, surname} = req.body

        if (!email || !password) {
            return next(ApiError.badRequest('Неправильний email або password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Користувач з таким email вже існує!'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, password: hashPassword, firstname, surname})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token , user})
    }
// dsadasd
    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})

        if (!user) {
            return next(ApiError.internal('Користувача не знайдено!'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('Вказано невірний пароль!'))
        }
        const basket = await Basket.findOne({where: {userId: user.id }})
        const data = {user: user, basketId: basket.id}
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token, data})
    }

    async check(req, res, next) {
        const {email} = req.user
        const user = await User.findOne({where: {email}})
        const basket = await Basket.findOne({where: {userId: user.id }})
        const data = {user: user, basketId: basket.id}

        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token, data})
    }
    async editUser(req, res) {
        const {email , id, firstname, surname, phone} = req.body.obj
        const user = await User.update(  { email, firstname, surname, phone },
            { where: { id } })
    }
}

module.exports = new UserController()