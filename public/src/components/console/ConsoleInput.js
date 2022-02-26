import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDarkAltered } from "../../theme/oneDarkAltered";
import { gutter, GutterMarker } from "@codemirror/gutter";

/*
 * FIXME:
 * Generally there's a "switch" for this kind of thing, but I haven't found it yet :^)
 * It's probably somewhere here: https://github.com/uiwjs/react-codemirror/blob/master/src/index.tsx
 */
class RemoveGutters extends GutterMarker {
	constructor() {
		return null;
	}
}

/*
 * TODO:
 * - Additional styling to CoreMirror theme
 * - Event handling to match console behaviour (define this better)
 * - Fix newline on enter, we're still triggering newline event inside
 * 	 the editor when we aren't expecting to.
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
						console.log(viewUpdate);
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
					extensions={[
						javascript(),
						gutter({
							class: "cm-gutters",
							lineMarker() {
								return new RemoveGutters();
							},
						}),
					]}
				/>
			</div>
		</div>
	);
}
