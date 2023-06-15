const mysql = require('mysql2');

let count = 0;

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '12345678',
});

function connect() {
  connection.connect(error => {
    if (error) {
      console.log(`host: ${process.env.DB_HOST}`);
      console.log(`user: ${process.env.DB_USERNAME}`);
      console.log(`password: ${process.env.DB_PASSWORD}`);
      console.log('数据连接失败，正在重新连接');
      console.log(error);

      setTimeout(() => {
        if (count >= 60) {
          console.log('数据连接失败');
          return;
        }
        connect();
        count += 1;
      }, 1000);
      return;
    }
    connection.query(
      "SELECT * FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = 'fluxy-admin'",
      (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        if (result.length === 0) {
          console.log('检测到数据库不存在，正在为你创建数据库...');
          connection.query('CREATE DATABASE `fluxy-admin`');
        }
        connection.destroy();
        process.exit();
      }
    );
  });
}

connect();
