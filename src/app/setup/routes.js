'use strict';

const root = require('app-root-path');
const router = require('express').Router();

const Controller = require(`${root}/app/controllers`);

router.get('/', Controller.Home.action('index'));
router.get('/server/info', Controller.Home.action('getInfo'));
router.post('/server/add', Controller.Home.action('addServer'));
router.post('/server/delete', Controller.Home.action('deleteServer'));

router.get('/:host_port', Controller.Server.action('index'));
router.get('/:host_port/refresh', Controller.Server.action('refreshTubes'));
router.post('/:host_port/search-job', Controller.Server.action('searchJob'));
router.post('/:host_port/kick-job-id', Controller.Server.action('kickJobId'));

router.get('/:host_port/:tube', Controller.Tube.action('index'));
router.get('/:host_port/:tube/refresh', Controller.Tube.action('refreshTube'));
router.post('/:host_port/:tube/add-job', Controller.Tube.action('addJob'));
router.post('/:host_port/:tube/kick-job', Controller.Tube.action('kickJob'));
router.post('/:host_port/:tube/delete-job', Controller.Tube.action('deleteJob'));
router.post('/:host_port/:tube/toggle-pause', Controller.Tube.action('togglePause'));

// router.all('*', Controller.Common.action('notFound'));

module.exports = router;
