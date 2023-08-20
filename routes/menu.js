const express = require('express')
const { getDashboard, getManage, postBalance } = require('../controller/menu')
const router = express.Router()

router.get('/dashboard', getDashboard)
router.get('/manage', getManage)
router.post('/manage/:updateBalance', postBalance)

module.exports = router