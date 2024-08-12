import { Logger } from "@nestjs/common";
import { OnGatewayInit, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from "@nestjs/websockets";
import { Socket, Namespace } from "socket.io";
import { PollService } from "./poll.service";

@WebSocketGateway({
    namespace: 'poll',
})
export class PollGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(PollGateway.name);
    constructor(
        private readonly pollService: PollService
    ) {}
    
    @WebSocketServer() io: Namespace;
    afterInit(): void {
        this.logger.log(`Websocket gateway initialized successfully`);
    }

    handleConnection(client: Socket) {
        const sockets = this.io.sockets;

        this.logger.log(`WS client with id ${client.id} connected`);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`)

        this.io.emit('hello', `from ${client.id}`)
        
    }
    handleDisconnect(client: Socket) {
        const sockets = this.io.sockets;

        this.logger.log(`Disconnect ${client.id} `);
        this.logger.debug(`Number of connected sockets: ${sockets.size}`)

    }
}