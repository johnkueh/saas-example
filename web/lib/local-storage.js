// localStorage stores only strings
export const setItem = (key, val) => localStorage.setItem(key, JSON.stringify(val));
export const getItem = key => JSON.parse(localStorage.getItem(key));

export default {
  setItem,
  getItem
};
