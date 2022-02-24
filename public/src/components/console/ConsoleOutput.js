import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function OutputContainer({ children }) {
	return <div className="border-b border-neutral-800 past">{children}</div>;
}

function Output({ error, isInput, children }) {
	let PrependIcon;
	const style = "font-bold mr-1";

	if (!error) {
		if (!isInput) {
			PrependIcon = (
				<KeyboardArrowLeftIcon
					className={`${style} text-neutral-500`}
					sx={{ fontSize: 20 }}
				/>
			);
		} else {
			PrependIcon = (
				<ChevronRightIcon
					className={`${style} text-neutral-400`}
					sx={{ fontSize: 20 }}
				/>
			);
		}
	} else {
		PrependIcon = (
			<CancelIcon
				className={`${style} ml-1 text-errorRed`}
				sx={{ fontSize: 11 }}
			/>
		);
	}

	return (
		<div className="flex items-center">
			{PrependIcon}
			<div className="pt-[0.2rem]">{children}</div>
		</div>
	);
}

export default function ConsoleOutput({ consol }) {
	return (
		<>
			{consol.map((consol, index) => {
				return (
					<OutputContainer key={index}>
						<Output isInput={true}>
							<p>{consol.input}</p>
						</Output>
						{consol.output ? (
							consol.error ? (
								<Output error={true}>
									{/*
                      TODO:
                      - error stack trace?
                    */}
									<p className="pl-1 text-errorRed">{consol.output}</p>
								</Output>
							) : (
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
							)
						) : (
							<Output>
								<p>undefined</p>
							</Output>
						)}
					</OutputContainer>
				);
			})}
		</>
	);
}
