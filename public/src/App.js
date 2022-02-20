import React, { useState } from "react";
import axios from "axios";
import { Traverse, AddCommand } from "./util/command";
axios.defaults.withCredentials = true;

const traverse = new Traverse();

const scrollToBottom = (node) => node.scrollTop = node.scrollHeight;

function doCallback(callback) {
  return typeof callback === 'function' ? callback() : null;
}

export default function App() {
  const nodes = {
    textConsole: document.getElementById('console'),
    inputContainer: document.getElementById('input-container'),
    output: document.getElementById('output'),
  };
  const [input, setInput] = useState('');
  const [inputs, setInputs] = useState([]);
  const [output, setOutput] = useState('');
  const [error, setError] = useState(false);
  const [firstTraversal, setFirstTraversal] = useState(true);
  const [clearingPastInputs, setClearingPastInputs] = useState(false);

  function clearListener(e) {
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setInputs([]);
    }
  }

  function traverseListener(e) {
    if (e.key === 'ArrowUp') {
      return traverseBack();
    } else if (e.key === 'ArrowDown') {
      return traverseForward();
    }
  }

  function canTraverseBack(callback) {
    if (inputs.length) {
      if (traverse.position !== inputs.length) {
        return doCallback(callback);
      }
    }

    throw new Error(`Cannot traverse back: Already at earliest point in input history`);
  }

  function canTraverseForward(callback) {
    if (traverse.position !== 1) {
      return doCallback(callback);
    }

    throw new Error(`Cannot traverse forward: already at latest point in history`)
  }

  function traverseBack() {
    if (firstTraversal) {
      canTraverseBack(() => {
        setFirstTraversal(false);
        return setInputToHistory(1);
      })
    } else {
      canTraverseBack(() => {
        traverse.executeCommand(new AddCommand(1));
        let position = traverse.position;
        return setInputToHistory(position);
      })
    }
  }

  function traverseForward() {
    canTraverseForward(() => {
      traverse.undo(); 
      let position = traverse.position;
      return setInputToHistory(position);
    })
  }

  function handleClear() {
    if (clearingPastInputs) {
      return setClearingPastInputs(false);
    }
  }

  function setInputToHistory(position) {
    return setInput(inputs[
      inputs.length - position
    ]);
  }

  function executeListener(e) {
    if (e.key === 'Enter' && e.target.value !== '') {
      executeInput();
      if (clearingPastInputs) {
        return handleClear();
      } else {
        handleClear();
      }
    }
  }

  async function executeInput() {
    setInput('');

    if (input === 'clear') {
      setInputs([]);
      setClearingPastInputs(true);
      return removeNodes('.past-input');
    }

    setInputs([...inputs, input])

    await axios.post(`http://localhost:8080/api`, {
      run: `${input}`
    })
      .then((res)  => {
        if (res.data.error) {
          setError(true);
          setOutput(res.data.error)
        } else {
          setError(false);
          setOutput(res.data.result);
        }

        return scrollToBottom(nodes.inputContainer);
      }).catch((err) => {
        throw new Error(err);
      })
  }

  return (
    <>
      <h1 className="text-center text-lg pt-10">Con-Sol</h1>
      <div className="flex justify-center h-[800px] p-10 text-sm">
        <div className="w-8/12 flex shadow-md">
          <div id="input-container" className="bg-neutral-900 w-2/4 p-2 rounded-l-md h-full overflow-auto scroll">
            {inputs.map(input => {
              return (
                <div key={input} className="past-input">
                  {input}
                </div>
              )})}
            <span className="w-full">
              <span className="text-green-600 w-[5%] pr-1">&gt;</span>
              <input 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  traverseListener(e);
                  clearListener(e);
                  executeListener(e);
                }}
                className="bg-neutral-900 focus:outline-none caret-green-600 w-[90%]"
                id="console" 
                value={input} 
                type="text"
                spellCheck={false} />
            </span>
          </div>
          <div 
            className={`p-2 w-2/4 bg-neutral-700 rounded-r-md ${error ? "text-red-500" : ""}`}
            id="output"
          >
            {output}
          </div>
        </div>
      </div>
    </>
  )
}
