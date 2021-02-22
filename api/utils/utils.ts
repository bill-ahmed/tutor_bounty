export const isProdEnv = () => { return process.env.NODE_ENV === 'production' }

export const applicationRoot = () => {
  return isProdEnv() ? '/' : 'http://127.0.0.1:8081';
}