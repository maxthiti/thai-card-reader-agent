const { Service } = require('node-windows');
const path = require('path');

const service = new Service({
    name: 'Thai Card Reader Agent',
    script: path.join(__dirname, 'server.js'),
});

console.log('Service exists:', service.exists);
