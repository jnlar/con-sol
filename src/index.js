const textConsole = document.getElementById('console');
const inputContainer = document.getElementById('input-container');
const output = document.getElementById('output');

let state;

// TODO: 
// - implement shift + enter newline
function bindKeyEvents() {
  textConsole.addEventListener('keydown', (e) => {
    if (e.key == 'ArrowUp') {
      handleHistory();
    }

    if (e.key == 'l' && e.ctrlKey) {
      e.preventDefault();
      cursorToTop();
    }

    if (e.key === 'Enter' && e.target.value !== '') {
      executeInput(e.target.value);

      if (state.clearingPastInputs) {
        return state.clearingPastInputs = false;
      }

      prependPastInput();
      state.resetHistory();
    }
  })
}

function setInputToHistory() {
  return textConsole.value = state.inputs[state.historyPos()];
}

function handleHistory() {
  if (state.inputs[state.historyPos()] !== undefined) {
    if (!state.hasTraversedHistory) {
      state.hasTraversedHistory = true;
      setInputToHistory();
      return state.traverseCount++
    }

    setInputToHistory();
    state.traverseCount++;
  } 
}

function cursorToTop() {
  document.querySelectorAll('.past-input').forEach(el => {
    el.remove();
  });
}

function executeInput(input) {
  textConsole.value = '';

  if (input === 'clear') {
    state.inputs = [];
    state.clearingPastInputs = true;
    return cursorToTop();
  }

  state.inputs.push(input);

  if (output.classList.contains(state.errorColor)) {
    output.classList.remove(state.errorColor);
  }

  try {
    // TODO: implement capability to do 'var, let, const' declarations,
    let fn = new Function('return ' + input)();
    return output.innerHTML = fn;
  } catch(e) {
    output.classList.add(state.errorColor);
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

function init() {
  bindKeyEvents();

  return state = {
    inputs: [],
    hasTraversedHistory: false,
    historyPos: () => {
      return state.inputs.length - state.traverseCount; 
    },
    resetHistory: () => {
      state.hasTraversedHistory = false;
      state.traverseCount = 1;
    },
    traverseCount: 1,
    isFirstPrepended: true,
    clearingPastInputs: false,
    errorColor: 'text-red-600'
  }
}

window.onload = init;
