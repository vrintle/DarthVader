// import { CodeContext } from './contexts/CodeContext';
const { exec, spawn } = require("child_process");
const fs = require('fs');
const bodyParser = require("body-parser");
const http = require('http');
const express = require('express');
// const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// To create REST API
app.use('/', (req, resp, next) => {
  resp.header('Access-Control-Allow-Credentials', true);
  resp.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  resp.header('Access-Control-Allow-Headers', 'Content-Type, GET, POST, OPTIONS');
  next();
});

app.post('/run-cpp', async (req, resp) => {
  const { code, stdin, flags } = req.body;
  console.log("data:", stdin, code, flags);
  let dir_path = './temp/' + Date.now();
  fs.mkdir(dir_path, { recursive: true }, err => {
    console.log("mkdir", err);
    fs.writeFile(dir_path + '/main.cpp', code, err => {
      console.log("write", err);
      exec("g++ " + flags + ' ' + dir_path + "/main.cpp -o " + dir_path + "/a", flags, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          console.log(`stderr: ${stderr}`);
          resp.send({
            status: 404,
            stderr: stderr,
            stdout: ''
          });
          fs.rmSync(dir_path, { recursive: true, force: true });
        } else {
          const child = spawn(dir_path + "/a"); //where a is the exe file generated on compiling the code.
          child.stdin.write(stdin);
          child.stdin.end();
          child.stdout.on("data", (data) => {
            console.log(`child stdout:\n${data}`);
            resp.send({
              status: 200,
              stderr: stderr,
              stdout: data.toString(),
              err: null
            });
            fs.rmSync(dir_path, { recursive: true, force: true });
          });
        }
      });  
    });
  });
});

app.get('*', (req, resp) => resp.sendStatus(404));
let listener = app.listen(8000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
process.on("uncaughtException", console.log);
