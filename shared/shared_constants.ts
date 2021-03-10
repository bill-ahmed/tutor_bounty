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
