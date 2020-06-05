export const columns = scope => [  
  {
    title: "探测设备IP",
    key: "address",
    align: "left"
  },
  {
    title: "操作",
    width: 120,
    render: (h, { row }) => 
      h("div", [
        h("btn-edit", {
          on: {
            click: () => {
              scope.handleEdit(row);
            }
          }
        }),
        h("btn-del", {
          on: {
            click: () => {
              scope.handleDelete(row);
            }
          }
        })
      ]),
    align: "center"
  }
];