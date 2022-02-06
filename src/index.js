const textConsole = document.getElementById('console');
const inputContainer = document.getElementById('input-container');
const output = document.getElementById('output');

let state;

// TODO: implement shift + enter newline
function bindKeyEvents() {
  textConsole.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
      executeInput(e.target.value);
      return prependPastInput();
    }
  })

  textConsole.addEventListener('keyup', () => {
    Object.keys(state.keys).map(key => state.keys[key] = false);
  })
}

function executeInput(input) {
  textConsole.value = '';
  state.inputs.push(input);

  try {
    // TODO: capability to do 'var, let, const' declarations
    let fn = new Function('return ' + input)();
    return output.innerHTML = fn;
  } catch(e) {
    output.innerHTML = e;

    throw new Error(e);
  }
}

function prependPastInput() {
  let prepended = document.createElement('div');
  let text = document.createTextNode(state.inputs[state.inputs.length - 1]);
  let childNodesLength = inputContainer.childNodes.length;

  prepended.appendChild(text);

  if (state.isFirstPrepended) {
    inputContainer.insertBefore(prepended, inputContainer.childNodes[0]);
    return state.isFirstPrepended = false;
  } else { 
    inputContainer.insertBefore(prepended, inputContainer.childNodes[
      childNodesLength - 2
    ]);
  }
}

function init() {
  return state = {
    inputs: [],
    isFirstPrepended: true,
    keys: {
      shift: false,
      enter: false
    }
  }
}

window.onload = init;