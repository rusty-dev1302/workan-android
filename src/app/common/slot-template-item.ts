import { BaseResponse } from "./base-response";

export class SlotTemplateItem extends BaseResponse{
    constructor(
        public id: number,
        public slotTemplateId: number,
        public startTimeHhmm: number,
        public endTimeHhmm: number,
        state: string,
        message: string
    ) {
        super(state, message)
    }
}