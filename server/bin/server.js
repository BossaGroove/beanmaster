const appRoot = `${__dirname}/..`;

const lib = require(`${appRoot}/lib`);

const port = 3000;

// Bootstrap application settings
lib.SharedManager.app = require(`${appRoot}/setup/app`);

lib.SharedManager.app.listen(port);

console.log('Beanmaster listening port ' + port);
