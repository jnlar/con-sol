/*
 * @jest-environment jsdom
 */

const { 
  canTraverseBack, 
  canTraverseForward,
  clearInputs,
  doCallback, 
  handleClear,
  nodes,
  pushInput,
  state,
  traverse,
} = require('../main');
const { Traverse, AddCommand } = require("../command");

afterAll(() => {
  traverse.position = 1;
})

test('pushInput should push one element onto an array', () => {
  const array = [];
  jest.fn(() => {
    return pushInput(array, 'foo');
  })()
  expect(array).toEqual(['foo']);
})

test('handleClear should set state.clearingPastInputs to false', () => {
  const state = {clearingPastInputs: true}
  jest.fn(() => {
    return handleClear(state);
  })()
  expect(state.clearingPastInputs).toBe(false);
})

test('clearInputs should return an empty array', () => {
  expect(clearInputs()).toEqual([]);
})

function testDoCallBack() {
  test('doCallback should execute a callback function', () => {
    expect(doCallback(() => 1 + 2)).toBe(3);
  })
  test('doCallback should return return null if the first arguement isn\'t a function', () => {
    expect(doCallback(3)).toBe(null);
    expect(doCallback('hey')).toBe(null);
  })
}

testDoCallBack();

function testCommands() {
  test('traverse.executeCommand with AddCommand instantiation as parameter should add to traverse.position', () => {
    const traverse = new Traverse();
    traverse.executeCommand(new AddCommand(2));
    expect(traverse.position).toBe(3);
  })
  test('traverse.undo undoes the last command', () => {
    const traverse = new Traverse();
    traverse.executeCommand(new AddCommand(2));
    traverse.undo();
    expect(traverse.position).toBe(1);
  })
}

testCommands();

function testCanTraverseBack() {
  // FIXME: we aren't testing the first nested if statement
  test('canTraverseBack returns a callback', () => {
    state.inputs = ['foo', 'bar'];
    const mockFn = jest.fn(() => {
      return 'foo';
    });
    canTraverseBack(mockFn)
    expect(mockFn).toBeCalled();
  })
  test('canTraverseBack will error if inputs array is empty', () => {
    state.inputs = [];
    const mockFn = jest.fn(() => {
      return 'foo';
    });
    expect(() => {
      canTraverseBack(mockFn);
    }).toThrow();
  })
};

testCanTraverseBack();

function testCanTraverseForward() {
  test('canTraverseForward will throw an error if traverse position is 1', () => {
    const mockFn = jest.fn(() => {
      return 'foo';
    });
    expect(() => {
      canTraverseForward(mockFn);
    }).toThrow();
  })
  test('canTraverseForward will return a callback if traverse position isn\'t 1', () => {
    traverse.position = 2;
    const mockFn = jest.fn(() => {
      return 'foo';
    });
    canTraverseForward(mockFn);
    expect(mockFn).toBeCalled();
  })
}

testCanTraverseForward();
