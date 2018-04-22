const router = require('koa-router')();
const Controller = require('../controller');

router.get('/api/servers', Controller.Server.index);
router.get('/api/servers/info', Controller.Server.getInfo);
router.get('/api/servers/tubes', Controller.Server.getTubes);
router.post('/api/servers/search', Controller.Server.search);
router.post('/api/servers/kick', Controller.Server.kick);
router.post('/api/servers', Controller.Server.addServer);
router.del('/api/servers', Controller.Server.deleteServer);

router.get('*', Controller.Home.index);

module.exports = router;