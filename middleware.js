const fs = require("fs");

function readList() {
  const listStr = fs.readFileSync("list.json", "utf8", function (err, data) {
    if (err) {
      console.log(err);
    }
  });
  let listObj = JSON.parse(listStr);
  return listObj;
}

function writeList(obj) {
  let json = JSON.stringify(obj);
  fs.writeFile("list.json", json, "utf8", function (err) {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = { readList, writeList };
