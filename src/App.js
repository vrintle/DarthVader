import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewCode from "./pages/NewCode";
import GetCode from "./pages/GetCode";
import { CodeContext } from './contexts/CodeContext';
import { useState } from 'react';

function App() {
  const langs = {
      54: 'cpp'
  };
  const [stdin, setStdin] = useState('');
  const [stdout, setStdout] = useState('Hello World');
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
  cout << "Hello World !!";
}`);
  const [stderr, setStderr] = useState('');
  const [flags, setFlags] = useState('-std=c++17 -Wall');
  const [stdinActive, setStdinActive] = useState(true);
  const [langId, setLangId] = useState(54);
  let [stdoutActive, setStdoutActive] = useState(true);
  let activeGreen = "#86c232";
  let inactiveGreen = "#61892f";

  return (
    <div className="App">
      <CodeContext.Provider value={{ langs, stdin, setStdin, stdout, setStdout, code, setCode, stderr, setStderr, flags, setFlags, stdinActive, setStdinActive, langId, setLangId, stdoutActive, setStdoutActive, activeGreen, inactiveGreen }}>
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={ <NewCode /> }></Route>
            <Route path='/:id' element={ <GetCode /> }></Route>
          </Routes>
        </BrowserRouter>
      </CodeContext.Provider>
    </div>
  );
}

export default App;
