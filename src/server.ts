import config from './config/config';

import app from './app';

const server = app.listen(config.PORT);

(async () => {
    try {
        console.log(`Application started on port ${config.PORT}`);
        console.log(`Server URL: ${config.SERVER_URL}`);
    } catch (error) {
        console.error('Application error:', error);

        server.close((error) => {
            if (error) {
                console.error('Error while closing server:', error);
            }

            process.exit(1);
        });
    }
})();

