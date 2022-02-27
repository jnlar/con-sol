import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SyntaxHighlighter from "react-syntax-highlighter";
// TODO: will be replaced with altered oneDark theme from codemirror
import atomOneDark from "react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark";

function OutputContainer({ children, error }) {
	return (
		<div className={`${!error ? "border-b border-neutral-800" : ""}`}>
			{children}
		</div>
	);
}

function Output({ error, isInput, children }) {
	const style = "font-bold mr-1 mt-[0.08rem]";
	let PrependIcon;

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
		<div
			className={`flex ${
				error
					? "bg-errorDarkRed border-y-[0.1rem] border-red-500 items-baseline"
					: "items-top"
			}`}
		>
			{PrependIcon}
			<div className="pt-[0.2rem]">{children}</div>
		</div>
	);
}

/*
 * TODO:
 * - Remove syntax highlighter component, replace with readonly codemirror component that has past execution inpout value
 */
export default function ConsoleOutput({ consol }) {
	return (
		<>
			{consol.map((consol, index) => {
				return (
					<OutputContainer key={index} error={consol.error}>
						<Output isInput={true}>
							<SyntaxHighlighter
								language="javascript"
								style={atomOneDark}
								customStyle={{ background: "#1a1a1a", padding: 0 }}
							>
								{consol.input}
							</SyntaxHighlighter>
						</Output>
						{consol.output ? (
							consol.error ? (
								<Output error={true}>
									<p className="pl-1 text-errorRed">{consol.output}</p>
								</Output>
							) : (
								<Output>
									{/*
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
