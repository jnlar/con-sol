import React from "react";

export default function PastInputs({inputs}) {
  return (
    <>
      {inputs.map((input, index) => {
        return (
          <div key={index} className="past-input">
            {input}
          </div>
      )})}
    </>
  )
}