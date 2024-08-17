module.exports = {
    apps: [
        {
            name: "app",
            mode: "cluster",
            instances: "max",
            script: "./bin/www",
            autorestart: true,
            env_production: {
                NODE_ENV: "production",
                PORT: 3000,
            },
        },
    ],

    deploy: {
        production: {
            user: "ubuntu",
            host: "172.24.144.93",
            ref: "origin/master",
            repo: "git@github.com:johanruizb/consulta-previa-proxy.git",
            path: "/home/ubuntu/registro-consulta-previa",
            "post-deploy":
                "export PATH=/home/ubuntu/.nvm/versions/node/v20.16.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin && npm install && pm2 reload ecosystem.config.js --env production",
        },
    },
};
