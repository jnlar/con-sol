import {
	highlightSpecialChars,
	drawSelection,
	dropCursor,
	highlightActiveLine,
	keymap,
} from "@codemirror/view";
export { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
export { EditorState } from "@codemirror/state";
import { history, historyKeymap } from "@codemirror/history";
import { foldKeymap } from "@codemirror/fold";
import { indentOnInput } from "@codemirror/language";
import { defaultKeymap } from "@codemirror/commands";
import { bracketMatching } from "@codemirror/matchbrackets";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { commentKeymap } from "@codemirror/comment";
import { rectangularSelection } from "@codemirror/rectangular-selection";
import { defaultHighlightStyle } from "@codemirror/highlight";
import { lintKeymap } from "@codemirror/lint";
import { javascript } from "@codemirror/lang-javascript";

/*
 * When we are on the first line, allow execution  
 *
 * TODO:
 * - 
 */
function handleFirstLineExecute() {
	return ({ state }) => {
		let ce;
		state.selection.ranges
		.filter(range => range.empty)
		.map(range => {
			let line = state.doc.lineAt(range.head);
			let lines = state.doc.lines;
			let cursorPos = range.head - line.from;
			// If we're at the first line, or the cursor is at the end
			// of the last line, allow execution
			cursorPos === line.length && lines === line.number || lines === 1 ? ce = true : ce = false;
			console.log(ce)
		})
		return ce;
	}
}

const customKeyMap = [
	{ key: "Enter", run: handleFirstLineExecute() }
]

/**
This is an extension value that just pulls together a whole lot of
extensions that you might want in a basic editor. It is meant as a
convenient helper to quickly set up CodeMirror without installing
and importing a lot of packages.

Specifically, it includes...

 - [the default command bindings](https://codemirror.net/6/docs/ref/#commands.defaultKeymap)
 - [special character highlighting](https://codemirror.net/6/docs/ref/#view.highlightSpecialChars)
 - [the undo history](https://codemirror.net/6/docs/ref/#history.history)
 - [custom selection drawing](https://codemirror.net/6/docs/ref/#view.drawSelection)
 - [drop cursor](https://codemirror.net/6/docs/ref/#view.dropCursor)
 - [multiple selections](https://codemirror.net/6/docs/ref/#state.EditorState^allowMultipleSelections)
 - [reindentation on input](https://codemirror.net/6/docs/ref/#language.indentOnInput)
 - [the default highlight style](https://codemirror.net/6/docs/ref/#highlight.defaultHighlightStyle) (as fallback)
 - [bracket matching](https://codemirror.net/6/docs/ref/#matchbrackets.bracketMatching)
 - [bracket closing](https://codemirror.net/6/docs/ref/#closebrackets.closeBrackets)
 - [autocompletion](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion)
 - [rectangular selection](https://codemirror.net/6/docs/ref/#rectangular-selection.rectangularSelection)
 - [active line highlighting](https://codemirror.net/6/docs/ref/#view.highlightActiveLine)
 - [active line gutter highlighting](https://codemirror.net/6/docs/ref/#gutter.highlightActiveLineGutter)
 - [selection match highlighting](https://codemirror.net/6/docs/ref/#search.highlightSelectionMatches)
 - [search](https://codemirror.net/6/docs/ref/#search.searchKeymap)
 - [commenting](https://codemirror.net/6/docs/ref/#comment.commentKeymap)
 - [linting](https://codemirror.net/6/docs/ref/#lint.lintKeymap)

(You'll probably want to add some language package to your setup
too.)

This package does not allow customization. The idea is that, once
you decide you want to configure your editor more precisely, you
take this package's source (which is just a bunch of imports and
an array literal), copy it into your own code, and adjust it as
desired.
*/
const codeMirrorDefaults = [
	/*@__PURE__*/ highlightSpecialChars(),
	/*@__PURE__*/ history(),
	/*@__PURE__*/ javascript(),
	/*@__PURE__*/ drawSelection(),
	/*@__PURE__*/ dropCursor(),
	/*@__PURE__*/ EditorState.allowMultipleSelections.of(true),
	/*@__PURE__*/ indentOnInput(),
	defaultHighlightStyle.fallback,
	/*@__PURE__*/ bracketMatching(),
	/*@__PURE__*/ closeBrackets(),
	/*@__PURE__*/ autocompletion(),
	/*@__PURE__*/ rectangularSelection(),
	/*@__PURE__*/ highlightActiveLine(),
	/*@__PURE__*/ highlightSelectionMatches(),
	/*@__PURE__*/ keymap.of([
		//...customKeyMap,
		...closeBracketsKeymap,
		...defaultKeymap,
		...searchKeymap,
		...historyKeymap,
		...foldKeymap,
		...commentKeymap,
		...completionKeymap,
		...lintKeymap,
	]),
];

export { codeMirrorDefaults };
