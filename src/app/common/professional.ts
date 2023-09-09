import { BaseResponse } from "./base-response";

export class Professional extends BaseResponse{

    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public languages: string[],
        public enabled: boolean,
        public professional: boolean,
        state: string,
        message: string
    ) {
        super(state, message);
    }
}
