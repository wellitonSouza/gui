-- cool middleware name here -- Graphical Management Interface
==============================================================

This package implements a WEB user interface for the management and configuration of the
middleware's basic functionality.


# Build

To generate a production-ready version of the interface, run the commands below.

```shell
npm install
bower install
npm run build
```

# Development

To setup a development server environment, run the commands below.

```shell
npm install
bower install
npm run watch
```

# Docker

From a clean environment, the following commands create a new docker image capable of serving
the user interface.

```shell
npm install
bower install
npm run build
docker build -f docker/Dockerfile -t [tag name] .
```

To run the created image:

```shell
docker run -d [-n name] <tag name>
```
