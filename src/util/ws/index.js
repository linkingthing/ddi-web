import store from "@/store";

const baseConfig = {
  baseUrl: "/apis/ws.linkingthing.com/v1",
  hostname: "10.0.0.32",
  port: "58081"
};

function createWssUrl(resource) {
  const { port, protocol, hostname } = document.location;
  const wsProtocol = protocol.includes("s") ? "wss" : "ws";
  let wsHost = hostname;
  let wsPort = port;
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === "development") {
    wsHost = baseConfig.hostname;
    wsPort = baseConfig.port;
  }
  const wsUrl = `${wsProtocol}://${wsHost}:${wsPort}${baseConfig.baseUrl}/${resource}`;

  return wsUrl;
}

const alarmUrl = createWssUrl("alarm");
let ws = new WebSocket(alarmUrl);
ws.onopen = function () {
  console.log("连接成功 初始化");
};
ws.onmessage = function (e) {
  const { count } = JSON.parse(e.data);
  store.commit("setAlarmCount", count);
};


const agentEventmUrl = createWssUrl("agentevent");


let agenteventWs = new WebSocket(agentEventmUrl);
agenteventWs.onopen = function () {
  console.log("连接成功 初始化, agenteventWs");
};
agenteventWs.onmessage = function (e) {
  const data = JSON.parse(e.data);
  store.commit("addAgentEventList", data);
};


