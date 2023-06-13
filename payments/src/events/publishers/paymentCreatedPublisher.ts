import { PaymentCreatedEvent, Publisher, Subjects } from "@vhticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}