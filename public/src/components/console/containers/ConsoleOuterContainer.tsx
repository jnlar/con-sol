import ConsoleHeader from "../ConsoleHeader";

export default function ConsoleOuterContainer({ children }: any): JSX.Element {
	return (
		<div className="w-8/12 m-auto">
			<div className="m-10">
				<div className="shadow-sm shadow-neutral-900">
					<ConsoleHeader />
					<div className="flex h-[801px]">{children}</div>
				</div>
			</div>
		</div>
	);
}
