'use strict';

require('babel-register')({
  presets: ['es2015', 'react']
});

const Hapi = require('hapi');
const HapiSass = require('hapi-sass');
const Inert = require('inert');
const Vision = require('vision');
const HapiReactViews = require('hapi-react-views');

const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

const hapiSassOptions = {
  src: './src',
  dest: './build/css',
  force: true,
  debug: true,
  routePath: '/css/{file}.css',
  outputStyle: 'nested',
  sourceComments: true,
  srcExtension: 'scss',
};

server.register([Inert, {
  register: HapiSass,
  options: hapiSassOptions
}]);


server.register(Vision, (err) => {
  if (err) {
    console.log('Failed to load vision');
  }

  server.views({
    engines: {
      jsx: HapiReactViews,
    },
    compileOptions: {},
    relativeTo: __dirname,
    path: 'src'
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'build',
        index: ['index.html']
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/app/{param*}',
    handler: function(request, reply) {
      reply.view('AppWrapper', request.query);
    }
  });

  server.start((err) => {
    if (err) {
      throw err;
    }

    console.log('Server running at: ', server.info.uri);
  });
});
