// Utils
import { Dispatch } from 'react';
import { MessageAction } from '../../state/types';
import { createJWT } from '../../utils/helpers';

export interface DeviceJson {
  id: string;
  name: string;
  address: string;
  port: string;
  password: string;
}

class Device {
  id: string;
  name: string;
  address: string;
  port: string;
  password: string;
  private websocket: WebSocket | null;

  constructor(args: DeviceJson) {
    this.id = args.id;
    this.name = args.name;
    this.address = args.address;
    this.port = args.port;
    this.password = args.password;
    this.websocket = null;
  }

  async openWebSocketConnection(messageDispatch: Dispatch<MessageAction>) {
    const jwt = await createJWT(this.password);
    const client = new WebSocket(`${this.url()}/api/ws`, [], {
      headers: { authorization: `Bearer ${jwt}` },
    });
    client.onopen = () => {
      client.send('9,0,0,0');
    };
    // eslint-disable-next-line no-undef
    client.onclose = (e: WebSocketCloseEvent) => {
      if (e.code && e.code === 1011) {
        messageDispatch({
          type: 'ADD_MESSAGE',
          value: e.reason
            ? `Connection closed: ${e.reason}`
            : 'Connection closed : Reason unknown',
        });
      }
    };
    this.websocket = client;
  }

  closeWebSocketConnection() {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  sendWebSocket(data: string) {
    if (this.websocket && this.websocket.readyState === 1) {
      this.websocket.send(data);
    }
  }

  toJSON(): DeviceJson {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      port: this.port,
      password: this.password,
    };
  }

  url(): string {
    return `http://${this.address}:${this.port}`;
  }
}

export default Device;
