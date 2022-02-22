import { PaymentCreatedEvent, Publisher, Subjects } from "@mh132001tickets/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}