import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import main from "./api.js";
import { error } from "console";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (client) => {
  console.log("user connected");

  // receiving msg
  client.on("message", (msg) => {
    // logging the message
    console.log("message received: " + msg);

    // calling the langflow api call
    (async () => {
      try {
        const result = await main(msg);
        client.emit("message", { status: "ok", res: result, error: "" });
      } catch (error) {
        client.emit("message", {
          status: "fail",
          res: "",
          error: `Error occured in socket: ${error.message}`,
        });
      }
    })();

    // reply the answer given by langflow.
  });

  client.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(process.env.port, () =>
  console.log(`server is listeing on http://localhost:${process.env.port}`)
);
