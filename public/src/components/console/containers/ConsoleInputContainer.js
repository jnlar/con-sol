import React from "react";

export default function ConsoleInputContainer(props) {
	return (
		<div
			id="input-container"
			className="bg-darkThree text-tiny w-full h-full overflow-auto scroll"
		>
			{props.children}
		</div>
	);
}
