const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/', orderController.create)
router.post('/status', orderController.changeStatusOrderDevice)
router.get('/', orderController.getAll)

module.exports = router