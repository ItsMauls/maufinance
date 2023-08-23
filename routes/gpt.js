const express = require('express')
const { getGPT, chatWithGPT, postGpt } = require('../controller/jipiti')
const router = express.Router()

router.get('/konsultasi',chatWithGPT)

router.post('/konsultasi',postGpt)

module.exports = router