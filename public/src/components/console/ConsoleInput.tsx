import { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror";
import { oneDarkAltered } from "../../theme/oneDarkAltered";
import { codeMirrorDefaults } from "../../config/codeMirrorDefaults";

interface IConsoleInput {
	setInput: any;
	traverseListener: any;
	clearListener: any;
	executeListener: any,
	input: string,
}

export default function ConsoleInput({
	setInput, 
	clearListener, 
	executeListener, 
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
								 * If the cursor has nothing after it, and we're at the last line, allow execution
								 * 	see: https://codemirror.net/6/examples/tooltip/
								 *	     node_modules/@codemirror/text/dist/index.d.ts
								 * 
								 * TODO: 
								 * - If there's only one line, and we aren't at range.head, still allow execution anyway.
								 *   We'll also need customise our own keymap feature. 
								 *   see: node_modules/@codemirror/commands/dist/index.js
								 */        
								let line = viewUpdate.state.doc.lineAt(range.head);
								let lines: number = viewUpdate.state.doc.lines;
								if (/* position of cursor */(range.head - line.from) === line.length) {
									if (line.number === lines) {
										setAllowedToExecute(true);
										setAllowedToTraverseForward(true);
									} 
								} else {
									setAllowedToExecute(false);
									setAllowedToTraverseForward(false);
								}
							})
						setInput(value);
					}}
					onKeyDown={(e): void => {
						clearListener(e);
						if (allowedToExecute) executeListener(e);
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
