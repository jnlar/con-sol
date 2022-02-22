import React from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Output({error, isInput, children}) {
  let PrependIcon;
  const style = "font-bold text-neutral-700 mr-1";

  if (!error) {
    if (!isInput) {
      PrependIcon = <ArrowBackIosIcon className={style} sx={{fontSize: 11}}/>;
    } else {
      PrependIcon = <ArrowForwardIosIcon className={style} sx={{fontSize: 11}}/>;
    }
  } else {
    PrependIcon = <CancelIcon className={`${style} text-errorRed`} sx={{fontSize: 11}} />; 
  }

  return (
    <div className="flex items-baseline">
      {PrependIcon}
      {children}
    </div>
  )
}

export default function ConsoleOutput({consol}) {
  console.log(consol.output)
  return (
    <>
      {consol.map((consol, index) => {
        return (
          <div key={index} className="past">
            <Output isInput={true}>
              <p>{consol.input}</p>
            </Output>
            {
              consol.output ? 
                consol.error ? 
                  <Output error={true}>
                    {/*
                      TODO:
                      - error stack trace?
                    */}
                    <p className="text-errorRed">{consol.output}</p>
                  </Output>
                : 
                  <Output>
                    {/*
                      TODO:
                      - functions return undefined if we just try to reference it in the console,
                        e.g a function def such as fn = () => 1 should return exactly that if we input 'fn' into the console
                      FIXME: 
                      - render objects without stringifying?
                    */}
                    <p>{JSON.stringify(consol.output)}</p> 
                  </Output>
              : 
                <Output>
                  <p>undefined</p>
                </Output>
            }
          </div>
        )
      })}
    </>
  )
}