import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import WalkieTalkieService from './walkie-talkie.service';
import { PCMtoWAV } from 'src/utils/walkie-talkie-handler';

export type User = {
  id: string;
  socketId: string;
};

enum EVENTS {
  TALK = 'talk',
}

const NAMESPACE = 'walkie-talkie';

@WebSocketGateway({
  cors: {
    origin: '*',
    allowedHeaders: '*',
    maxAge: 3600,
  },
  namespace: NAMESPACE,
})
export default class WalkieTalkieGateway implements OnGatewayConnection {
  constructor(private readonly walkieTalkieService: WalkieTalkieService) {}

  @WebSocketServer()
  server: Server;

  connectedUsers: User[] = [];

  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization;
    const toUser = socket.handshake.query.userId;

    if (token) {
      const user = await this.walkieTalkieService.validateUserFromToken(token);

      if (user.id === +toUser) {
        throw new WsException('A user cannot speak to itself!');
      }

      this.connectedUsers.push({ id: String(user.id), socketId: socket.id });

      socket.on('disconnect', () => {
        const connectedSocketIdx = this.connectedUsers.findIndex(
          (x) => x.socketId === socket.id,
        );

        let connectedUser = this.connectedUsers[connectedSocketIdx];

        this.connectedUsers = this.connectedUsers.filter(
          (x) => x.socketId !== connectedUser.socketId,
        );
      });
    } else {
      throw new WsException('Authentication token not provided!');
    }
  }

  @SubscribeMessage(EVENTS.TALK)
  async privateWalkieTalkie(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const targetUser = socket.handshake.query.userId;
    const uri = PCMtoWAV(data);

    const toUser = this.connectedUsers.find((x) => x.id === targetUser);

    if (!toUser) throw new WsException('Target user is not connected!');

    socket.to(toUser.socketId).emit(EVENTS.TALK, uri);
  }
}
