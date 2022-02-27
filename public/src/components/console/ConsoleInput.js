import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CodeMirror from "@uiw/react-codemirror";
import { oneDarkAltered } from "../../theme/oneDarkAltered";
import { codeMirrorDefaults } from "../../config/codeMirrorDefaults";

/*
 * TODO:
 * - Additional styling to CoreMirror theme

 * - Event handling to match console behaviour (define this better)
 * 
 * - Fix newline on enter, we're still triggering newline event inside
 * 	 the editor when we aren't expecting to.
 * 	 see: node_modules/@codemirror/commands/dist/index.cjs	
 * 
 * - If the user beaks into a newline, enable current line highlighting
 */
export default function ConsoleInput(props) {
	const { setInput, traverseListener, clearListener, executeListener, input } =
		props;

	return (
		<div className="my-1">
			<div className="w-full flex">
				<span className="text-blue-500 w-[3%] font-bold pr-1">
					<ChevronRightIcon sx={{ fontSize: 20 }} />
				</span>
				<CodeMirror
					onChange={(value, viewUpdate) => {
						/*
						 * see:
						 * - https://github.com/uiwjs/react-codemirror/blob/master/src/index.tsx#L47
						 * - https://codemirror.net/6/docs/ref/#view.ViewPlugin
						 */
						setInput(value);
					}}
					onKeyDown={(e) => {
						traverseListener(e);
						clearListener(e);
						executeListener(e);
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
