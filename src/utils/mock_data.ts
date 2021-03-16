interface UserPostingMock {
  uid: string,
  start_data: Date

  /** Duration */
  duration: string

  /** FLoat */
  value: number
  title: string,
  description: string
  category: string
  author: string
}

export const userPostings: UserPostingMock[] = [
  {
    uid: 'e0d123e5f316bef78bfdf5a008837577',
    start_data: new Date(),
    duration: '2 Hours',
    value: GetRandomInt(0, 50),
    title: 'Help me plz',
    description: 'i mean it, help meeeeee',
    category: 'Quantum Entangled Blockchain NLP AI',
    author: 'Yiming'
    
  },  {
    uid: '35d91262b3c3ec8841b54169588c97f7',
    start_data: new Date(),
    duration: '1 Hour',
    value: GetRandomInt(0, 50),
    title: 'HELP 2 Title',
    description: 'HELP 2',
    category: 'Subject 2',
    author: 'Bilal'
  },  {
    uid: 'cc273fe9d442850fa18c31c88c823e07',
    start_data: new Date(),
    duration: '3 Hours',
    value: GetRandomInt(0, 50),
    title: 'HELP 3 Title',
    description: 'HELP 3',
    category: 'aaaaaaaaaaaa',
    author: 'Raiyan'
  },  {
    uid: 'ff6626c69507a6f511cc398998905670',
    start_data: new Date(),
    duration: '30 Mins',
    value: GetRandomInt(0, 50),
    title: 'HELP 3 Title',
    description: 'HELP 3',
    category: 'bbbbbbbbbbb',
    author: 'Eric'
  },  {
    uid: 'ce099d7e208dc921e259b48aadef36c1',
    start_data: new Date(),
    duration: '2 Hours',
    value: GetRandomInt(0, 50),
    title: 'HELP 4 Title',
    description: 'HELP 4',
    category: 'cccccccccccccc',
    author: 'Thierry'
  },  {
    uid: '4fb319211b2e85cace04e8936100f024',
    start_data: new Date(),
    duration: '2 Hours',
    value: GetRandomInt(0, 50),
    title: 'HELP 5 Title',
    description: 'HELP 5',
    category: 'ddddddddddd',
    author: 'Vassos'
  },  {
    uid: '66bd00e43ff8b932c14140472c4b8cc6',
    start_data: new Date(),
    duration: '1 Hour',
    value: GetRandomInt(0, 50),
    title: 'HELP 5 Title '.repeat(100),
    description: 'HELP 5 '.repeat(1000),
    category: 'ddddddddddd',
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
