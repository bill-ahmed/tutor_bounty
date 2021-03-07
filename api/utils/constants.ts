// Validations
export const MIN_PASSWORD_LENGTH = 6;

export const MIN_USERNAME_LENGTH = 8;
export const MAX_USERNAME_LENGTH = 32;
export const USERNAME_REGEX = /^\w+$/;

export const MAX_NAME_LENGTH = 64;

// Cookies

/** Time limit for express sessions in seconds (7 days). */
export const SESSION_NAME = 'tutor_bounty.sid';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;