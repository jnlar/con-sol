import React from 'react';

export default function ConsoleInput(props) {
  const {
    setInput, 
    traverseListener, 
    clearListener, 
    executeListener,
    input,
  } = props;

  return (
    <span className="w-full">
      <span className="text-green-600 w-[5%] pr-1">&gt;</span>
      <input 
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          traverseListener(e);
          clearListener(e);
          executeListener(e);
        }}
        className="bg-neutral-900 focus:outline-none caret-green-600 w-[90%]"
        id="console" 
        value={input} 
        type="text"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="off" />
    </span>
  )
}