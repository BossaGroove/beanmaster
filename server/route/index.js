const router = require('koa-router')();
const Controller = require('../controller');


router.get('/', Controller.Home.index);

module.exports = router;