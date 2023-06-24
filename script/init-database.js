const mysql = require('mysql2');

let count = 0;

function connect() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME || 'fluxy-admin';

  const connection = mysql.createConnection({
    host,
    user,
    password,
  });
  connection.connect(error => {
    if (error) {
      console.log(`host: ${host}`);
      console.log(`user: ${user}`);
      console.log(`password: ${password}`);
      console.log('数据库连接失败，正在重新连接');
      console.log(error);

      setTimeout(() => {
        if (count >= 60) {
          console.log('数据库连接失败，请检查数据库服务是否正常启动。');
          return;
        }
        connect();
        count += 1;
      }, 1000);
      return;
    }
    connection.query(
      `SELECT * FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = '${database}'`,
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        if (result.length === 0) {
          console.log('检测到数据库不存在，正在为你创建数据库...');
          connection.query(`CREATE DATABASE \`${database}\``, () => {
            console.log('数据库创建成功');
            process.exit();
          });
        } else {
          process.exit();
        }
      }
    );
    connection.end();
  });
}

connect();
