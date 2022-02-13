/*
 * @jest-environment jsdom
 */

const { 
  nodes,
  state,
  traverse,
  bindKeyEvents,
  createNewChild, 
  executeInput,
  prependPastInput,
  removeNodes,
  setInputToHistory,
} = require('../main');

afterEach(() => {
  document.body.innerHTML = '';
  state.inputs = [];
})

describe('EventListeners', () => {
  /*
   * bindKeyEvents handles all of our events in the console app,
   * triggering an event by dispatching a particular keypress will test the 
   * functions binded to our keyboard events.
   */
  const arrowUp = new KeyboardEvent('keydown', { key: 'ArrowUp' });
  const arrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
  const enter = new KeyboardEvent('keydown', { key: 'Enter' });

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="input-container">
        <input id="console" value="2" />
        <div id="output">
        </div>
      </div>
      `;
    nodes.inputContainer = document.getElementById('input-container');
    nodes.textConsole = document.getElementById('console');
    nodes.output = document.getElementById('output');
    bindKeyEvents();
  })

  test('traverseListener 01 (Traversing back)', () => {
    state.inputs = ['hey', 'friend'];

    expect(state.firstTraversal).toBe(true);
    nodes.textConsole.dispatchEvent(arrowUp);
    expect(nodes.textConsole.value).toBe('friend');
    expect(state.firstTraversal).toBe(false);
  })

  test('traverseListener 02 (Traversing forward)', () => {
    state.inputs = ['hey', 'friend'];

    expect(state.firstTraversal).toBe(false);
    nodes.textConsole.dispatchEvent(arrowUp);
    traverse.position = 2;
    nodes.textConsole.dispatchEvent(arrowDown);
    expect(nodes.textConsole.value).toBe('friend');
  })

  test('executeListner 01 (press Enter with valid JavaScript command as input value)', () => {
    nodes.textConsole.dispatchEvent(enter);
    expect(nodes.inputContainer.childNodes[0].innerHTML).toBe('2')
    expect(output.innerHTML).toBe('2');
    expect(nodes.textConsole.value).toBe('');
    expect(state.inputs[state.inputs.length - 1]).toBe('2');
  })

  test('executeListener 02 (press Enter with "clear" as input)', () => {
    // We need create a past input before we can clear 
    nodes.textConsole.dispatchEvent(enter);
    expect(document.querySelectorAll('.past-input').length).toBe(1);
    nodes.textConsole.value = 'clear';
    nodes.textConsole.dispatchEvent(enter);
    expect(document.querySelectorAll('.past-input').length).toBe(0);
  })
})

describe('executeOutput', () => {
  const errorColor = 'text-red-600'

  beforeEach(() => {
    document.body.innerHTML = `<input id="console" value="" /><div id="output" class="${errorColor}"></div>`;
    nodes.output = document.getElementById('output');
  })

  test('executeOutput should throw an error if the input value is invalid JavaScript', () => {
    expect(() => {executeInput('hi')}).toThrow();
    expect(nodes.output.classList.contains(errorColor)).toBe(true);
  })

  test('executeOutput should remove the errorColor class from the output div if the input just executed was valid JavaScript', () => {
    expect(nodes.output.classList.contains(errorColor)).toBe(true);
    executeInput('x = (a, b) => a + b');
    expect(nodes.output.classList.contains(errorColor)).toBe(false);
  })
})

describe('createNewChild', () => {
  test('createNewChild should return a HTMLDivElement', () => {
    expect(createNewChild().toString()).toBe("[object HTMLDivElement]");
  })
})

describe('removeNodes', () => {
  test('removeNodes should remove all found elements', () => {
    document.body.innerHTML = '<div class="past-input"></div><div class="past-input"></div>'
    const result = removeNodes('.past-input');

    expect(result).toBe(true);
    expect(document.querySelectorAll('.past-input').length).toBe(0);
  })
})

describe('removeNodes', () => {
  test('removeNodes should throw an error if no elements are found', () => {
    expect(() => removeNodes('foo')).toThrow();
  })
})

describe('setInpuToHistory', () => {
  test('setInputToHistory should set the console input to the given index in the state.inputs array', () => {
    document.body.innerHTML = '<input id="console" value="foo"/>';
    nodes.textConsole = document.getElementById('console')
    state.inputs = ['hello', 'world'];

    expect(setInputToHistory(1)).toBe('world');
  })
})

describe('prependPastInput', () => {
  test('prependPastInput should set isFirstPrepended to false if the past input is the first past input to be inserted into input-container', () => {
    document.body.innerHTML = '<div id="input-container"></div>';
    nodes.inputContainer = document.getElementById('input-container');
    state.inputs = ['bar'];
    state.isFirstPrepended = true;

    expect(prependPastInput()).toBe(false);
    expect(nodes.inputContainer.childNodes[0].innerHTML).toBe('bar');
  })

  test('prependPastInput should prepend the past input above the console input, and below every other past input so long as their are > 1 past inputs', () => {
    document.body.innerHTML = 
    `<div id="input-container">
      <div class="past-input">hey</div>
      <div class="past-input">hi</div>
      <input id="console" value="foo" />
    </div>`;
    nodes.inputContainer = document.getElementById('input-container');
    state.isFirstPrepended = false;
    state.inputs = ['yo'];

    prependPastInput();
    expect(nodes.inputContainer.childNodes[
      nodes.inputContainer.childNodes.length - 3
    ].innerHTML).toBe('yo');
  })
})
