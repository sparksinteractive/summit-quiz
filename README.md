# Summit Quiz

Repo for Sparks Summit Quiz

Contains:
* `server.js` (handles web server and websockets)
* `auth.js`   (handles google oauth logic)
* `redis.js`  (handles redis logic)
* `dist/`     (contains static files)

TODO:
* redis storage with persistence
* Mobile UI
* Jumbotron UI
* Quiz


### Usage:

**Docker:**

```sh
docker-compose up --build
```

**Vanilla Node:**

(pre-req `redis`)
```
brew install redis
```

install dependencies:
```sh
npm i
```

build static files:
```sh
gulp
```

serve:
```sh
node server.js
```
