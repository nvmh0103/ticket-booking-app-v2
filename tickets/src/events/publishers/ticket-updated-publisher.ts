import { Publisher, Subjects, TicketUpdatedEvent} from '@mh132001tickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}