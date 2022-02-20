import React, { useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

import ConsoleInput from "./components/console/ConsoleInput";
import ConsoleOutput from "./components/console/ConsoleOutput";
import ConsoleOuterContainer from "./components/console/containers/ConsoleOuterContainer";
import ConsoleInputContainer from "./components/console/containers/ConsoleInputContainer";
import PastInputs from "./components/console/PastInputs";
import { Traverse, AddCommand } from "./util/command";

const traverse = new Traverse();

const scrollToBottom = (node) => node.scrollTop = node.scrollHeight;

function doCallback(callback) {
  return typeof callback === 'function' ? callback() : null;
}

export default function App() {
  const inputContainer = document.getElementById('input-container');
  const [input, setInput] = useState('');
  const [inputs, setInputs] = useState([]);
  const [inputsHistory, setInputsHistory] = useState([]);
  const [output, setOutput] = useState('');
  const [error, setError] = useState(false);
  const [firstTraversal, setFirstTraversal] = useState(true);

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

  function executeListener(e) {
    if (e.key === 'Enter' && e.target.value !== '') {
      executeInput();
    }
  }

  function canTraverseBack(callback) {
    if (inputsHistory.length) {
      if (traverse.position !== inputsHistory.length) {
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

  function setInputToHistory(position) {
    return setInput(inputsHistory[
      inputsHistory.length - position
    ]);
  }

  async function executeInput() {
    setInput('');

    if (input === 'clear') {
      return setInputs([]);
    } else {
      setInputs([...inputs, input])
      setInputsHistory([...inputs, ...inputsHistory, input])
    }

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

        return scrollToBottom(inputContainer);
      }).catch((err) => {
        throw new Error(err);
      })
  }

  return (
    <>
      <h1 className="text-center text-lg pt-10">Con-Sol</h1>
      <ConsoleOuterContainer>
        <ConsoleInputContainer>
          <PastInputs inputs={inputs} />
          <ConsoleInput 
            setInput={setInput}
            traverseListener={traverseListener}
            clearListener={clearListener}
            executeListener={executeListener}
            input={input}
          />
        </ConsoleInputContainer>
        <ConsoleOutput error={error} output={output} />
      </ConsoleOuterContainer>
    </>
  )
}
