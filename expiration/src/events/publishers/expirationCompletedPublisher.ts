import { ExpirationCompletedEvent, Publisher, Subjects } from "@vhticketing/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent>{
  readonly subject = Subjects.ExpirationCompleted;
}