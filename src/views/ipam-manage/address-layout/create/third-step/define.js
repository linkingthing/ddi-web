export const columns = scope => [  
  {
    title: "名称",
    key: "tags",
    align: "center"
  },
  {
    title: "前缀",
    key: "network",
    align: "center"
  },
  {
    title: "操作",    
    render: (h, { row }) => {
      return h("Button", {
        class: "table-row-button",
        props: {
          type: "default"
        },
        on: {
          click: () => {
            scope.handleCreatePool(row);
          }
        }
      }, "DHCP");
    },
    align: "center"
  }
];