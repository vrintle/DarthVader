import Editor, { useMonaco } from "@monaco-editor/react";
import '../App.css';
import { useContext, useEffect, useState } from 'react';
import { CodeContext } from '../contexts/CodeContext';

function NewCode() {
    let { langs, stdin, setStdin, stdout, setStdout, code, setCode, stderr, setStderr, flags, setFlags, stdinActive, setStdinActive, langId, setLangId, stdoutActive, setStdoutActive, activeGreen, inactiveGreen } = useContext(CodeContext);
    const monaco = useMonaco();
    let [editor, setEditor] = useState(null);

    useEffect(() => {
        if (editor && monaco)
            addCmd();
    }, [monaco]);

    useEffect(() => {
        if (editor && monaco)
            addCmd();
    }, [editor]);

    useEffect(() => {
        console.log(code);
    }, [code])

    useEffect(() => {
        let handleShortcutKeys = evt => {
            if(evt.ctrlKey) {
                if(evt.key == 'Enter') {
                    // evt.preventDefault();
                    runCode();
                } else if(evt.key == 'Shift') {
                    stdoutActive = !stdoutActive;
                    setStdoutActive(stdoutActive);
                }
            }
        };
        window.addEventListener("keyup", handleShortcutKeys);
        return () => {
            window.removeEventListener("keyup", handleShortcutKeys);
        }
    }, [])

    const runCode = () => {
        let data = {
            code: code,
            stdin: stdin,
            flags: flags
        };
        console.log(data);
        fetch('http://localhost:8000/run-cpp', {
            method: 'post',
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        })
        .then(res => res.json())
        .then(resp => {
            console.log(resp)
            if(resp.status == 200) {
                console.log('Successfully Ran.', resp);
                setStderr(resp.stderr);
                setStdout(resp.stdout);
            } else {
                console.log('Error while running !!', resp.stderr);
                setStderr(resp.stderr);
                setStdout(resp.stdout)
            }
        });
    };

    const addCmd = () => {
        editor.addCommand(
            monaco.KeyMod.CtrlCmd + monaco.KeyCode.Enter,
            function() {
                console.log('Ctrl + Enter = Run Code is executing!');
            }
        )
        editor.addCommand(
            monaco.KeyMod.CtrlCmd + monaco.KeyCode.Shift,
            function() {
                console.log('Ctrl + Shift = Toggle b/w Stdout and Stderr is executing!');
            }
        )
    }

    const codeChanged = (...params) => {
        console.log("params... ", params)
        setCode(params[0]);
    }
    
    return (
        <div>
            <div className='Header'>
                <button onClick={runCode}>Run Code</button>
            </div>
            <div className='Body'>
                <div className="Editor">
                    <Editor
                        height="94vh"
                        defaultLanguage={langs[langId]}
                        defaultValue={code}
                        theme='vs-dark'
                        width="auto"
                        onChange={codeChanged}
                        onMount = {edit => setEditor(edit)}
                    />
                </div>
                <div className='Sidebar'>
                    <div>
                        <button style={{color: stdinActive ? activeGreen : inactiveGreen}} className='editor-btn' onClick={() => setStdinActive(!stdinActive)}>STDIN</button> | <button style={{color: !stdinActive ? activeGreen : inactiveGreen}} className='editor-btn' onClick={() => setStdinActive(!stdinActive)}>FLAGS</button>
                    </div>
                    {
                        stdinActive ? (
                            <div className='stdin'>
                                <textarea value={stdin} onChange={evt => setStdin(evt.target.value)}></textarea>
                            </div>
                        ) : (
                            <div className='flags'>
                                <textarea value={flags} onChange={evt => setFlags(evt.target.value)}></textarea>
                            </div>
                        )
                    }
                    <div>
                        <button style={{color: stdoutActive ? activeGreen : inactiveGreen}} className='editor-btn' onClick={() => setStdoutActive(!stdoutActive)}>STDOUT</button> | <button style={{color: !stdoutActive ? activeGreen : inactiveGreen}} className='editor-btn' onClick={() => setStdoutActive(!stdoutActive)}>STDERR</button>
                    </div>
                    {
                        stdoutActive ? (
                            <div className='stdout'>{ stdout }</div>
                        ) : (
                            <div className='stderr'>{ stderr }</div>
                        )
                    }
                </div>
            </div>
            <div className='Footer'></div>
        </div>
    );
};

export default NewCode;