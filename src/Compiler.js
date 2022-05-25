// import { CodeContext } from './contexts/CodeContext';
const { exec, spawn } = require("child_process");
const fs = require('fs');
const { useContext } = require("react");

export const RunCPP = (code, stdin, flags) => {
  console.log("started");
  let dir_path = './temp/' + Date.now();
  return fs.mkdir(dir_path, { recursive: true }, err => {
    console.log("mkdir", err);
    return fs.writeFile(dir_path + '/main.cpp', code, err => {
      console.log("write", err);
      return exec("g++ " + flags + ' ' + dir_path + "/main.cpp -o " + dir_path + "/a", flags, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
        }
        const child = spawn(dir_path + "/a"); //where a is the exe file generated on compiling the code.
        child.stdin.write(stdin);
        child.stdin.end();
        return child.stdout.on("data", (data) => {
          console.log(`child stdout:\n${data}`);
          return {
            stderr: stderr,
            stdout: data
          };
        });
      });  
    })
  });
};
