import React from "react";

export default function PastInputs({inputs}) {
  return (
    <>
      {inputs.map(input => {
        return (
          <div key={input} className="past-input">
            {input}
          </div>
      )})}
    </>
  )
}