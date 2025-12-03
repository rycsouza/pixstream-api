import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket) {
    // TODO: autenticar pelo widget_token (query param) e juntar em room
  }

  handleDisconnect(client: Socket) {
    // TODO: limpar, se necessário
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.emit('pong', { ok: true });
  }

  // método helper pra enviar alert pra um canal
  sendAlertToChannel(channelId: number, payload: any) {
    // this.server.to(`channel:${channelId}`).emit('alert', payload);
  }
}
