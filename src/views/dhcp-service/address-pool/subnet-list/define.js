export const columns = scope => [    
  {
    title: "子网地址",
    key: "ipnet",
    align: "left",
    render: (h, { row }) => {
      return h("div", [
        h("a", {
          class: "is-link",
          on: {
            click: () => {
              scope.$router.push({ path: `/address/dhcp/subnets/${row.id}/pools?address=${row.ipnet}` });
            }
          }
        }, row.ipnet)
      ]);
    }
  },
  {
    title: "地址总量",
    key: "capacity",
    render: (h, { row }) => {
      return row.version === 4 && h("div", row.capacity);
    }
  },
  {
    title: "DHCP使用率",
    key: "usedRatio",
    width: "180",
    render: (h, { row }) => {
      return row.version === 4 && h("common-process",{
        props: {
          percent: +row.usedRatio 
        }
      });    

    }
  },
  {
    title: "操作",
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