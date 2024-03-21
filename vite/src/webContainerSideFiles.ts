import { FileSystemTree } from "@webcontainer/api";

export const files:FileSystemTree = {
  'index.js': {
    file: {
      contents: `
import Fastify from 'fastify';
const fastify = Fastify({
  logger: true
});
      
fastify.get('/', async (request, reply) => {
  return 'Welcome to a WebContainers app! 🥳';
});
      
const start = async () => {
  try {
    await fastify.listen({ port: 3111 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start();
`,
    },
  },
  'package.json': {
    file: {
      contents: `
{
  "name": "example-app",
  "type": "module",
  "dependencies": {
    "fastify": "latest",
    "nodemon": "latest"
  },
  "scripts": {
    "start": "nodemon index.js"
  }
}`,
    },
  },
};