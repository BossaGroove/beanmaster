## Beanmaster

Nodejs Beanstalkd admin console, inspired by [PHP version](https://github.com/ptrofimov/beanstalk_console) written by [ptrofimov](https://github.com/ptrofimov)

Rewritten in Nodejs with ExpressJS, with some improvements

### Installation

```
npm install -g beanmaster
```

### Usage

```
beanmaster
```

And the server will start running and listening 3000 by default

Use `-p` or `--port` to specify port number:

```
beanmaster -p 4000
```


### Todo / Known issue

1. Pause auto update
2. Disconnect beanstalkd connection
3. Replace connect.session() MemoryStore
4. Multiple viewer may cause unexpected result as several actions require async operation.
  a. User 1 tries to add a new job to tube A
  b. The connection used tube A
  c. Before connection put the job to the tube A, User 2 tries to add a new job to tube B
  d. The connection used tube B
  e. User 1's job added to tube B

  This may be solved by initiating connections for each users

### Acknowledgement

Original design: [ptrofimov](https://github.com/ptrofimov)