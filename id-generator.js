const data = require("./db.json");
const idGenerator = () => {
  const maxId =
    data.length > 0 ? Math.max(...data.map((person) => person.id)) : 0;

  return maxId + 1;
};

module.exports = idGenerator;
