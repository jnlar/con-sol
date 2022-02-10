import { Traverse, AddCommand } from "./command";

const traverse = new Traverse();
const textConsole = document.getElementById('console');
const inputContainer = document.getElementById('input-container');
const output = document.getElementById('output');
const errorColor = 'text-red-600';

const pushInput = input => state.inputs.push(input);
const clearInputs = () => state.inputs = [];

const state = {
  inputs: [],
  firstTraversal: true,
  isFirstPrepended: true,
  clearingPastInputs: false,
}

function bindKeyEvents() {
  textConsole.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      return traverseBack();
    } else if (e.key === 'ArrowDown') {
      return traverseForward();
    }

    if (e.key == 'l' && e.ctrlKey) {
      e.preventDefault();
      cursorToTop();
      clearInputs();
    }

    if (e.key === 'Enter' && e.target.value !== '') {
      executeInput(e.target.value);
      if (state.clearingPastInputs) {
        return handleClear();
      } else {
        handleClear();
        prependPastInput();
      }
    }
  })
}

function handleClear() {
  if (state.clearingPastInputs) {
    return state.clearingPastInputs = false;
  }
}

function setInputToHistory(position) {
  return textConsole.value = state.inputs[state.inputs.length - position];
}

function doCallback(callback) {
  return typeof callback === 'function' ? callback() : null;
}

function canTraverseBack(callback) {
  if (state.inputs.length) {
    if (traverse.position !== state.inputs.length) {
      return doCallback(callback);
    }
  }
}

function canTraverseForward(callback) {
  if (traverse.position !== 1) {
    return doCallback(callback);
  }
}

function traverseBack() {
  if (state.firstTraversal) {
    canTraverseBack(() => {
      state.firstTraversal = false;
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

function cursorToTop() {
  document.querySelectorAll('.past-input').forEach(el => {
    el.remove();
  });
}

function executeInput(input) {
  textConsole.value = '';

  if (input === 'clear') {
    clearInputs();
    state.clearingPastInputs = true;
    return cursorToTop();
  }

  pushInput(input);

  if (output.classList.contains(errorColor)) {
    output.classList.remove(errorColor);
  }

  try {
    // FIXME: implement capability to do 'var, let, const' declarations,
    let fn = new Function('return ' + input)();
    return output.innerHTML = fn;
  } catch(e) {
    output.classList.add(errorColor);
    output.innerHTML = e;
    throw new Error(e);
  }
}

function createNewChild() {
  let newChild = document.createElement('div');
  let lastInput = document.createTextNode(state.inputs[state.inputs.length - 1]);

  newChild.appendChild(lastInput);
  newChild.classList.add('past-input');

  return newChild;
}

function prependPastInput() {
  let toPrepend = createNewChild();
  let childNodesLength = inputContainer.childNodes.length;

  if (state.isFirstPrepended) {
    inputContainer.insertBefore(toPrepend, inputContainer.childNodes[0]);
    return state.isFirstPrepended = false;
  } else { 
    inputContainer.insertBefore(toPrepend, inputContainer.childNodes[
      childNodesLength - 2
    ]);
  }
}

window.onload = bindKeyEvents;

export {
  canTraverseBack,
  canTraverseForward,
  createNewChild,
  traverseForward,
  traverseBack,
  pushInput,
  clearInputs
};