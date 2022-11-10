import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import ChatService from './chat.service';
import * as bcrypt from 'bcrypt';

export type User = {
  id: string;
  socketId: string;
};

export type SocketProps = {
  room?: string;
  users?: User[];
};

const NAMESPACE = 'chat';

enum EVENTS {
  SEND_MESSAGE = 'send_message',
  SEND_ALL_MESSAGES = 'send_all_messages',
  GET_MESSAGE = 'get_message',
  REQUEST_ALL_MESSAGES = 'request_all_messages',
}

@WebSocketGateway({
  cors: {
    origin: '*',
    allowedHeaders: '*',
    maxAge: 3600,
  },
  namespace: NAMESPACE,
})
export default class ChatGateway implements OnGatewayConnection {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  connectedSocketsMapping: SocketProps[] = [];

  async handleConnection(socket: Socket): Promise<void> {
    const token = socket.handshake.headers.authorization;
    const toUser = socket.handshake.query.userId;

    if (token) {
      const user = await this.chatService.validateUserFromToken(token);

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

  @SubscribeMessage(EVENTS.SEND_MESSAGE)
  async sendPrivateMessage(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const room = this.connectedSocketsMapping.find((x) =>
      x.users.find((y) => y.socketId === socket.id),
    );

    if (room) {
      const token = socket.handshake.headers.authorization;
      const author = await this.chatService.validateUserFromToken(token);
      const message = await this.chatService.saveMessage(
        content,
        author,
        room.room,
      );

      delete message.author.password;

      this.server.to(room.room).emit(EVENTS.GET_MESSAGE, message);
    }
  }

  @SubscribeMessage(EVENTS.REQUEST_ALL_MESSAGES)
  async requestAllMessages(@ConnectedSocket() socket: Socket): Promise<void> {
    const room = this.connectedSocketsMapping.find((x) =>
      x.users.find((y) => y.socketId === socket.id),
    );

    if (room && room.users.find((x) => x.socketId === socket.id)) {
      const messages = await this.chatService.getAllMessagesByRoom(room.room);

      this.server.to(room.room).emit(EVENTS.SEND_ALL_MESSAGES, messages);
    }
  }
}
