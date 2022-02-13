/*
 * @jest-environment jsdom
 */

const { 
  nodes,
  state,
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

describe('DOM tests', () => {
  describe('EventListeners', () => {
    /*
    * bindKeyEvents handles all of our events in the console app,
    * triggering an event by dispatching a particular keypress will cover testing 
    * for most of our functions binded to our keyboard events.
    */
    const arrowUp = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const arrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const enter = new KeyboardEvent('keydown', { key: 'Enter' });
    const ctrlL = new KeyboardEvent('keydown', { key: 'l', ctrlKey: true });

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
      state.firstTraversal = true;
      state.inputs = [];
      bindKeyEvents();
    })

    describe('traverseListener', () => {
      test('on ArrowUp should set the console input to the last input executed, and set state.firstTraversal to false', () => {
        state.inputs = ['hey', 'friend'];
        expect(state.firstTraversal).toBe(true);
        nodes.textConsole.dispatchEvent(arrowUp);
        expect(nodes.textConsole.value).toBe('friend');
        expect(state.firstTraversal).toBe(false);
      })

      test('on ArrowDown should set the console input to the previously traversed input if possible', () => {
        state.inputs = ['hey', 'friend'];
        expect(state.firstTraversal).toBe(true);
        nodes.textConsole.dispatchEvent(arrowUp);
        expect(nodes.textConsole.value).toBe('friend');
        nodes.textConsole.dispatchEvent(arrowUp);
        expect(nodes.textConsole.value).toBe('hey');
        nodes.textConsole.dispatchEvent(arrowDown);
        expect(nodes.textConsole.value).toBe('friend');
      })
    })

    describe('executeListener', () => {
      test('the prepended past input div should have the executed input as it\'s innerHTML', () => {
        nodes.textConsole.dispatchEvent(enter);
        expect(nodes.inputContainer.childNodes[0].innerHTML).toBe('2')
        expect(output.innerHTML).toBe('2');
        expect(nodes.textConsole.value).toBe('');
        expect(state.inputs[state.inputs.length - 1]).toBe('2');
      })
      test('the output div should have the expected output if the input was valid JavaScript', () => {
        document.getElementById('console').value = 'x = 3'
        nodes.textConsole.dispatchEvent(enter);
        expect(output.innerHTML).toBe('3');
      })
      test('pressing Enter should clear the console if the input was valid JavaScript', () => {
        nodes.textConsole.dispatchEvent(enter);
        expect(nodes.textConsole.value).toBe('');
      })

      test('pressing Enter with "clear" as the console input should remove all past inputs from the consoles display', () => {
        // We need create a past input before we can clear 
        nodes.textConsole.dispatchEvent(enter);
        expect(document.querySelectorAll('.past-input').length).toBe(1);
        nodes.textConsole.value = 'clear';
        nodes.textConsole.dispatchEvent(enter);
        expect(document.querySelectorAll('.past-input').length).toBe(0);
      })
    })

    describe('clearlistener', () => {
      test('pressing crtl and l in combination should clear the past inputs displayed in the console', () => {
        document.body.innerHTML = `
          <div id="input-container">
            <div class="past-input">y = a => b => a * b</div>
            <div class="past-input">Math.pow(2, 10)</div>
            <input id="console" value="2" />
            <div id="output">
            </div>
          </div>
        `;
        expect(document.querySelectorAll('.past-input').length).toBe(2);
        nodes.textConsole.dispatchEvent(ctrlL);
        expect(document.querySelectorAll('.past-input').length).toBe(0);
      })
    })
  })

  describe('executeInput', () => {
    // EventListeners tests didn't cover some parts of the executeInput
    // function, so we cover the missing parts here.
    const errorColor = 'text-red-600'

    beforeEach(() => {
      document.body.innerHTML = `<input id="console" value="" /><div id="output" class="${errorColor}"></div>`;
      nodes.output = document.getElementById('output');
    })

    test('Should throw an error if the input value is invalid JavaScript', () => {
      expect(() => {executeInput('hi')}).toThrow();
      expect(nodes.output.classList.contains(errorColor)).toBe(true);
    })

    test('Should remove the errorColor class from the output div if the input just executed was valid JavaScript', () => {
      expect(nodes.output.classList.contains(errorColor)).toBe(true);
      executeInput('x = (a, b) => a + b');
      expect(nodes.output.classList.contains(errorColor)).toBe(false);
    })
  })

  describe('createNewChild', () => {
    test('Should return a HTMLDivElement', () => {
      expect(createNewChild().toString()).toBe("[object HTMLDivElement]");
    })
  })

  describe('removeNodes', () => {
    test('Should remove all found elements', () => {
      document.body.innerHTML = '<div class="past-input"></div><div class="past-input"></div>'
      const result = removeNodes('.past-input');

      expect(result).toBe(true);
      expect(document.querySelectorAll('.past-input').length).toBe(0);
    })

    test('Should throw an error if no elements are found', () => {
      expect(() => removeNodes('foo')).toThrow();
    })
  })

  describe('setInpuToHistory', () => {
    test('Should set the console input to the given index in the state.inputs array', () => {
      document.body.innerHTML = '<input id="console" value="foo"/>';
      nodes.textConsole = document.getElementById('console')
      state.inputs = ['hello', 'world'];

      expect(setInputToHistory(1)).toBe('world');
    })
  })

  describe('prependPastInput', () => {
    test('Should set isFirstPrepended to false if the past input is the first past input to be inserted into input-container', () => {
      document.body.innerHTML = '<div id="input-container"></div>';
      nodes.inputContainer = document.getElementById('input-container');
      state.inputs = ['bar'];
      state.isFirstPrepended = true;

      expect(prependPastInput()).toBe(false);
      expect(nodes.inputContainer.childNodes[0].innerHTML).toBe('bar');
    })

    test('Should prepend the past input above the console input, and below every other past input so long as their are > 1 past inputs', () => {
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
})
