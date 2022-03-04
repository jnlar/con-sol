import { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CodeMirror, { keymap } from "@uiw/react-codemirror";
import { oneDarkAltered } from "../../theme/oneDarkAltered";
import { codeMirrorDefaults } from "../../config/codeMirrorDefaults";
import { KeyBinding, Command } from '@codemirror/view';

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
	input
}: IConsoleInput): JSX.Element {
	const [allowedToExecute, setAllowedToExecute] = useState<boolean>(false);

	/*
	* see: 
	* - https://codemirror.net/6/docs/ref/#commands
	* - https://codemirror.net/6/docs/ref/#view.Command
	* - https://codemirror.net/6/docs/guide/
	*
	* FIXME:
	* - detect if we're inside some type of bracket, and return false so 
	*   we can continue down the command list 
	* - fix history traversal (again)
	*/
	function handleEnterKeyContext() {
		return ({ state }: any): boolean => {
			let cx: boolean = state.selection.ranges
				.filter((range: { empty: any; }) => range.empty)
				.map((range: { head: number; }) => {
					let line = state.doc.lineAt(range.head);
					let lines = state.doc.lines;
					let cursorPos = range.head - line.from;
					if (
						cursorPos === line.length &&
						lines === line.number ||
						lines === 1
					) {
						setAllowedToExecute(true);
						return true;
					} else {
						setAllowedToExecute(false);
						return false;
					}
				})
				return cx;
		}
	}

	const enterKeyAlter: readonly KeyBinding[] = [
		{ key: "Enter", run: handleEnterKeyContext() }
	]

	return (
		<div className="my-1">
			<div className="w-full flex">
				<span className="text-blue-500 w-[2.4%] font-bold">
					<ChevronRightIcon sx={{ fontSize: 20 }} />
				</span>
				<CodeMirror
					onChange={(value: string): void => {
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
					extensions={[
						keymap.of([
							...enterKeyAlter,
						]),
						codeMirrorDefaults,
					]}
				/>
			</div>
		</div>
	);
}
