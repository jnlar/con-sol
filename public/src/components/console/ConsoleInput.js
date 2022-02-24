import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function ConsoleInput(props) {
	const { setInput, traverseListener, clearListener, executeListener, input } =
		props;

	return (
		<span className="w-full">
			<span className="text-blue-500 w-[5%] font-bold pr-1">
				<ChevronRightIcon sx={{ fontSize: 20 }} />
			</span>
			<input
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={(e) => {
					traverseListener(e);
					clearListener(e);
					executeListener(e);
				}}
				className="bg-neutral-900 focus:outline-none caret-neutral-700 w-[90%]"
				value={input}
				type="text"
				autoComplete="off"
				autoCorrect="off"
				spellCheck={false}
			/>
		</span>
	);
}
