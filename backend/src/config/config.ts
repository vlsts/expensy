export default () => ({
  port: 80,
  db_url: `mongodb://${process.env.DB_HOST}/expensy`,
});
