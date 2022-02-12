/*
 * @jest-environment jsdom
 */

const { 
  createNewChild, 
  nodes,
  removeNodes,
  setInputToHistory,
  state,
} = require('../main');
const all = require('../main')

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

test('setInputToHistory', () => {
  document.body.innerHTML = '<input id="console" value="foo"/>';
  nodes.textConsole = document.getElementById('console')
  state.inputs = ['hello', 'world'];
  expect(setInputToHistory(1)).toBe('world');
})
