const { Service } = require('node-windows');
const path = require('path');

const service = new Service({
    name: 'Thai Card Reader Agent',
    script: path.join(__dirname, 'server.js'),
});

service.on('uninstall', () => {
    console.log('Service uninstalled successfully.');
    console.log('Exists after uninstall:', service.exists);
});

service.on('error', (err) => {
    console.error('Service uninstall error:', err);
});

service.uninstall();
