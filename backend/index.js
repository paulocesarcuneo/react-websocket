const express = require("express");
const WebSocket = require("ws");

const app = express();

const websocketServer = new WebSocket.Server({ noServer: true });

function broadcast(client) {
  return (data) => {
    console.log(data);
    websocketServer.clients.forEach((thatClient) => {
      if (thatClient !== client && thatClient.readyState === WebSocket.OPEN) {
        thatClient.send(data);
      }
    });
  };
}

websocketServer.on(
  "connection", //
  (client) => client.on("message", broadcast(client))
);

// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(3000);
server.on(
  "upgrade", //
  (request, socket, head) => {
    websocketServer.handleUpgrade(
      request,
      socket,
      head, //
      (socket) => websocketServer.emit("connection", socket, request)
    );
  }
);
