export const columns = scope => [
  {
    title: "子网地址",
    key: "ipnet",
    align: "left",
    render: (h, { row }) => {
      return h("div", [
        h(
          "a",
          {
            class: "is-link",
            on: {
              click: () => {
                scope.$router.push({
                  path: `/address/dhcp/subnets/${row.id}/pools?address=${row.ipnet}`
                });
              }
            }
          },
          row.subnet
        )
      ]);
    }
  },
  {
    title: "子网名称",
    key: "tags"
  },
  {
    title: "地址总量",
    key: "capacity"
  },
  {
    title: "已使用地址个数",
    key: "usedCount"
  },

  {
    title: "DHCP使用率",
    key: "usedRatio",
    width: "180",
    render: (h, { row }) => {
      return row.version === 4
        ? h("common-process", {
            props: {
              percent: +row.usedRatio
            }
          })
        : h("div", "--");
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
