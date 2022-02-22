import React, { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

import ConsoleInput from "./components/console/ConsoleInput";
import ConsoleInputContainer from "./components/console/containers/ConsoleInputContainer";
import ConsoleHeader from "./components/console/ConsoleHeader";
import ConsoleOutput from "./components/console/ConsoleOutput";
import ConsoleOuterContainer from "./components/console/containers/ConsoleOuterContainer";
import { Traverse, AddCommand } from "./util/command";

const traverse = new Traverse();

const scrollToBottom = (node) => node.scrollTop = node.scrollHeight;

function doCallback(callback) {
  return typeof callback === 'function' ? callback() : null;
}

export default function App() {
  const inputContainer = document.getElementById('input-container');
  const [input, setInput] = useState('');
  const [consol, setConsol] = useState([]);
  const [inputsHistory, setInputsHistory] = useState([]);
  const [firstTraversal, setFirstTraversal] = useState(true);

  function clearListener(e) {
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setConsol([]);
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
      return setConsol([]);
    }  

    await axios.post(`http://localhost:8080/api`, {
      run: `${input}`
    })
      .then((res) => {
        let didError;
        res.data.error ? didError = true : didError = false;

        setConsol(prevState => [
          ...prevState,
          {
            input: input,
            output: res.data.result || res.data.error,
            error: didError,
          }
        ]);

        return scrollToBottom(inputContainer);
      }).catch((err) => {
        throw new Error(err);
      })
  }

  return (
    <>
      <ConsoleOuterContainer>
        <ConsoleInputContainer>
          <ConsoleOutput consol={consol} />
          <ConsoleInput 
            setInput={setInput}
            traverseListener={traverseListener}
            clearListener={clearListener}
            executeListener={executeListener}
            input={input}
          />
        </ConsoleInputContainer>
      </ConsoleOuterContainer>
    </>
  )
}
