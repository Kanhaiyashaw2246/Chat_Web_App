const express = require('express');
const { registerUser, authUser, allUser } = require('../controller/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser).get(protect,allUser);
router.post('/login',authUser);


module.exports = router;