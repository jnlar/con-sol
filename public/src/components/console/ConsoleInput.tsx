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

/*
 * FIXME:
 * - Fix newline on enter, we're still triggering newline event inside
 * 	 the editor when we aren't expecting to.
 * 	 see: node_modules/@codemirror/commands/dist/index.cjs	
 */
export default function ConsoleInput(props: IConsoleInput): JSX.Element {
	const {
		setInput,
		clearListener,
		executeListener,
		input,
	} = props;

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
						console.log(viewUpdate)
						viewUpdate.state.selection.ranges
							.filter(range => range.empty)
							.map(range => {
								// TODO:
								// - If cursor has nothing after it, dispatch the executeListener event with 'Enter' press
								//   see for implementation: https://codemirror.net/6/examples/tooltip/
								let line = viewUpdate.state.doc.lineAt(range.head)
								let pos: number[] = [line.number, (range.head - line.from)]
								console.log(pos)
							})

						setInput(value);
					}}
					onKeyDown={(e): void => {
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
