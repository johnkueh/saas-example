import { getItem, setItem } from '../local-storage';

it('able to set booleans', () => {
  setItem('testkey', false);
  expect(getItem('testkey')).toBe(false);
});

it('able to set strings', () => {
  setItem('testkey', 'testval');
  expect(getItem('testkey')).toBe('testval');
});

it('able to set integers', () => {
  setItem('testkey', 1);
  expect(getItem('testkey')).toBe(1);
});

it('able to set objects', () => {
  setItem('testkey', { email: 'userjohn@test.com' });
  expect(getItem('testkey')).toEqual({ email: 'userjohn@test.com' });
});
