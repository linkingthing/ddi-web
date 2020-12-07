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
  },
  {
    title: "备注",
    key: "description",
  },
  {
    title: "创建时间",
    key: "creationTimestamp",
  },
  {
    title: "操作",
    width: 100,
    render: (h, { row }) => 
      h("div", [
        h("btn-del", {
          on: {
            click: () => {
              scope.handleDelete(row);
            }
          }
        })
      ]),
  }
];