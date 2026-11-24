import { Injectable } from '@angular/core';

export interface AppNotification {
  title: string;
  date: string;
  details: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private readonly notifications: AppNotification[] = [
    { title: 'Process Audit', date: '06/07/2026', details: 'Commodity - Casting' },
    { title: 'Parts Audit', date: '01/07/2026', details: 'Commodity - Forging' },
    { title: 'Process Audit', date: '05/07/2026', details: 'Commodity - Machining' },
    { title: 'Parts Audit', date: '03/07/2026', details: 'Commodity - Fasteners' },
    { title: 'Process Audit', date: '02/07/2026', details: 'Commodity - Sheet Metal' }
  ];

  public getNotifications(): AppNotification[] {
    return this.notifications;
  }
}
