const fs = require('fs');
const path = require('path');

function firstCharToUpperCase(str) {
  return str[0].toUpperCase() + str.substring(1);
}

const [dir, moduleName, shortName, desc] = process.argv.slice(2, 6);

if (!dir) {
  console.log('请输入文件夹名称');
  process.exit();
}

if (!moduleName) {
  console.log('请输入模块名称');
  process.exit();
}

if (!shortName) {
  console.log('请输入表名前缀');
  process.exit();
}

if (!desc) {
  console.log('请输入模块描述');
  process.exit();
}

if (!fs.existsSync(path.resolve(__dirname, `../src/module/${dir}`))) {
  fs.mkdirSync(path.resolve(__dirname, `../src/module/${dir}`));
}

fs.mkdirSync(path.resolve(__dirname, `../src/module/${dir}/${moduleName}`));
fs.mkdirSync(
  path.resolve(__dirname, `../src/module/${dir}/${moduleName}/controller`)
);
fs.mkdirSync(
  path.resolve(__dirname, `../src/module/${dir}/${moduleName}/service`)
);
fs.mkdirSync(
  path.resolve(__dirname, `../src/module/${dir}/${moduleName}/entity`)
);
fs.mkdirSync(path.resolve(__dirname, `../src/module/${dir}/${moduleName}/dto`));
fs.mkdirSync(path.resolve(__dirname, `../src/module/${dir}/${moduleName}/vo`));

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

let pageDtoContent = fs
  .readFileSync(path.resolve(__dirname, './template/page-dto.template'))
  .toString();

let voContent = fs
  .readFileSync(path.resolve(__dirname, './template/vo.template'))
  .toString();

let pageVoContent = fs
  .readFileSync(path.resolve(__dirname, './template/page-vo.template'))
  .toString();

let name;
const filename = moduleName;
let varName = moduleName;
let tableName = moduleName;
const route = moduleName;

if (moduleName.includes('-')) {
  name = moduleName
    .split('-')
    .map(o => firstCharToUpperCase(o))
    .join('');

  varName = moduleName
    .split('-')
    .filter((_, index) => index > 0)
    .map(o => firstCharToUpperCase(o))
    .join('');
  varName = [moduleName.split('-')[0], varName].join('');

  tableName = moduleName.replace(/\./g, '_');
} else {
  name = moduleName[0].toUpperCase() + moduleName.substring(1);
}

controllerContent = controllerContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName)
  .replace(/\$4/g, route)
  .replace(/\$5/g, desc);

serviceContent = serviceContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName);

entityContent = entityContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName)
  .replace(/\$4/g, tableName)
  .replace(/\$5/g, shortName);

dtoContent = dtoContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName);

pageDtoContent = pageDtoContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName);

voContent = voContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName);

pageVoContent = pageVoContent
  .replace(/\$1/g, name)
  .replace(/\$2/g, filename)
  .replace(/\$3/g, varName);

fs.writeFileSync(
  path.resolve(
    __dirname,
    `../src/module/${dir}/${moduleName}/controller/${moduleName}.ts`
  ),
  controllerContent
);

fs.writeFileSync(
  path.resolve(
    __dirname,
    `../src/module/${dir}/${moduleName}/service/${moduleName}.ts`
  ),
  serviceContent
);

fs.writeFileSync(
  path.resolve(
    __dirname,
    `../src/module/${dir}/${moduleName}/entity/${moduleName}.ts`
  ),
  entityContent
);

fs.writeFileSync(
  path.resolve(
    __dirname,
    `../src/module/${dir}/${moduleName}/dto/${moduleName}.ts`
  ),
  dtoContent
);

fs.writeFileSync(
  path.resolve(
    __dirname,
    `../src/module/${dir}/${moduleName}/dto/${moduleName}-page.ts`
  ),
  pageDtoContent
);

fs.writeFileSync(
  path.resolve(
    __dirname,
    `../src/module/${dir}/${moduleName}/vo/${moduleName}.ts`
  ),
  voContent
);

fs.writeFileSync(
  path.resolve(
    __dirname,
    `../src/module/${dir}/${moduleName}/vo/${moduleName}-page.ts`
  ),
  pageVoContent
);
