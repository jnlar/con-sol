export default function ConsoleInputContainer({ children }: any): JSX.Element {
	return (
		<div
			id="input-container"
			className="bg-darkThree text-tiny w-full h-full overflow-auto scroll"
		>
			{children}
		</div>
	);
}
