const mysql = require('mysql2');

let count = 0;

function connect() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '12345678',
  });
  connection.connect(error => {
    if (error) {
      console.log(`host: ${process.env.DB_HOST}`);
      console.log(`user: ${process.env.DB_USERNAME}`);
      console.log(`password: ${process.env.DB_PASSWORD}`);
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
      `SELECT * FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = '${
        process.env.DB_PASSWORD || 'fluxy-admin'
      }'`,
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        if (result.length === 0) {
          console.log('检测到数据库不存在，正在为你创建数据库...');
          connection.query('CREATE DATABASE `fluxy-admin`', () => {
            console.log('数据库创建成功');
            connection.destroy();
            process.exit();
          });
        } else {
          connection.destroy();
          process.exit();
        }
      }
    );
  });
}

connect();
