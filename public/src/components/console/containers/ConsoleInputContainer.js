import React from "react";

export default function ConsoleInputContainer(props) {
  return (
    <div id="input-container" className="bg-neutral-900 w-full p-2 rounded-bl-md h-full overflow-auto scroll">
      {props.children}
    </div>
  )
}