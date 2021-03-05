interface UserPostingMock {
  start_data: Date

  /** Number of seconds */
  duration: number

  /** FLoat */
  value: number
  title: string,
  description: string
  subject: string
  author: string
}

export const userPostings: UserPostingMock[] = [
  {
    start_data: new Date(),
    duration: GetRandomInt(10000, 10000000),
    value: GetRandomInt(0, 50),
    title: 'Help me plz',
    description: 'i mean it, help meeeeee',
    subject: 'Quantum Entangled Blockchain NLP AI',
    author: 'Yiming'
    
  },  {
    start_data: new Date(),
    duration: GetRandomInt(10000, 10000000),
    value: GetRandomInt(0, 50),
    title: 'HELP 2 Title',
    description: 'HELP 2',
    subject: 'Subject 2',
    author: 'Bilal'
  },  {
    start_data: new Date(),
    duration: GetRandomInt(10000, 10000000),
    value: GetRandomInt(0, 50),
    title: 'HELP 3 Title',
    description: 'HELP 3',
    subject: 'aaaaaaaaaaaa',
    author: 'Raiyan'
  },  {
    start_data: new Date(),
    duration: GetRandomInt(10000, 10000000),
    value: GetRandomInt(0, 50),
    title: 'HELP 3 Title',
    description: 'HELP 3',
    subject: 'bbbbbbbbbbb',
    author: 'Eric'
  },  {
    start_data: new Date(),
    duration: GetRandomInt(10000, 10000000),
    value: GetRandomInt(0, 50),
    title: 'HELP 4 Title',
    description: 'HELP 4',
    subject: 'cccccccccccccc',
    author: 'Thierry'
  },  {
    start_data: new Date(),
    duration: GetRandomInt(10000, 10000000),
    value: GetRandomInt(0, 50),
    title: 'HELP 5 Title',
    description: 'HELP 5',
    subject: 'ddddddddddd',
    author: 'Vassos'
  },  {
    start_data: new Date(),
    duration: GetRandomInt(10000, 10000000),
    value: GetRandomInt(0, 50),
    title: 'HELP 5 Title '.repeat(100),
    description: 'HELP 5 '.repeat(1000),
    subject: 'ddddddddddd',
    author: 'P A N C E R'
  },
];

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 * @param min Smallest number possible
 * @param max Largest number possible
 * @returns A number between min and max (inclusive)
 */
export function GetRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
