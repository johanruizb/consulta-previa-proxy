module.exports = {
    apps: [
        {
            name: "registro-consulta-previa",
            mode: "cluster",
            instances: "max",
            script: "./bin/www",
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
                "npm install && pm2 reload ecosystem.config.js --env production",
        },
    },
};
