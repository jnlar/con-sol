
# con-sol

JavaScript console app, for learning purposes. 💻

- Session based JavaScript sandbox environment, each client get's their own locked down `window` object. *Maybe* secure I guess, uses [vm2](https://github.com/patriksimek/vm2)
- [CodeMirror](https://github.com/codemirror/CodeMirror) is used for the console input, still kinda broken (history traversal etc) but it does work 🙂
- Auto indentation (thanks to CodeMirror) when inside some type of encapuslation (curlies, parens etc)

![con-sol](https://github.com/jnlar/con-sol/blob/main/img/screenshot.png?raw=true)

### Setup
You'll need to have [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/) setup on your machine.
```shell
# first build
docker-compose up -d --build

# every other build
dockercompose up -d
```

### s.t.a.c.k
- [node](https://github.com/nodejs/node)
- [nginx](https://www.nginx.com/)
- [docker/docker-compose](https://github.com/docker/compose)
- [react](https://github.com/facebook/react)
- [tailwindcss](https://github.com/tailwindlabs/tailwindcss)
- [mongodb](https://github.com/mongodb/node-mongodb-native)
