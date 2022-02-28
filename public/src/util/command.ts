export class Traverse {
	position: number;
	history: any[];

	constructor() {
		this.position = 1;
		this.history = [];
	}

	executeCommand(command: any): void {
		this.position = command.execute(this.position);
		this.history.push(command);
	}

	undo(): void {
		const command: any = this.history.pop();
		this.position = command.undo(this.position);
	}
}

export class AddCommand {
	newPosition: number;

	constructor(newPosition: number) {
		this.newPosition = newPosition;
	}

	execute(currentValue: number): any {
		return currentValue + this.newPosition;
	}

	undo(currentValue: number): number {
		return currentValue - this.newPosition;
	}
}
