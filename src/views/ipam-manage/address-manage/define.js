export const columns = scope => [  
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "网络地址",
    render: (h, { row }) => {
      return h("a", {
        class: "label-link",
        on: {
          click: () => {
            scope.handleViewNet(row);
          }
        }
      }, row.subnet);
    },
    align: "center"
  },
  {
    title: "区域",
    key: "zoneName",
    align: "center"
  },
  {
    title: "地址数量",
    key: "total",
    align: "center"
  },
  {
    title: "创建时间",
    key: "creationTimestamp",
    align: "center"
  },
  {
    title: "使用率",
    key: "usage",
    align: "center"
  },
  {
    title: "操作",
    align: "center",      
    render: (h, { row }) => {
      return h("label", {
        class: "operate-button button-primary",
        on: {
          click: () => {
            scope.handleAutoScan(row);
          }
        }
      }, "自动扫描");
    }
  }
];