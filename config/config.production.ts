// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (): Record<string, any> => {
  const configuration =  {
    port: 3000,
    database: {
      host: 'www.production.com',
      port: 5432
    }
  };
  return configuration;
};