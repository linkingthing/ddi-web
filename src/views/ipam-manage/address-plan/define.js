export const columns = scope => [  
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "备注",
    key: "remark",
    align: "center"
  },
  {
    title: "前缀",
    render: (h, { row }) => {
      return h("a", {
        class: "cell-prefix is-link",
        on: {
          click: () => {
            scope.handleViewLayouts(row);
          }
        }
      }, 1111 + row.prefix);
    },
    align: "center"
  },
  {
    title: "布局数",
    key: "total",
    align: "center"
  },
  {
    title: "已使用块数",
    key: "usage",
    align: "center"
  },
  {
    title: "创建时间",
    key: "creationTimestamp",
    align: "center"
  }
];