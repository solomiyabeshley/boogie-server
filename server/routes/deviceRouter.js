const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')

router.post('/', deviceController.create)
router.post('/files', deviceController.files)
router.delete('/files', deviceController.deleteFiles)
router.put('/:id', deviceController.update)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)
router.delete('/', deviceController.deleteDevice)

module.exports = router