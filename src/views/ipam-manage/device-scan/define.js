export const columns = scope => [  
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "探测设备IP",
    key: "address",
    align: "left"
  },
  {
    title: "操作",
    width: 120,
    render: (h, { row }) => {
      return h("Button", {
        class: "table-row-button",
        style: { width: "60px" },
        props: {
          type: "default"
        },
        on: {
          click: () => {
            scope.handleEdit(row);
          }
        }
      }, "编辑");
    },
    align: "center"
  }
];