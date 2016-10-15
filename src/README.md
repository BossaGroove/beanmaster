## Beanmaster

Nodejs [Beanstalkd](http://kr.github.io/beanstalkd/) admin console, inspired by [PHP version](https://github.com/ptrofimov/beanstalk_console) written by [ptrofimov](https://github.com/ptrofimov)

Rewritten in Nodejs with ExpressJS, with some improvements

*Start from 2.0.0 the module requires ES6 which only supported from node version 4 and above, please use 1.x (Deprecated) if needed*

### Installation

```
npm install -g beanmaster
```

### Usage

You can simply start the server and listening 3000 with:

```
beanmaster
```

Use `-p` or `--port` to specify port number:

```
beanmaster -p 4000
```

### Daemonizing

You may start as daemon server:

```
beanmaster start
```

Start with port number (`-p` or `--port`):

```
beanmaster start --port 5000
```

Stop the server daemon:

```
beanmaster stop
```

Restart the server daemon:

```
beanmaster restart
```

See all options:

```
beanmaster --help
```

### Todo / Known issue

1. Disconnect beanstalkd connection
2. Multiple viewer may cause unexpected result as several actions require async operation.

### Change Logs

Please refer to CHANGELOG.md

### Acknowledgement

Contributor: @adamliuxy

Original design: [ptrofimov](https://github.com/ptrofimov)
