const express = require('express')
const router = express.Router()
const { getPriority, postPriority, deletePriority, postWishlist, getWishlist, deleteWishlist } = require('../controller/prioritas')
const validation = require('../middleware/validation')

router.get('/prioritas', getPriority)
router.post('/prioritas', postPriority)
router.delete('/prioritas/:needId', deletePriority)

router.get('/prioritas/wishlist', getWishlist)
router.post('/prioritas/wishlist', validation.balance , postWishlist)
router.delete('/prioritas/wishlist/:wantId', deleteWishlist)


module.exports = router