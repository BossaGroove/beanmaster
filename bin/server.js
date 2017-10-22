'use strict';

const app_root = `${__dirname}/../`;

const config = require(`${app_root}/config`);

const lib = require(`${app_root}/lib`);

const port = 3000;

// Bootstrap application settings
lib.SharedManager.app = require(`${app_root}/app/setup/app`);

lib.SharedManager.app.listen(port);

console.log('Beanmaster listening port ' + port);
