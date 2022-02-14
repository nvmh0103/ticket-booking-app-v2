import { Publisher, OrderCreatedEvent, Subjects} from '@mh132001tickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

}

