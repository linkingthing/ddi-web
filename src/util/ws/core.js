const baseConfig = {
  baseUrl: "/apis/ws.linkingthing.com/v1"
};
const {port, protocol, host} = document.location;
const wsProtocol = protocol.includes("s") ? "wss" : "ws";
console.log(`${wsProtocol}://${host}:${port}${baseConfig.baseUrl}`)
const wsUrl = `${wsProtocol}://127.0.0.1:${port}${baseConfig.baseUrl}`;
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
