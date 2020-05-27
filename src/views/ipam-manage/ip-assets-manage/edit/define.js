import { ipv4IsValid, ipv6IsValid, mobilePhoneReg } from "@/util/common";

const required = true;

export const formItemList = [    
  {
    label: "IP地址",
    model: "ip",
    type: "input",
    required,
    placeholder: "请输入IP地址"
  },
  {
    label: "主机名",
    model: "name",
    type: "input",
    required,
    placeholder: "请输入主机名"
  },
  {
    label: "设备类型",
    model: "type",
    type: "input",
    required,
    placeholder: "请输入设备类型"
  },
  {
    label: "业务名称",
    model: "deployedService",
    type: "input",
    placeholder: "请输入业务名称"
  },
  {
    label: "所属部门",
    model: "department",
    type: "input",
    placeholder: "请输入所属部门"
  },
  {
    label: "负责人",
    model: "responsiblePerson",
    type: "input",
    placeholder: "请输入负责人"
  },
  {
    label: "地理位置",
    model: "location",
    type: "input",
    placeholder: "请输入地理位置"
  },
  {
    label: "联系电话",
    model: "telephone",
    type: "input",
    placeholder: "请输入联系电话"
  }
];

export const rules = {
  ip: [
    {
      required,
      message: "请输入IP地址"
    },
    {
      validator: function (rule, value, callback) {
        value = value.trim();
          
        if (!ipv4IsValid(value) && !ipv6IsValid(value)) {
          callback("请输入正确的IP地址");
        }

        callback();
      }
    }
  ],
  name: [{
    required,
    message: "请输入设备名称"
  }],
  type: [{
    required,
    message: "请输入设备类型"
  }],
  telephone: [{
    pattern: mobilePhoneReg,
    message: "请输入设备类型"
  }]
};