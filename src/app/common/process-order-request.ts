export class ProcessOrderRequest {
    constructor(
        public orderId: number,
        public customerId: number,
        public professionalId: number,
        public action: string,
        public otp: string
    ) { }
}