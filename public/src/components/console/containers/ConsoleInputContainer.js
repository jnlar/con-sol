import React from "react";

export default function ConsoleInputContainer(props) {
  return (
    <div id="input-container" className="bg-neutral-900 w-2/4 p-2 rounded-l-md h-full overflow-auto scroll">
      {props.children}
    </div>
  )
}