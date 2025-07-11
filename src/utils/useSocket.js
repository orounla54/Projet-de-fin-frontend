import { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { socketBaseURL } from "./DataFront/eventTypes";

// const url = socketBaseURL;
// let socket;

const useSocket = () => {
  // const [isConnected, setIsConnected] = useState(false);

  // useEffect(() => {
  //   if (!socket) {
  //     socket = io(url, {
  //       transports: ["websocket", "polling"],
  //       reconnection: true,
  //       reconnectionAttempts: 5,
  //       reconnectionDelay: 1000,
  //       timeout: 10000,
  //     });
  //   }

  //   socket.on("connect", () => {
  //     console.log("✅ Connecté :", socket.id);
  //     setIsConnected(true);
  //   });

  //   socket.on("connect_error", (err) => {
  //     console.log("Erreur de connexion WebSocket :", err);
  //   });

  //   socket.on("connect_timeout", () => {
  //     console.log("Le délai de connexion a expiré");
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("❌ Déconnecté :", socket.id);
  //     setIsConnected(false);
  //   });

  //   return () => {
  //     if (socket) {
  //       socket.disconnect();
  //       console.log("🔴 Socket fermé proprement");
  //     }
  //   };
  // }, [url]);

  // useEffect(() => {
  //   if (socket && !socket.connected) {
  //     console.log("Reconnexion manuelle...");
  //     socket.connect();
  //   }
  // }, [socket, !isConnected]);

  // return { socket, isConnected };
  return { socket: null, isConnected: false };
};

export default useSocket;
