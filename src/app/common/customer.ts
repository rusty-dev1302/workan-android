import { FileHandle } from "../model/file-handle.model";

export class Customer {

    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public gender: string,
        public mobile: number,
        public email: string,
        public languages: string[],
    ) {}
}
