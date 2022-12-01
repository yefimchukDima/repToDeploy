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

type RequestBody = {
  targetId: number;
  audio: string;
};

enum EVENTS {
  TALK = 'talk',
  LISTEN = 'listen',
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

    if (token) {
      const user = await this.walkieTalkieService.validateUserFromToken(token);

      const alreadyConnected = this.connectedUsers.find(
        (x) => +x.id === user.id,
      );

      if (alreadyConnected) {
        alreadyConnected.socketId = socket.id;
        this.connectedUsers.push(alreadyConnected);
      } else {
        this.connectedUsers.push({ id: String(user.id), socketId: socket.id });
      }

      socket.on('disconnect', () => {
        this.connectedUsers = this.connectedUsers.filter(
          (x) => x.socketId !== socket.id,
        );
      });
    } else {
      throw new WsException('Authentication token not provided!');
    }
  }

  @SubscribeMessage(EVENTS.TALK)
  async privateWalkieTalkie(
    @MessageBody() data: RequestBody,
    @ConnectedSocket() socket: Socket,
  ) {
    if (!data.audio) throw new WsException('No audio string provided!');
    if (!data.targetId) throw new WsException('No user id provided!');
    if (typeof data.audio !== 'string')
      throw new WsException('Audio must be a string!');
    if (typeof data.targetId !== 'number')
      throw new WsException('Audio must be a number!');

    const uri = PCMtoWAV(data.audio);
    const toUser = this.connectedUsers.find((x) => +x.id === data.targetId);

    if (!toUser) throw new WsException('Target user is not connected!');

    socket.to(toUser.socketId).emit(EVENTS.LISTEN, uri);
  }
}
