import { Subjects } from "..";

export interface ExpirationData {
  orderId: string;
}

export interface ExpirationCompletedEvent {
  subject: Subjects.ExpirationCompleted;
  data: ExpirationData;
}
