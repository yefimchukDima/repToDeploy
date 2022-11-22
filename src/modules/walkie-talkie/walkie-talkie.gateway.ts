import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import WalkieTalkieService from './walkie-talkie.service';
import * as bcrypt from 'bcrypt';
import { PCMtoWAV } from 'src/utils/walkie-talkie-handler';

export type User = {
  id: string;
  socketId: string;
};

export type SocketProps = {
  room?: string;
  users?: User[];
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

  connectedSocketsMapping: SocketProps[] = [];

  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization;
    const toUser = socket.handshake.query.userId;

    if (token) {
      const user = await this.walkieTalkieService.validateUserFromToken(token);

      // If user ID is equal to target user, disconnect
      if (user.id === +toUser) {
        socket.disconnect();
      }

      const alreadyInRoom = this.connectedSocketsMapping.find((x) =>
        x.users.find((y) => +y.id === user.id),
      );

      if (alreadyInRoom) socket.join(alreadyInRoom.room);

      // If target user is already in a room
      const toUserInRoom = this.connectedSocketsMapping.find((x) =>
        x.users.find((y) => y.id === toUser),
      );

      /* 
        If the target user is already in a room, add to the array and
        join the socket to that room
      */
      if (toUserInRoom) {
        // If the room is full, disconnect
        if (toUserInRoom.users.length === 2) socket.disconnect();

        this.connectedSocketsMapping = this.connectedSocketsMapping.map((x) => {
          if (x.room === toUserInRoom.room) {
            x.users = [
              ...x.users,
              {
                socketId: socket.id,
                id: String(user.id),
              },
            ];
          }

          return x;
        });

        socket.join(toUserInRoom.room);
      } else {
        // Room ID
        const generateRoom = await bcrypt.hash(String(user.id), 10);

        this.connectedSocketsMapping.push({
          room: generateRoom,
          users: [
            {
              socketId: socket.id,
              id: String(user.id),
            },
          ],
        });

        socket.join(generateRoom);
      }

      socket.on('disconnect', () => {
        // Remove socket from array
        const connectedSocketIdx = this.connectedSocketsMapping.findIndex((x) =>
          x.users.find((y) => y.socketId === socket.id),
        );

        const connectedSocket = this.connectedSocketsMapping.find((x) =>
          x.users.find((y) => y.socketId === socket.id),
        );

        if (connectedSocket.users.length === 1) {
          this.connectedSocketsMapping = this.connectedSocketsMapping.filter(
            (x) => x !== connectedSocket,
          );
        } else {
          let connectedSocketUsers =
            this.connectedSocketsMapping[connectedSocketIdx].users;

          connectedSocket.users = connectedSocketUsers.filter(
            (x) => x.socketId !== socket.id,
          );
        }
      });
    } else {
      socket.disconnect();
    }
  }

  @SubscribeMessage(EVENTS.TALK)
  async privateWalkieTalkie(
    @MessageBody() data: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const uri = PCMtoWAV(data);

    const room = this.connectedSocketsMapping.find((x) =>
      x.users.find((y) => y.socketId === socket.id),
    );

    const toUser = room.users.find((x) => x.socketId !== socket.id);

    if (room) socket.to(toUser.socketId).emit(EVENTS.TALK, uri);
  }
}
