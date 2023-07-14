export const memberVisibility: ReadonlyMap<number | undefined, string> =
  new Map([
    [undefined, '+'],
    [0, '-'],
    [1, '#'],
    [2, '+'],
  ]);
