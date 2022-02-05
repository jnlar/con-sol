const textConsole = document.getElementById('console');
const output = document.getElementById('output')

// take the input, and then try compute it as JS
textConsole.addEventListener('keydown', (e) => {
  if (e.key === "Enter") {
    executeInput(e.target.value);
  }
})

function executeInput(input) {
  textConsole.value = '';

  try {
    // we need to be able to do 'var, let, const' declarations
    let fn = new Function('return ' + input)();
    return output.innerHTML = fn;
  } catch(e) {
    output.innerHTML = e;
    throw new Error(e);
  }
}