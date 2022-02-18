import { Subjects, Publisher, ExpirationCompleteEvent } from '@mh132001tickets/common';


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}