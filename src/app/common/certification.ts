export class Certification{
    constructor(
        public id: number,
        public name: string,
        public verified: boolean,
        public status: string,
        public attachments: any[],
        public profileVisibility: boolean,
    ) {
    }
}