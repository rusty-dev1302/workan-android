import { Listing } from "./listing";
import { SlotTemplateItem } from "./slot-template-item";

export class SlotTemplate {
    constructor(
        public id: number,
        public enabled: boolean,
        public listing: Listing,
        public dayName: string,
        public items: SlotTemplateItem[]
    ) {
    }
}