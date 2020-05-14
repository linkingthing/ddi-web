import { getAddressType } from "@/util/common";

export const operateTypes = {
  merge: "merge",
  split: "split"
};

export const columns = scope => [  
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "网络地址",
    render: (h, { row }) => {
      const isIPv4 = getAddressType(row.subnet) === "ipv4"; 

      return h("label", {
        class: isIPv4 ? "net-address" : "",
        on: {
          click: () => {
            if (!isIPv4) return;

            scope.handleView(row);
          }
        }
      }, row.subnet);
    },
    align: "center"
  },
  {
    title: "区域",
    key: "zoneName",
    align: "center"
  },
  {
    title: "地址数量",
    key: "total",
    align: "center"
  },
  {
    title: "创建时间",
    key: "creationTimestamp",
    align: "center"
  },
  {
    title: "使用率",
    key: "usage",
    align: "center"
  },
  {
    title: "操作",
    align: "center",      
    render: (h, { row }) => {
      return h("div", [
        h("label", {
          class: "operate-label operate-edit",
          on: {
            click: () => {
              scope.handleEdit(row);
            }
          }
        }, "编辑"),
        h("label", {
          class: "operate-label operate-delete",
          on: {
            click: () => {
              scope.handleDelete(row);
            }
          }
        }, "删除")
      ]);
    }
  }
];