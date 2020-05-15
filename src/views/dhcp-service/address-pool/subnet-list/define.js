export const columns = scope => [    
  {
    title: "子网地址",
    key: "subnet",
    align: "center",
    render: (h, { row }) => {
      return h("div", [
        h("label", {
          class: "operate-label operate-link",
          on: {
            click: () => {
              scope.showDetail(row);
            }
          }
        }, row.subnet)
      ]);
    }
  },
  {
    title: "地址总量",
    key: "total",
    align: "center"
  },
  {
    title: "DHCP使用率",
    key: "usage",
    align: "center",
    width: "130",
    render: (h, { row }) => {
      return h("common-process",{
        props: {
          percent: 25
        }
      });    

    }
  },
  {
    title: "操作",
    align: "right",      
    render: (h, { row }) => {
      return h("div", [
        h("btn-edit", {
          
          on: {
            click: () => {
              scope.handleDelete(row);
            }
          }
        })
      ]);
    }
  }
];