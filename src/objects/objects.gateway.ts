import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ObjectsGateway {
  @WebSocketServer()
  server: Server;
  emitObjectCreated(payload: any) {
    this.server.emit('objectCreated', payload);
  }
}