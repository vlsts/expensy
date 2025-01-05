export default () => ({
  port: 80,
  db_url: `mongodb://${process.env.DB_HOST}/`,
  db_name: process.env.DB_NAME || 'expensy',
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD
});
