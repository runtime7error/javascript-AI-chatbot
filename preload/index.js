const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  sendMessageStream: (msg) => ipcRenderer.send("send-message-stream", msg),
  onStreamStart: (cb) => ipcRenderer.on("stream-start", cb),
  onStreamChunk: (cb) =>
    ipcRenderer.on("stream-chunk", (e, chunk) => cb(chunk)),
  onStreamEnd: (cb) => ipcRenderer.on("stream-end", cb),
  onStreamError: (cb) => ipcRenderer.on("stream-error", (e, err) => cb(err)),
});