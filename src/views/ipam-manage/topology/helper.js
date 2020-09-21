/**
 * 处理设备列表数据，输出，nodes links
 * @return { nodes<Array>, links<Array> }
 */
export function parseData(data) {
  let links = [];
  let nodes = [];
  data.forEach(element => {
    nodes.push({
      ...element,
    });

    // 线的计算 downlinkAddresses uplinkAddresses

    const {
      downlinkAddresses,
      uplinkAddresses,
      administrationAddress // ip
    } = element;

    Object.keys(downlinkAddresses).forEach(port => {
      const next = downlinkAddresses[port];
      links.push({
        source: administrationAddress,
        target: next.ip
      });
    });

    Object.keys(uplinkAddresses).forEach(port => {
      const prev = uplinkAddresses[port];
      links.push({
        source: prev.ip,
        target: administrationAddress
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
