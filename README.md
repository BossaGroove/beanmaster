## Beanmaster

Nodejs [Beanstalkd](http://kr.github.io/beanstalkd/) admin console, inspired by [PHP version](https://github.com/ptrofimov/beanstalk_console) written by [ptrofimov](https://github.com/ptrofimov)

Rewritten in Nodejs with React and koa, with some improvements

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

### Development

#### Install the dependencies

```
yarn
```

#### Start koa server

```
yarn dev
```

#### Start webpack development server

```
yarn dev:browser
```

#### Build

```
yarn build
```

### Todo

- server: add ajv as request and respond validator
- add test

### Acknowledgement

Contributor: @adamliuxy

Original design: [ptrofimov](https://github.com/ptrofimov)
