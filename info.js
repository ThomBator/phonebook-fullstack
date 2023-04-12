const data = require("./db.json");

const options = {
  weekday: "short",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

const info = () => {
  const length = data.length;
  const now = new Date();
  const formatedDate = now.toLocaleDateString("en-us", options);
  const timezoneOffset = Math.abs(now.getTimezoneOffset() / 60);
  const timezoneOffsetString =
    "GMT 0" + `${timezoneOffset > 0 ? "-" : "+"}` + timezoneOffset + "00";

  const personsInfo = `
  <div>
  <p>Phonebook has info for ${length} people</p>
  <p>${formatedDate} ${timezoneOffsetString} (${
    Intl.DateTimeFormat().resolvedOptions().timeZone
  })</p>
  </div>
  `;
  return personsInfo;
};

module.exports = info;
