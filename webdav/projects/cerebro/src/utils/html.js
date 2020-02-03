export default (str, ...args) =>
  str
    .map((e, i) => [e, args[i]])
    .flat()
    .join("");