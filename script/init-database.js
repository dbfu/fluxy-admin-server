const mysql = require('mysql2');

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
    console.log('数据连接失败');
    console.log(error);
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
