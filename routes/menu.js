const express = require('express')
const { getDashboard, postBalance, updateBalance } = require('../controller/menu')
const validation = require('../middleware/validation')
const router = express.Router()

router.get('/dashboard', getDashboard)
router.post('/dashboard', validation.balance, postBalance)
router.put('/dashboard/:dashID', updateBalance)

module.exports = router