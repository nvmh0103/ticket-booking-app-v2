import { Publisher, OrderCancelledEvent, Subjects} from '@mh132001tickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

}

