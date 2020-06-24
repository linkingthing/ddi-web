const baseConfig = {
  baseUrl: "/apis/ws.linkingthing.com/v1"
};
const {port, protocol, host} = document.location;
const wsProtocol = protocol.includes("s") ? "wss" : "ws";
const wsHost = process.env.NODE_ENV === "development" ? "127.0.0.1" : host;
const wsUrl = `${wsProtocol}://${wsHost}:${port}${baseConfig.baseUrl}`;
console.log(process.env.NODE_ENV, wsUrl)

function ws(resource) {
  const ws = new WebSocket(`${wsUrl}/${resource}`); 
  ws.onmessage = function (e) {
    console.log(e);
    ws.getMessage && ws.getMessage(JSON.parse(e.data));
  };
  ws.onerror = function (e) {
    console.log(e);
  };

  return ws;
}

export default ws;
