import React from 'react';

export default function ConsoleOuterContainer(props) {
  return (
    <div className="flex justify-center h-[800px] p-10 text-sm">
      <div className="w-8/12 flex shadow-md">
        {props.children}
      </div>
    </div>
  )
}