const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Code for the master process

    console.log(`Master ${process.pid} is running`);

    // Fork worker processes
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online.`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code ${code}, restarting...`);
        cluster.fork();
    });
} else {
    // Code for the worker process

    console.log(`Worker ${process.pid} started`);

    // Import your Express.js app
    const app = require('./app');

    // Start the server
    const port = process.env.PORT || 3060;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
