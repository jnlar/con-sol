export class Traverse {
  constructor() {
    this.position = 1;
    this.history = [];
  }

  executeCommand(command) {
    this.position = command.execute(this.position);
    this.history.push(command);
  }

  undo() {
    const command = this.history.pop();
    this.position = command.undo(this.position);
  }
}

export class AddCommand {
  constructor(newPosition) {
    this.newPosition = newPosition;
  }

  execute(currentValue) {
    return currentValue + this.newPosition;
  }

  undo(currentValue) {
    return currentValue - this.newPosition;
  }
}