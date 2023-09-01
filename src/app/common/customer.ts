import { BaseResponse } from "./base-response";

export class Customer extends BaseResponse{

    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public gender: string,
        public mobile: number,
        public email: string,
        public languages: string[],
        public enabled: boolean,
        public professional: boolean,
        state: string,
        message: string
    ) {
        super(state, message);
    }
}
