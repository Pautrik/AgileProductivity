const dayDistance = (firstDate, secondDate) => Math.round(Math.abs(firstDate - secondDate) / (1000 * 60 * 60 * 24));
const stringToDate = (str) => new Date(`${str.substr(0, 4)}-${str.substr(4, 2)}-${str.substr(6, 2)}`);
const dateToString = (date) => date.toISOString().substr(0, 10).replace(/-/g, "");
const copyDate = date => new Date(date.getTime());
const isEqualDates = (firstDate, secondDate) => dateToString(firstDate) === dateToString(secondDate);

export { dayDistance, stringToDate, dateToString, copyDate, isEqualDates }