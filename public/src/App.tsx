import { useState } from "react";
import axios, { AxiosResponse } from "axios";
axios.defaults.withCredentials = true;

import ConsoleInput from "./components/console/ConsoleInput";
import ConsoleInputContainer from "./components/console/containers/ConsoleInputContainer";
import ConsoleOutput from "./components/console/ConsoleOutput";
import ConsoleOuterContainer from "./components/console/containers/ConsoleOuterContainer";
import { Traverse, AddCommand } from "./util/command";

export interface IConsole {
	input?: string;
	output?: string;
	error?: boolean;
}

const traverse = new Traverse();
const scrollToBottom = (node: HTMLElement | null): number => (node!.scrollTop = node!.scrollHeight);

function doCallback(callback: () => void): void | null {
	return typeof callback === "function" ? callback() : null;
}

// FIXME:
// - fix consol traversal on up/down
export default function App(): JSX.Element {
	const inputContainer: HTMLElement | null = document.getElementById("input-container");
	const [input, setInput] = useState<string>("");
	const [consol, setConsol] = useState<IConsole[]>([]);
	const [firstTraversal, setFirstTraversal] = useState<boolean>(true);

	function clearListener(e: KeyboardEvent): void {
		if (e.key === "l" && e.ctrlKey) {
			e.preventDefault();
			setConsol([]);
		}
	}

	function traverseListener(e: KeyboardEvent): void {
		if (e.key === "ArrowUp") {
			return traverseBack();
		} else if (e.key === "ArrowDown") {
			return traverseForward();
		}
	}

	function executeListener(e: KeyboardEvent): void {
		let wantNewLine: boolean = e.key === "Enter" && e.shiftKey;
		if (e.key === "Enter" && !wantNewLine) executeInput();
	}

	function canTraverseBack(callback: () => void): void | null {
		if (consol.length) {
			if (traverse.position !== consol.length) {
				return doCallback(callback);
			}
		}

		throw new Error(
			`Cannot traverse back: Already at earliest point in input history`
		);
	}

	function canTraverseForward(callback: () => void): void | null {
		if (traverse.position !== 1) {
			return doCallback(callback);
		}

		throw new Error(
			`Cannot traverse forward: already at latest point in history`
		);
	}

	function traverseBack(): void {
		if (firstTraversal) {
			canTraverseBack((): void => {
				setFirstTraversal(false);
				return setInputToHistory(1);
			});
		} else {
			canTraverseBack(() : void => {
				traverse.executeCommand(new AddCommand(1));
				let position: number = traverse.position;
				return setInputToHistory(position);
			});
		}
	}

	function traverseForward(): void {
		canTraverseForward((): void => {
			traverse.undo();
			let position: number = traverse.position;
			return setInputToHistory(position);
		});
	}

	function setInputToHistory(position: number): void {
		return setInput(String(consol[consol.length - position].input));
	}

	async function executeInput(): Promise<any> {
		setInput("");

		if (input === "clear") {
			return setConsol([]);
		}

		try {
			let res: AxiosResponse<any> = await axios.post(`http://localhost:8080/api`, {
				run: `${input}`,
			});

			setConsol((prevState) => [
				...prevState,
				{
					input: input,
					output: res.data.result || res.data.error,
					error: Boolean(res.data.error),
				},
			]);

			return scrollToBottom(inputContainer);
		} catch (err: any) {
			throw new Error(err);
		}
	}

	return (
		<>
			<h1 className="pt-5 text-center">Con-Sol</h1>
			<ConsoleOuterContainer>
				<ConsoleInputContainer>
					<ConsoleOutput consol={consol} />
					<ConsoleInput
						setInput={setInput}
						traverseListener={traverseListener}
						clearListener={clearListener}
						executeListener={executeListener}
						input={input}
					/>
				</ConsoleInputContainer>
			</ConsoleOuterContainer>
		</>
	);
}
