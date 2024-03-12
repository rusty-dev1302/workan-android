export class ProcessOrderRequest {
    constructor(
        public orderId: number,
        public customerId: number|null,
        public professionalId: number|null,
        public action: string,
        public otp: string,
        public cancellationReason: string
    ) { }
}