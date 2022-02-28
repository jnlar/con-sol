import { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { oneDarkAltered } from "../../theme/oneDarkAltered";
import { codeMirrorDefaults } from "../../config/codeMirrorDefaults";

interface IConsoleInput {
	setInput: any;
	clearListener: any;
	executeListener: any,
	traverseListener: any;
	input: string,
}

export default function ConsoleInput({
	setInput, 
	clearListener, 
	executeListener, 
	traverseListener,
	input
}: IConsoleInput): JSX.Element {
	const [allowedToExecute, setAllowedToExecute] = useState<boolean>(false);
	const [allowedToTraverseForward, setAllowedToTraverseForward] = useState<boolean>(false);
	const [allowedToTraverseBackward, setAllowedToTraverseBackward] = useState<boolean>(false);

	return (
		<div className="my-1">
			<div className="w-full flex">
				<span className="text-blue-500 w-[3%] font-bold pr-1">
					<ChevronRightIcon sx={{ fontSize: 20 }} />
				</span>
				<CodeMirror
					/*
					 * see:
					 * - https://github.com/uiwjs/react-codemirror/blob/master/src/index.tsx#L47
					 * - https://codemirror.net/6/docs/ref/#view.ViewPlugin
					 */
					onChange={(value: string, viewUpdate: ViewUpdate): void => {
						viewUpdate.state.selection.ranges
							.filter(range => range.empty)
							.map(range => {
								/*
								 * 	see: 
								 *	- https://codemirror.net/6/examples/tooltip/
								 *	- node_modules/@codemirror/text/dist/index.d.ts
								 * 
								 * TODO: 
								 * - If there's only one line, and we aren't at range.head, still allow execution anyway.
								 *   see: node_modules/@codemirror/commands/dist/index.js
								 * - Going from e.g line 2 to line 1 using the cursor doesn't update line.number state,
								 *   so for e.g a typing in: 
								 *   	'let obj = {
								 * 			| <cursor is here> 	
								 *   	}'
								 * 	 and then pressing the up arrow twice, won't let you traverse backward
								 */        
								let line = viewUpdate.state.doc.lineAt(range.head);
								let lines: number = viewUpdate.state.doc.lines;
								let cursorPos: number = range.head - line.from;
								if (cursorPos === line.length) {
									if (line.number === lines) {
										setAllowedToExecute(true);
										setAllowedToTraverseForward(true);
									} 
								} else {
									setAllowedToExecute(false);
									setAllowedToTraverseForward(false);
								}
								// Shouldn't matter where we are on the first line, allow for backward traversal 
								if (line.number === 1) {
									setAllowedToTraverseBackward(true);
								} else {
									setAllowedToTraverseBackward(false);
								}
							})
						setInput(value);
					}}
					onKeyDown={(e): void => {
						clearListener(e);
						if (allowedToExecute) executeListener(e);
						if (allowedToTraverseForward || allowedToTraverseBackward) traverseListener(e)
					}}
					className="w-[97%]"
					value={input}
					theme={oneDarkAltered}
					basicSetup={false}
					extensions={[codeMirrorDefaults]}
				/>
			</div>
		</div>
	);
}
