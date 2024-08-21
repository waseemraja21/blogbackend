const {Router} = require('express');
const {registerUser, loginUser, getAuthors, getUser, changeAvatar, editUser} = require('../controllers/userControllers'); 
const authMiddleware = require('../middlewares/authMiddleware');
const router = Router();



//   api/users/...........

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUser);
router.patch('/edit-user',authMiddleware, editUser);
router.post('/change-avatar',authMiddleware, changeAvatar);
router.get('/', getAuthors);
















module.exports = router