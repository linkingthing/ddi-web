import { statusLegends } from "../network-interface/define";
const tooltip = true;

export const deviceTypes = [
  {
    text: "PC端",
    label: "pc"
  },
  {
    text: "手机端",
    label: "mobile"
  },
  {
    text: "打印机",
    label: "printer"
  },
  {
    text: "摄像头",
    label: "camera"
  },
  {
    text: "NVR",
    label: "nvr"
  },
  {
    text: "物联设备",
    label: "iot"
  },
  {
    text: "其他",
    label: "other"
  }
];

function renderIp(h, row, field, status, scope) {
  if (row[field] && row[field].length === 1) {
    let config = {};
    let color = "#4586FE";
    const state = row[status];
    if (state && state.length) {
      const statusConfig = statusLegends.find(
        item => item.type === state[0].ipstate
      );

      if (statusConfig) {
        config = { ...statusConfig, ...state[0] };
        color = statusConfig.color;
      }
    }
    return h(
      "div",
      {
        style: {
          color: state && color,
          cursor: state && "pointer",
          overflow: "hidden",
          "text-overflow": "ellipsis",
          "white-space": "nowrap"
        },
        on: {
          click: () => state && scope.handleGoto(config)
        }
      },
      row[field][0]
    );
  } else
    return h("Tooltip", {
      style: {
        width: "100%"
      },
      props: {
        theme: "light",
        disabled: !(Array.isArray(row[field]) && row[field].length)
      },
      scopedSlots: {
        default: function (props) {
          return h(
            "div",
            {
              style: {
                color: row[status] && "#4586FE",
                cursor: row[status] && "pointer",
                overflow: "hidden",
                "text-overflow": "ellipsis",
                "white-space": "nowrap"
              }
            },
            Array.isArray(row[field]) && row[field].length
              ? row[field].join(",")
              : "__"
          );
        },
        content: function () {
          let ipList = [];
          if (Array.isArray(row[field])) {
            ipList = row[field]
              .map(item => {
                let config = {};
                if (row[status]) {
                  const target = row[status].find(i => i.ip === item);
                  config = { ...target };
                  if (target) {
                    const statusConfig = statusLegends.find(
                      item => item.type === target.ipstate
                    );
                    if (statusConfig) {
                      config = {
                        hasState: item === target.ip,
                        ...config,
                        ...statusConfig
                      };
                    }
                  }
                }
                return [
                  h("span", [
                    h("span", {
                      style: {
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        marginRight: "5px",
                        marginBottom: "2px",
                        backgroundColor: config.color
                      }
                    }),
                    h(
                      "span",
                      {
                        style: {
                          color: config.hasState ? "#4586FE" : "",
                          cursor: config.hasState ? "pointer" : "",
                          "white-space": "normal"
                        },
                        on: {
                          click: () =>
                            config.hasState && scope.handleGoto(config)
                        }
                      },
                      item
                    )
                  ]),
                  h("br")
                ];
              })
              .flat();
          }
          return h("div", ipList);
        }
      }
    });
}

export const columns = scope => [
  {
    title: "MAC",
    key: "mac",
    align: "left",
    width: 180,
    tooltip,
    fixed: "left"
  },
  {
    title: "终端状态",
    key: "deviceState",
    align: "left",
    width: 110,
    render: (h, { row }) => {
      const colorMap = {
        online: {
          color: "#51CA3D",
          text: "在线"
        },
        offline: {
          color: "#999999",
          text: "离线"
        },
        abnormal: {
          color: "#EF2E2E",
          text: "异常"
        }
      };
      return h(
        "div",
        {
          style: {
            color: colorMap[row.deviceState].color
          }
        },
        colorMap[row.deviceState].text
      );
    }
  },
  {
    title: "IPv4地址",
    width: 180,
    tooltip,
    render: (h, { row }) => {
      return renderIp(h, row, "ipv4s", "ipv4sStatus", scope);
    }
  },
  {
    title: "IPv6地址",
    width: 180,
    render: (h, { row }) => {
      return renderIp(h, row, "ipv6s", "ipv6sStatus", scope);
    }
  },

  {
    title: "终端名称",
    key: "name",
    align: "center",
    width: 180,
    tooltip
  },
  {
    title: "终端类型",
    key: "deviceTypeText",
    align: "center",
    width: 140,
    tooltip
  },
  {
    title: "上联设备",
    key: "uplinkEquipment",
    align: "center",
    width: 160,
    tooltip
  },
  {
    title: "端口",
    key: "uplinkPort",
    align: "center",
    width: 120,
    tooltip
  },
  {
    title: "机房",
    key: "computerRoom",
    align: "center",
    width: 140,
    tooltip
  },
  {
    title: "机柜",
    key: "computerRack",
    align: "center",
    width: 140,
    tooltip
  },

  {
    title: "vlan",
    key: "vlanId",
    align: "center",
    width: 120,
    tooltip,
    render: (h, { row }) => {
      return h("div", row.vlanId ? row.vlanId : "");
    }
  },
  {
    title: "业务名称",
    key: "deployedService",
    align: "center",
    width: 150,
    tooltip
  },
  {
    title: "所属部门",
    key: "department",
    align: "center",
    width: 150,
    tooltip
  },
  {
    title: "负责人",
    key: "responsiblePerson",
    align: "center",
    width: 150,
    tooltip
  },
  {
    title: "联系电话",
    key: "telephone",
    align: "center",
    minWidth: 150,
    tooltip
  },
  {
    title: "操作",
    width: 160,
    fixed: "right",
    align: "center",
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
