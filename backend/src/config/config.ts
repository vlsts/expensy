export default () => ({
    port: 80,
    db_url: process.env.DB_HOST || 'mongodb://localhost:27017',
    db_name: process.env.DB_NAME || 'expensy',
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    CORBADO_API: process.env.CORBADO_API,
    FRONTEND_API: process.env.FRONTEND_API,
    PROJECT_ID: process.env.PROJECT_ID,
    BACKEND_API: process.env.BACKEND_API,
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    CORBADO_FRONTEND_URL: process.env.CORBADO_FRONTEND_URL,
});
