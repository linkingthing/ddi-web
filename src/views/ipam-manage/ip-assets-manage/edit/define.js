import {
  macReg,
  mobilePhoneReg,
  ipv4IsValid,
  ipv6IsValid
} from "@/util/common";
import { deviceTypes } from "./../define";

const required = true;

export const formItemList = isNew => [
  {
    label: "MAC",
    model: "mac",
    type: "input",
    required,
    maxlength: 50,
    disabled: !isNew,
    placeholder: "请输入MAC"
  },
  {
    label: "IPv4",
    model: "ipv4s",
    type: "textarea",
    required,
    autosize: { minRows: 3, maxRows: 3 },
    placeholder: "请输入IPv4，多条逗号隔开"
  },
  {
    label: "IPv6",
    model: "ipv6s",
    type: "textarea",
    autosize: { minRows: 3, maxRows: 3 },
    required,
    placeholder: "请输入IPv6，多条逗号隔开"
  },
  {
    label: "终端名称",
    model: "name",
    type: "input",
    required,
    maxlength: 50,
    placeholder: "请输入终端名称"
  },
  {
    label: "终端类型",
    model: "deviceType",
    type: "select",
    children: deviceTypes,
    required,
    placeholder: "请选择终端类型"
  },
  {
    label: "交换机名称",
    model: "switchName",
    type: "input",
    maxlength: 50,
    placeholder: "请输交换机名称"
  },
  {
    label: "机房",
    model: "computerRoom",
    type: "input",
    maxlength: 50,
    placeholder: "请输入机房"
  },
  {
    label: "机柜",
    model: "computerRack",
    type: "input",
    maxlength: 50,
    placeholder: "请输入机柜"
  },
  {
    label: "端口",
    model: "switchPort",
    type: "input",
    maxlength: 50,
    placeholder: "请输入端口"
  },
  {
    label: "业务名称",
    model: "deployedService",
    type: "input",
    maxlength: 50,
    placeholder: "请输入业务名称"
  },
  {
    label: "所属部门",
    model: "department",
    type: "input",
    maxlength: 50,
    placeholder: "请输入所属部门"
  },
  {
    label: "负责人",
    model: "responsiblePerson",
    type: "input",
    maxlength: 50,
    placeholder: "请输入负责人"
  },
  {
    label: "联系电话",
    model: "telephone",
    type: "input",
    maxlength: 50,
    placeholder: "请输入联系电话"
  }
];

export const rules = {
  mac: [
    {
      required,
      message: "请输入MAC地址"
    },
    {
      pattern: macReg,
      message: "请输入正确的MAC地址"
    }
  ],
  ipv4s: [
    {
      validator: (rule, value, callback) => {
        const isValid = value
          .split(",")
          .filter(item => !!item)
          .every(item => ipv4IsValid(item));

        if (isValid) {
          callback();
        } else {
          callback("请输入正确ipv4地址，多条用逗号分隔");
        }
      }
    }
  ],
  ipv6s: [
    {
      validator: (rule, value, callback) => {
        const isValid = value
          .split(",")
          .filter(item => !!item)
          .every(item => ipv6IsValid(item));

        if (isValid) {
          callback();
        } else {
          callback("请输入正确ipv6地址，多条用逗号分隔");
        }
      }
    }
  ],
  name: [
    {
      required,
      message: "请输入终端名称"
    }
  ],
  deviceType: [
    {
      required,
      message: "请选择设备类型"
    }
  ],
  telephone: [
    {
      pattern: mobilePhoneReg,
      message: "请输入正确的联系电话"
    }
  ]
};
