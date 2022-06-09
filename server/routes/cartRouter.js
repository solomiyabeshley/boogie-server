const Router = require('express')
const router = new Router()
const cartController = require('../controllers/cartController')

router.post('/', cartController.create)
router.get('/', cartController.getAll)
router.delete('/', cartController.deleteDevice)
router.put('/edit', cartController.changeCount)

module.exports = router