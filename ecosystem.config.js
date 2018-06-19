module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [{
        name: 'app',
        script: 'app.js',
        env: {
            COMMON_VARIABLE: 'true'
        },
        env_production: {
            NODE_ENV: 'production'
        }
    }]
};