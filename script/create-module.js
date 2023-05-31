const fs = require('fs');
const path = require('path');

if (process.argv.length > 3) {
  console.log('只能有一个参数');
  process.exit();
}

function firstCharToUpperCase(str) {
  return str[0].toUpperCase() + str.substring(1);
}

const moduleName = process.argv.pop();

if (!fs.existsSync(path.resolve(__dirname, '../src/module'))) {
  fs.mkdirSync(path.resolve(__dirname, '../src/module'));
}

fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}`));
fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}/controller`));
fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}/service`));
fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}/entity`));
fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}/dto`));
fs.mkdirSync(path.resolve(__dirname, `../src/module/${moduleName}/vo`));

let controllerContent = fs
  .readFileSync(path.resolve(__dirname, './template/controller.template'))
  .toString();

let serviceContent = fs
  .readFileSync(path.resolve(__dirname, './template/service.template'))
  .toString();

let entityContent = fs
  .readFileSync(path.resolve(__dirname, './template/entity.template'))
  .toString();

let dtoContent = fs
  .readFileSync(path.resolve(__dirname, './template/dto.template'))
  .toString();

let voContent = fs
  .readFileSync(path.resolve(__dirname, './template/vo.template'))
  .toString();

let name;
const filename = moduleName;
let varName = moduleName;
let tableName = moduleName;
let route = moduleName;

if (moduleName.includes('.')) {
  name = moduleName
    .split('.')
    .map(o => firstCharToUpperCase(o))
    .join('');

  varName = moduleName
    .split('.')
    .filter((_, index) => index > 0)
    .map(o => firstCharToUpperCase(o))
    .join('');
  varName = [moduleName.split('.')[0], varName].join('');

  tableName = moduleName.replace(/\./g, '_');
  route = moduleName.replace(/\./g, '-');
} else {
  name = moduleName[0].toUpperCase() + moduleName.substring(1);
}

controllerContent = controllerContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName)
  .replace(/\$5/g, route);

serviceContent = serviceContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName);

entityContent = entityContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName)
  .replace(/\$4/g, tableName);

dtoContent = dtoContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName);

voContent = voContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName);

fs.writeFileSync(
  path.resolve(
    __dirname,
    `../src/module/${moduleName}/controller/${moduleName}.ts`
  ),
  controllerContent
);

fs.writeFileSync(
  path.resolve(
    __dirname,
    `../src/module/${moduleName}/service/${moduleName}.ts`
  ),
  serviceContent
);

fs.writeFileSync(
  path.resolve(
    __dirname,
    `../src/module/${moduleName}/entity/${moduleName}.ts`
  ),
  entityContent
);

fs.writeFileSync(
  path.resolve(__dirname, `../src/module/${moduleName}/dto/${moduleName}.ts`),
  dtoContent
);

fs.writeFileSync(
  path.resolve(__dirname, `../src/module/${moduleName}/vo/${moduleName}.ts`),
  voContent
);
