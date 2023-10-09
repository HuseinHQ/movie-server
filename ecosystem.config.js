module.exports = {
  apps: [
    {
      name: "app1",
      script: "./app.js",
      env: {
        NODE_ENV: "production",
        PORT: 80,
        DATABASE_URL: "postgresql://postgres:jhhntuZYiNmi0wui@db.hpcayumwifnnltrpqpyq.supabase.co:5432/postgres",
        SECRET_KEY: "ThisIsMyAppSecretKey@463128",
        GOOGLE_CLIENT_ID: "782243135980-7dfmhrfqah531g5ob5u200trjrkl0ah2.apps.googleusercontent.com",
      },
    },
  ],
};

