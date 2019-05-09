import { toCamelCase } from '../array-utils';

test('toCamelCase transforms keys of every object in array to camelCase', () => {
  const arr = [
    {
      id: 1,
      user_id: 1
    }
  ];

  expect(toCamelCase(arr)).toEqual([
    {
      id: 1,
      userId: 1
    }
  ]);
});
