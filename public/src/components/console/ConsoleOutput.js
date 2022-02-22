import React from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Output(props) {
  let PrependIcon;
  const style = "text-sm font-bold text-neutral-700 mr-1";

  if (!props.error) {
    if (!props.isInput) {
      PrependIcon = <ArrowForwardIosIcon className={style} sx={{fontSize: 11}}/>;
    } else {
      PrependIcon = <ArrowBackIosIcon className={style} sx={{fontSize: 11}}/>;
    }
  } else {
    PrependIcon = <CancelIcon className={`${style} text-errorRed`} sx={{fontSize: 11}} />; 
  }

  return (
    <div className="flex items-baseline">
      {PrependIcon}
      {props.children}
    </div>
  )
}

export default function ConsoleOutput({consol}) {
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
                    <p className="text-errorRed">{consol.output}</p>
                  </Output>
                : 
                  <Output>
                    <p>{consol.output}</p> 
                  </Output>
              : 
                <Output>
                  <p className="italic">undefined</p>
                </Output>
            }
          </div>
        )
      })}
    </>
  )
}