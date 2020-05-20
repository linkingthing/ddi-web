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
              scope.$router.push({ path: "/address/dhcp/subnets/123/pools" });
            }
          }
        }, row.subnet)
      ]);
    }
  },
  {
    title: "地址总量",
    key: "capacity",
    align: "center"
  },
  {
    title: "DHCP使用率",
    key: "usedRatio",
    align: "center",
    width: "130",
    render: (h, { row }) => {
      return h("common-process",{
        props: {
          percent: +row.usedRatio 
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
      ]);
    }
  }
];