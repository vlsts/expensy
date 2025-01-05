export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    db_url: process.env.DB_URL,
  });
  