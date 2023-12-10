import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
  
@WebSocketGateway({
    cors: {
      origin: '*',
    },
})
export class PaymentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

handleConnection(client: Socket, ...args: any[]) {
    const SECRET_KEY = process.env.JWT_SECRET
    
    const token = Array.isArray(client.handshake.query.token)
      ? client.handshake.query.token[0]
      : client.handshake.query.token;

    if (typeof token !== 'string') {
      client.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      
      if (typeof decoded !== 'object' || !('id' in decoded)) {
        throw new Error('Invalid token payload');
      }
      const userId = (decoded as any).id;

      client.data.userId = userId;
      client.join(userId); 
      console.log(`Client connected with userId: ${userId}`);

    } catch (error) {
      console.error('Authentication error:', error.message);
      client.disconnect(); // В случае ошибки отключаем клиента
    }
  }

handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
}
    
notifyPaymentCreated(userId: string, paymentId: string) {
    this.server.to(userId).emit('paymentCreated', paymentId);
}
}
  