// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotRouter = require('./spot.js');
const reviewRouter = require('./review.js')
const { restoreUser } = require('../../utils/auth.js');





router.use(restoreUser);
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotRouter);
router.use('/reviews', reviewRouter);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
  });




module.exports = router;