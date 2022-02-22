import React from 'react';
import ConsoleHeader from '../ConsoleHeader';

export default function ConsoleOuterContainer(props) {
  return (
    <div className="flex flex-col pt-8">
      <div className="m-auto w-8/12 p-10">
        <ConsoleHeader />
        <div className="flex border-[0.15rem] rounded-b-md border-darkBlue h-[800px] shadow-md">
          {props.children}
        </div>
      </div>
    </div>
  )
}