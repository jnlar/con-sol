import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
      <span className="text-neutral-700 w-[5%] text-sm font-bold pr-1">
        <ArrowForwardIosIcon sx={{fontSize: 11}}/>
      </span>
      <input 
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          traverseListener(e);
          clearListener(e);
          executeListener(e);
        }}
        className="bg-neutral-900 focus:outline-none caret-neutral-700 w-[90%]"
        value={input} 
        type="text"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false} />
    </span>
  )
}