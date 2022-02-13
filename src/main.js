const { Traverse, AddCommand } = require("./command");

const nodes = {
  textConsole: document.getElementById('console'),
  inputContainer: document.getElementById('input-container'),
  output: document.getElementById('output'),
};
const state = {
  inputs: [],
  firstTraversal: true,
  isFirstPrepended: true,
  clearingPastInputs: false,
};

const traverse = new Traverse();
const errorColor = 'text-red-600';

const pushInput = (array, input) => array.push(input);
const clearInputs = () => state.inputs = [];

function bindKeyEvents() {
  nodes.textConsole.addEventListener('keydown', (e) => traverseListener(e));
  nodes.textConsole.addEventListener('keydown', (e) => clearListener(e));
  nodes.textConsole.addEventListener('keydown', (e) => executeListener(e));
}

function clearListener(e) {
  if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    removeNodes('.past-input');
    clearInputs();
  }
}

function executeListener(e) {
  if (e.key === 'Enter' && e.target.value !== '') {
    executeInput(e.target.value);
    if (state.clearingPastInputs) {
      return handleClear(state);
    } else {
      handleClear(state);
      prependPastInput();
    }
  }
}

function traverseListener(e) {
  if (e.key === 'ArrowUp') {
    return traverseBack();
  } else if (e.key === 'ArrowDown') {
    return traverseForward();
  }
}

function handleClear(state) {
  if (state.clearingPastInputs) {
    return state.clearingPastInputs = false;
  }
}

function setInputToHistory(position) {
  return nodes.textConsole.value = state.inputs[
    state.inputs.length - position
  ];
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

  throw new Error(`Cannot traverse back: Already at earliest point in input history`);
}

function canTraverseForward(callback) {
  if (traverse.position !== 1) {
    return doCallback(callback);
  }

  throw new Error(`Cannot traverse forward: already at latest point in history`)
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

function removeNodes(selector) {
  if (document.querySelectorAll(selector).length) {
    document.querySelectorAll(selector).forEach(el => {
      el.remove();
    });
    return true;
  }

  throw new Error(`HTML nodes with selector '${selector}' not found`);
}

function executeInput(input) {
  nodes.textConsole.value = '';
  let output = nodes.output;

  if (input === 'clear') {
    clearInputs();
    state.clearingPastInputs = true;
    return removeNodes('.past-input');
  }

  pushInput(state.inputs, input);

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
  let inputContainer = nodes.inputContainer;
  let toPrepend = createNewChild();
  let childNodesLength = inputContainer.childNodes.length;

  if (state.isFirstPrepended) {
    inputContainer.insertBefore(toPrepend, inputContainer.childNodes[0]);
    return state.isFirstPrepended = false;
  } else { 
    return inputContainer.insertBefore(toPrepend, inputContainer.childNodes[
      childNodesLength - 2
    ]);
  }
}

window.onload = bindKeyEvents;

module.exports = {
  nodes,
  state,
  traverse,
  bindKeyEvents,
  canTraverseBack,
  canTraverseForward,
  clearInputs,
  clearListener,
  createNewChild,
  doCallback,
  executeInput,
  executeListener,
  handleClear,
  prependPastInput,
  pushInput,
  removeNodes,
  setInputToHistory,
  traverseListener,
};
