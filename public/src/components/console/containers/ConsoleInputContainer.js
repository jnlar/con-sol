import React from "react";

export default function ConsoleInputContainer(props) {
	return (
		<div
			id="input-container"
			className="bg-neutral-900 text-tiny w-full rounded-bl-md h-full overflow-auto scroll"
		>
			{props.children}
		</div>
	);
}
