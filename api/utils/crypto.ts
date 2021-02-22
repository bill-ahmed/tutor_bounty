import crypto from 'crypto';

/**
 * Hash and salt given string.
 */
export function hashAndSalt(str)
{
    let hsh = crypto.createHmac('sha512', process.env.SALT);
    hsh.update(str);

    return hsh.digest('base64');
}

/**
 * Check if str has hash & salt of hash
 */
export function isEqual(str, expected_hash): boolean
{
    let actual_hash = hashAndSalt(str);
    return expected_hash === actual_hash;
}