const app_root = `${__dirname}/..`;

const lib = require(`${app_root}/lib`);

const port = 3000;

// Bootstrap application settings
lib.SharedManager.app = require(`${app_root}/setup/app`);

lib.SharedManager.app.listen(port);

console.log('Beanmaster listening port ' + port);
