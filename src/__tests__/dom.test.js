/*
 * @jest-environment jsdom
 */

const { 
  nodes,
  state,
  bindKeyEvents,
  createNewChild, 
  prependPastInput,
  removeNodes,
  setInputToHistory,
} = require('../main');

afterAll(() => {
  document.body.innerHTML = '';
  state.inputs = [];
})

test('test createNewChild should return a HTMLDivElement', () => {
  expect(createNewChild().toString()).toBe("[object HTMLDivElement]");
})

test('removeNodes should remove all found elements', () => {
  document.body.innerHTML = '<div class="past-input"></div><div class="past-input"></div>'
  const result = removeNodes('.past-input');

  expect(result).toBe(true);
  expect(document.querySelectorAll('.past-input').length).toBe(0);
})

test('removeNodes should throw an error if no elements are found', () => {
  expect(() => removeNodes('foo')).toThrow();
})

test('setInputToHistory should set the console input to the given index in the state.inputs array', () => {
  document.body.innerHTML = '<input id="console" value="foo"/>';
  nodes.textConsole = document.getElementById('console')
  state.inputs = ['hello', 'world'];

  expect(setInputToHistory(1)).toBe('world');
})

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
