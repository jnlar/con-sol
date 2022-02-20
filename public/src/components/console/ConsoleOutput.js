import React from 'react';

export default function ConsoleOutput({error, output}) {
  return (
    <div 
      className={`p-2 w-2/4 bg-neutral-700 rounded-r-md ${error ? "text-red-500" : ""}`}
      id="output"
    >
      {output}
    </div>
  )
}