const textConsole = document.getElementById('console');
const inputContainer = document.getElementById('input-container');
const output = document.getElementById('output');

let state;

// TODO: 
// - implement shift + enter newline
function bindKeyEvents() {
  textConsole.addEventListener('keydown', (e) => {
    if (e.key == 'l' && e.ctrlKey) {
      e.preventDefault();
      return cursorToTop();
    }

    if (e.key === 'Enter' && e.target.value !== '') {
      executeInput(e.target.value);

      if (state.clearingPastInputs) {
        return state.clearingPastInputs = false;
      }

      return prependPastInput();
    }
  })
}

function cursorToTop() {
  document.querySelectorAll('.past-input').forEach(el => {
    el.remove();
  });
}

function outputWasError() {
  return output.classList.contains('text-red-500');
}

function executeInput(input) {
  textConsole.value = '';
  state.inputs.push(input);

  if (outputWasError()) {
    output.classList.remove('text-red-500');
  }

  if (input === 'clear') {
    state.clearingPastInputs = true;
    return cursorToTop();
  }

  try {
    // TODO: implement capability to do 'var, let, const' declarations,
    let fn = new Function('return ' + input)();
    return output.innerHTML = fn;
  } catch(e) {
    output.classList.add('text-red-500');
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
    isFirstPrepended: true,
    clearingPastInputs: false,
  }
}

window.onload = init;
