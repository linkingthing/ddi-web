export const columns = scope => [  
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
  },
  {
    title: "操作",
    width: 100,
    render: (h, { row }) => 
      h("Button", {
        class: "table-row-button",
        props: {
          type: "default"
        },
        on: {
          click: () => {
            scope.handleDelete(row);
          }
        }
      }, "删除"),
    align: "right"
  }
];