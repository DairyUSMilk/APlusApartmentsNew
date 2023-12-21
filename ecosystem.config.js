export default {
  apps: [
    {
      name: "apollo-server",
      script: "server.js",
    },
    {
      name: "redis",
      script: "redis-server",
      args: "/etc/redis/redis.conf",
    },
  ],
};
