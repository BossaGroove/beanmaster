const router = require('koa-router')();
const Controller = require('../controller');

router.get('/api/servers', Controller.Server.index);
router.get('/api/servers/info', Controller.Server.getInfo);
router.post('/api/servers', Controller.Server.addServer);
router.delete('/api/servers', Controller.Server.deleteServer);

router.get('*', Controller.Home.index);

module.exports = router;