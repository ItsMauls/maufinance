const express = require('express')
const router = express.Router()
const { getPriority, postPriority, postWants, deletePriority } = require('../controller/prioritas')

router.get('/prioritas', getPriority)
router.post('/prioritas', postPriority)
router.post('/prioritas/wants', postWants)
router.delete('/prioritas/:prioId', deletePriority)

module.exports = router