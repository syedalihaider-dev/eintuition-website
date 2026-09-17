module.exports = {
  apps: [
    {
      name: "eintuition",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        // cPanel/Node often injects PORT; fallback if not set
        PORT: process.env.PORT || 3000,
      },
    },
  ],
};
