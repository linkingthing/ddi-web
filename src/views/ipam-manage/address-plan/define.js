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
        class: "is-link",
        on: {
          click: () => {
            scope.handleViewLayouts(row);
          }
        }
      }, row.prefix);
    },
    align: "left"
  },
  {
    title: "可规划前缀",
    key: "maskLen",
    align: "center"
  },
  {
    title: "备注",
    key: "description",
    align: "center"
  },
  {
    title: "创建时间",
    key: "creationTimestamp",
    align: "right"
  }
];