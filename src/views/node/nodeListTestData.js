export const treeData = [
  {
    id: "10.0.0.59",
    type: "node",

    ip: "10.0.0.59",
    roles: ["controller", "dns", "dhcp"],
    hostName: "test01",
    nodeIsAlive: true,
    dhcpIsAlive: true,
    dnsIsAlive: true,
    master: "",
    controllerIP: "10.0.0.59",

    slaveList: [
      {
        id: "10.0.0.60",
        type: "node",

        ip: "10.0.0.60",
        roles: ["controller", "dns", "dhcp"],
        hostName: "test01",
        nodeIsAlive: false,
        dhcpIsAlive: false,
        dnsIsAlive: false,

        master: "10.0.0.59",
        controllerIP: "10.0.0.60",
      },
      {
        id: "10.0.0.66",
        type: "node",

        ip: "10.0.0.66",
        roles: ["controller", "dns", "dhcp"],
        hostName: "test01",
        nodeIsAlive: false,
        dhcpIsAlive: false,
        dnsIsAlive: false,

        master: "10.0.0.59",
        controllerIP: "10.0.0.60",
      },
    ],

    children: [
      {
        id: "10.0.0.73",
        type: "node",

        ip: "10.0.0.73",
        roles: ["dns"],
        hostName: "test0110.0.0.73",
        nodeIsAlive: false,
        dhcpIsAlive: false,
        dnsIsAlive: false,

        master: "",
        controllerIP: "10.0.0.59",
        slaveList: [
          {
            id: "10.0.0.74",
            type: "node",
            ip: "10.0.0.74",
            roles: ["dns"],
            hostName: "test01",
            nodeIsAlive: false,
            dhcpIsAlive: false,
            dnsIsAlive: false,

            master: "10.0.0.73",
            controllerIP: "10.0.0.59",
          },
        ],
      },
      {
        id: "10.0.0.77",
        type: "node",

        ip: "10.0.0.77",
        roles: ["dns"],
        hostName: "test01",
        nodeIsAlive: false,
        dhcpIsAlive: false,
        dnsIsAlive: false,

        master: "",
        controllerIP: "10.0.0.59",
      },
      {
        id: "10.0.0.75",
        type: "node",

        ip: "10.0.0.75",
        roles: ["dhcp"],
        hostName: "test01",
        nodeIsAlive: false,
        dhcpIsAlive: false,
        dnsIsAlive: false,

        master: "",
        controllerIP: "10.0.0.59",
      },
      // {
      //   "id": "10.0.0.750",
      //   "type": "node",

      //   "ip": "10.0.0.750",
      //   "roles": [
      //     "dhcp",
      //   ],
      //   "hostName": "test01",
      //   "nodeIsAlive": false,
      //   "dhcpIsAlive": false,
      //   "dnsIsAlive": false,

      //   "master": "",
      //   "controllerIP": "10.0.0.59",
      // }, {
      //   "id": "10.0.0.751",
      //   "type": "node",

      //   "ip": "10.0.0.751",
      //   "roles": [
      //     "dhcp",
      //   ],
      //   "hostName": "test01",
      //   "nodeIsAlive": false,
      //   "dhcpIsAlive": false,
      //   "dnsIsAlive": false,

      //   "master": "",
      //   "controllerIP": "10.0.0.59",
      // },
    ],
  },
];

export const commondata = [
  {
    id: "10.0.0.59",
    type: "node",
    ip: "10.0.0.59",
    roles: ["controller", "dns", "dhcp"],
    hostName: "test01",
    nodeIsAlive: true,
    dhcpIsAlive: true,
    dnsIsAlive: true,
    master: "",
    controllerIP: "10.0.0.59",
  },
  {
    id: "10.0.0.73",
    type: "node",
    ip: "10.0.0.73",
    roles: ["dns"],
    hostName: "test01",
    nodeIsAlive: false,
    dhcpIsAlive: false,
    dnsIsAlive: false,
    master: "",
    controllerIP: "10.0.0.59",
  },
  {
    id: "10.0.0.74",
    type: "node",

    ip: "10.0.0.74",
    roles: ["dns"],
    hostName: "test01",
    nodeIsAlive: false,
    dhcpIsAlive: false,
    dnsIsAlive: false,

    master: "10.0.0.73",
    controllerIP: "10.0.0.59",
  },
  {
    id: "10.0.0.60",
    type: "node",

    ip: "10.0.0.60",
    roles: ["controller", "dns", "dhcp"],
    hostName: "test01",
    nodeIsAlive: false,
    dhcpIsAlive: false,
    dnsIsAlive: false,

    master: "10.0.0.59",
    controllerIP: "10.0.0.60",
  },
  {
    id: "10.0.0.66",
    type: "node",

    ip: "10.0.0.66",
    roles: ["controller", "dns", "dhcp"],
    hostName: "test01",
    nodeIsAlive: false,
    dhcpIsAlive: false,
    dnsIsAlive: false,

    master: "10.0.0.59",
    controllerIP: "10.0.0.60",
  },
  {
    id: "10.0.0.79",
    type: "node",

    ip: "10.0.0.79",
    roles: ["dns"],
    hostName: "test01",
    nodeIsAlive: false,
    dhcpIsAlive: false,
    dnsIsAlive: false,

    master: "",
    controllerIP: "10.0.0.59",
  },
  {
    id: "10.0.0.75",
    type: "node",

    ip: "10.0.0.75",
    roles: ["dhcp"],
    hostName: "test01",
    nodeIsAlive: false,
    dhcpIsAlive: false,
    dnsIsAlive: false,

    master: "",
    controllerIP: "10.0.0.59",
  }
];
