let ws = {
	getMessage() {}
};
let count = 0;
const baseConfig = {
	timer: null,
	baseUrl: '/apis/ws.linkingthing.com/v1',
	resource: 'alarm',
	reconnectNumber: 3,
	reconnectDelay: 0
};
const { port, protocol, hostname } = document.location;
const wsProtocol = protocol.includes('s') ? 'wss' : 'ws';
const wsHost = process.env.NODE_ENV === 'development' ? '10.0.0.90' : hostname;
const wsUrl = `${wsProtocol}://${wsHost}:${port}${baseConfig.baseUrl}/${baseConfig.resource}`;
console.log(process.env.NODE_ENV, wsUrl);

ws = new WebSocket(`${wsUrl}`);

ws.onopen = function() {
	console.log('连接成功 初始化');
};
ws.onmessage = function(e) {
	console.log(e);
	ws.getMessage && ws.getMessage(JSON.parse(e.data));
};
ws.onerror = function(e) {
	console.log(e);
};
ws.onclose = function(e) {
	console.log(e);
	clearInterval(baseConfig.timer);
	baseConfig.timer = setInterval(() => {
		count++;

		if (count < baseConfig.reconnectNumber) {
			console.log('重连中...');
			ws = new WebSocket(`${wsUrl}`);
			ws.onopen = function() {
				console.log('重连成功 重连');
				count = 0;
				clearInterval(baseConfig.timer);
			};
		} else {
			clearInterval(baseConfig.timer);
		}
	}, 3000);
};

export default ws;
