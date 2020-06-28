let count = 0;
const baseConfig = {
	baseUrl: '/apis/ws.linkingthing.com/v1',
	reconnectNumber: 3,
	reconnectDelay: 0
};
const { port, protocol, hostname } = document.location;
const wsProtocol = protocol.includes('s') ? 'wss' : 'ws';
const wsHost = process.env.NODE_ENV === 'development' ? '127.0.0.1' : hostname;
const wsUrl = `${wsProtocol}://${wsHost}:${port}${baseConfig.baseUrl}`;
console.log(process.env.NODE_ENV, wsUrl);

function ws(resource) {
	let ws = new WebSocket(`${wsUrl}/${resource}`);
	ws.onmessage = function(e) {
		console.log(e);
		ws.getMessage && ws.getMessage(JSON.parse(e.data));
	};
	ws.onerror = function(e) {
		console.log(e);
	};
	ws.onclose = function(e) {
		console.log(e);
		console.log('重连中...');
		let ws = new WebSocket(`${wsUrl}/${resource}`);
		ws.onopen = function() {
			console.log('重连成功');
		};
	};

	return ws;
}

export default ws;
