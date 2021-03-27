//
// A collection of shared resources.
//

/** Maximum dollar value (CAD) a user posting may have. */
export const MAX_USER_POSTING_MONETARY_VALUE: number = 50;

/** Minimum dollar value (CAD) a user posting may have.
 * 0 => volunteer
 */
export const MIN_USER_POSTING_MONETARY_VALUE: number = 0;

/** Maximum length of user posting title. */
export const MAX_USER_POSTING_TITLE_LENGTH: number = 200;

/** Maximum length of user posting description. */
export const MAX_USER_POSTING_DESCRIPTION_LENGTH: number = 5000;

/** Maximum size of message a user can send in a meeting. */
export const MAX_USER_MESSAGE_LENGTH: number = 2000;

/** Possible categories a posting may have. */
export const ALLOWED_USER_POSTING_CATEGORIES: string[] = [
  'Arts & Literature',
  'Computer Science',
  'Humanities',
  'Life Sciences',
  'Physical and Mathematical Sciences',
  'Social Sciences',
  'Other'
];

/** Allowed meeting durations. */
export const ALLOWED_MEETING_DURATIONS: string[] = [
  '30 min.',
  '1 hour',
  '2 hours',
  '3 hours',
  '4 hours',
  '5 hours',
  '6 hours'
];


/** Possible sort options. */
export const SORT_OPTIONS: string[] = [
  'Recent',
  'Oldest First',
  'Price: Low to High',
  'Price: High to Low'
];

export const isDevelopmentEnv = process.env.NODE_ENV === 'development';
