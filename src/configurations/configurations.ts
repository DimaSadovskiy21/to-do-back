const configurations = () => ({
  port: process.env.PORT,
  host: process.env.DB_HOST,
  secret_jwt_access: process.env.JWT_ACCESS_SECRET_TOKEN,
  expire_jwt_access: process.env.EXPIRE_JWT_ACCESS_TOKEN,
  secret_jwt_refresh: process.env.JWT_REFRESH_SECRET_TOKEN,
  expire_jwt_refresh: process.env.EXPIRE_JWT_REFRESH_TOKEN,
  api_url: process.env.API_URL,
  client_url: process.env.CLIENT_URL,
});

export default configurations;
