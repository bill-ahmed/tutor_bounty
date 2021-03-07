export const isProdEnv = () => { return process.env.NODE_ENV === 'production' }

export const applicationRoot = () => {
  return isProdEnv() ? '/' : 'http://127.0.0.1:8081/#/';
}

/** Generate random string of given length with allowed chars.
 * Taken from: https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
 */
export function GenerateRandomString(length: number, chars: string) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}