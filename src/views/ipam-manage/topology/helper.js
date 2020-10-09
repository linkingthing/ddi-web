/**
 * 处理设备列表数据，输出，nodes links
 * @return { nodes<Array>, links<Array> } nodes links
 */
export function parseData(data) {
  let links = [];
  let nodes = [];
  data.forEach(element => {
    nodes.push({
      ...element
    });

    // 线的计算 downlinkAddresses uplinkAddresses

    const {
      nextHopAddresses,
      downlinkAddresses,
      uplinkAddresses,
      administrationAddress // ip
    } = element;

    Object.keys(downlinkAddresses).forEach(port => {
      const next = downlinkAddresses[port];
      links.push({
        source: administrationAddress,
        source_port: port,
        target: next.ip,
        next_port: next.port
      });
    });

    Object.keys(uplinkAddresses).forEach(port => {
      const prev = uplinkAddresses[port];
      links.push({
        source: prev.ip,
        source_port: prev.port,
        target: administrationAddress,
        target_port: port
      });
    });

    Object.keys(nextHopAddresses).forEach(port => {
      const next = nextHopAddresses[port];
      links.push({
        source: administrationAddress,
        source_port: port,
        target: next.ip,
        next_port: next.port
      });
    });

  });

  links = unique(links);

  return { links, nodes };
}

/**
 * 数组去重
 */
export function unique(arr) {
  return [...new Set(arr.map(item => JSON.stringify(item)))].map(item =>
    JSON.parse(item)
  );
}
