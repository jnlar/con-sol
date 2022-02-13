/*
 * @jest-environment jsdom
 */

const { 
  canTraverseBack, 
  canTraverseForward,
  clearInputs,
  doCallback, 
  handleClear,
  pushInput,
  state,
  traverse,
} = require('../main');
const { Traverse, AddCommand } = require("../command");

afterEach(() => {
  traverse.position = 1;
})

describe('pushInput', () => {
  test('Should push one element onto an array', () => {
    const array = [];
    jest.fn(() => {
      return pushInput(array, 'foo');
    })()
    expect(array).toEqual(['foo']);
  })
})

describe('handleClear', () => {
  test('Should set state.clearingPastInputs to false', () => {
    const state = {clearingPastInputs: true}
    jest.fn(() => {
      return handleClear(state);
    })()
    expect(state.clearingPastInputs).toBe(false);
  })
})

describe('clearInputs', () => {
  test('Should return an empty array', () => {
    expect(clearInputs()).toEqual([]);
  })
})

describe('doCallback', () => {
  test('Should execute a callback function', () => {
    expect(doCallback(() => 1 + 2)).toBe(3);
  })
  test('Should return null if the first arguement isn\'t a function', () => {
    expect(doCallback(3)).toBe(null);
    expect(doCallback('hey')).toBe(null);
  })
})

describe('Commands', () => {
  test('traverse.executeCommand with AddCommand instantiation as parameter should add to traverse.position', () => {
    const traverse = new Traverse();
    traverse.executeCommand(new AddCommand(2));
    expect(traverse.position).toBe(3);
  })
  test('traverse.undo should undo the last command', () => {
    const traverse = new Traverse();
    traverse.executeCommand(new AddCommand(2));
    traverse.undo();
    expect(traverse.position).toBe(1);
  })
})

describe('canTraverseBack', () => {
  afterEach(() => {
    state.inputs = [];
  })
  test('Should return a callback', () => {
    state.inputs = ['foo', 'bar'];
    const mockFn = jest.fn(() => {
      return 'foo';
    });
    canTraverseBack(mockFn)
    expect(mockFn).toBeCalled();
  })
  test('Should throw an error if inputs array is empty', () => {
    expect(() => {
      canTraverseBack(() => 'foo');
    }).toThrow();
  })
  test('Should throw an error if traverse.position is equal to state.inputs.length', () => {
    state.inputs = ['foo', 'bar'];
    traverse.position = 2;
    expect(() => {
      canTraverseBack(() => 'foo');
    }).toThrow();
  })
})

describe('canTraverseForward', () => {
  test('Should throw an error if traverse position is 1', () => {
    const mockFn = jest.fn(() => {
      return 'foo';
    });
    expect(() => {
      canTraverseForward(mockFn);
    }).toThrow();
  })
  test('Should return a callback if traverse position isn\'t 1', () => {
    traverse.position = 2;
    const mockFn = jest.fn(() => {
      return 'foo';
    });
    canTraverseForward(mockFn);
    expect(mockFn).toBeCalled();
  })
})
