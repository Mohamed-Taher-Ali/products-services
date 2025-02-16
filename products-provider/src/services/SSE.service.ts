import { Injectable } from '@nestjs/common';
import { Observable, Observer } from 'rxjs';


@Injectable()
export class SSEService {
  private clients: any[] = [];

  addClient(client: any) {
    this.clients.push(client);
  }

  sendMessage(data: any) {
    this.clients.forEach(client => {
      client.send(JSON.stringify(data));
    });
  }

  getSseStream(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      const client = { send: (data: string) => observer.next(data) };
      this.addClient(client);

      return () => {
        this.clients = this.clients.filter(c => c !== client);
      };
    });
  }

}
