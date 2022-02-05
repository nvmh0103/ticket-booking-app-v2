import { Publisher, Subjects, TicketCreatedEvent} from '@mh132001tickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}