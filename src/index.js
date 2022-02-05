const textConsole = document.getElementById('console');
const inputContainer = document.getElementById('input-container');
const output = document.getElementById('output')

const inputs = [];
let isFirstPrepended = true;

textConsole.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    executeInput(e.target.value);
    return prependPastInput();
  }
})

function executeInput(input) {
  textConsole.value = '';
  inputs.push(input);

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
  let text = document.createTextNode(inputs[inputs.length - 1]);
  let parentNodesLength = inputContainer.childNodes.length

  prepended.appendChild(text);

  if (isFirstPrepended) {
    inputContainer.insertBefore(prepended, inputContainer.childNodes[0]);
    return isFirstPrepended = false;
  } else { 
    inputContainer.insertBefore(prepended, inputContainer.childNodes[
      parentNodesLength - 2
    ]);
  }
}