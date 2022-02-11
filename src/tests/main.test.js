/*
 * @jest-environment jsdom
 */

const {
  doCallback,
} = require('../main');
const { 
  Traverse, 
  AddCommand 
} = require("../command");

function testDoCallBack() {
  test('test doCallback() executes a callback function', () => {
    expect(doCallback(() => 1 + 2)).toBe(3);
  })
  test('test doCallback() returns null if the arguement isn\'t a function', () => {
    expect(doCallback(3)).toBe(null);
  })
}

testDoCallBack();

function testCommands() {
  test('test traverse.executeCommand with AddCommand instantiation as parameter adds on to traverse.position', () => {
    const traverse = new Traverse();
    traverse.executeCommand(new AddCommand(2));
    expect(traverse.position).toBe(3);
  })
  test('test traverse.undo undoes the last command', () => {
    const traverse = new Traverse();
    traverse.executeCommand(new AddCommand(2));
    traverse.undo();
    expect(traverse.position).toBe(1);
  })
}

testCommands();

function testTraverseForward() {
  const traverse = new Traverse()

  // Mock of canTraverseForward
  const canTraverseForward = jest.fn((callback) => {
    if (traverse.position !== 1) {
      return doCallback(callback);
    }

    return false;
  })

  canTraverseForward(() => 'bar')

  test('test canTraverseForward() returns false if traverse position is 1', () => {
    expect(canTraverseForward).toHaveReturnedWith(false);
  })

  traverse.position = 3;
  canTraverseForward(() => 'callback executed')

  test('test canTraverseForward() executes the callback if traverse.position isn\'t 1', () => {
    expect(canTraverseForward).toHaveReturnedWith('callback executed');
  })
}

testTraverseForward();

function testTraverseBack() {
  const traverse = new Traverse()
  const state = {inputs: [1, 2]}

  // Mock of canTraverseBack
  const canTraverseBack = jest.fn((callback) => {
    if (state.inputs.length) {
      if (traverse.position !== state.inputs.length) {
        return doCallback(callback);
      }
    }

    return false;
  })

  test('test canTraverseBack() will return a callback if conditionals are met', () => {
    canTraverseBack(() => 'foo')
    expect(canTraverseBack).toHaveReturnedWith('foo');
  })

  test('test canTraverseBack() will return false if conditionals aren\'t met', () => {
    traverse.position = 2
    canTraverseBack(() => 'foo')
    expect(canTraverseBack).toHaveReturnedWith(false);
  })
}

testTraverseBack();