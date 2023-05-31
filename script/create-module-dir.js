const fs = require('fs');
const path = require('path');

if (process.argv.length > 3) {
  console.log('只能有一个参数');
  process.exit();
}

const moduleName = process.argv.pop();

fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}`));
fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}/controller`));
fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}/service`));
fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}/entity`));
fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}/dto`));
fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}/vo`));
