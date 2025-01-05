export default () => ({
  port: 80,
  db_url: process.env.DB_HOST || 'mongodb://localhost:27017',
  db_name: process.env.DB_NAME || 'expensy',
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD
});
