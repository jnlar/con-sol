import { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CodeMirror, { EditorState, keymap } from "@uiw/react-codemirror";
import { oneDarkAltered } from "../../theme/oneDarkAltered";
import { codeMirrorDefaults } from "../../config/codeMirrorDefaults";
import { KeyBinding } from '@codemirror/view';

interface IConsoleInput {
	setInput: any;
	clearListener: any;
	executeListener: any,
	traverseListener: any;
	input: string,
}

/*
* isBetweenBrackets isn't exported, so we just took logic we need
*
* see: 
* - https://github.com/codemirror/commands/blob/main/src/commands.ts#L595
*/
function isBetweenBrackets(state: EditorState, pos: number): boolean {
	return (/\(\)|\[\]|\{\}/.test(state.sliceDoc(pos - 1, pos + 1))) || false;
}

/*
* see: 
* - https://codemirror.net/6/docs/ref/#commands
* - https://codemirror.net/6/docs/ref/#view.Command
* - https://codemirror.net/6/docs/guide/
*/
function handleEnterKeyContext(
	setAllowedToExecute: React.Dispatch<React.SetStateAction<boolean>>
): ({ state }: any) => boolean {
	let context: boolean;
	return ({ state }) => {
		state.selection.ranges
			.filter((range: { empty: any; }): any => range.empty)
			.map((range: { head: number; }): void => {
				let line = state.doc.lineAt(range.head);
				let lines = state.doc.lines;
				let cursorPos = range.head - line.from;
				let atEndOfText = cursorPos === line.length && lines === line.number
				context = 
					atEndOfText || (lines === 1 || line.number === 1) 
					&& !isBetweenBrackets(state, cursorPos) 
					? true : false
			})
		setAllowedToExecute(context);
		return context;
	}
}

export default function ConsoleInput({
	setInput, 
	clearListener, 
	executeListener, 
	input
}: IConsoleInput): JSX.Element {
	const [allowedToExecute, setAllowedToExecute] = useState<boolean>(false);

	const enterKeyAlter: readonly KeyBinding[] = [
		{ key: "Enter", run: handleEnterKeyContext(setAllowedToExecute) }
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
