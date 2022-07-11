export class QueryBusMock {

    executed: any;

    execute(command: any) {
        this.executed = command;
    }

}