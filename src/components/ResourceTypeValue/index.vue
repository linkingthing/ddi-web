<template>
  <div class="typeValue">
    <form-item
      label="类型"
      prop="datatype"
    >
      <i-select v-model="params.datatype">
        <i-option value="A">A</i-option>
        <i-option value="AAAA">AAAA</i-option>
        <i-option value="CNAME">CNAME</i-option>
        <i-option value="HINFO">HINFO</i-option>
        <i-option value="MX">MX</i-option>
        <i-option value="NS">NS</i-option>
        <i-option value="NAPTR">NAPTR</i-option>
        <i-option value="PTR">PTR</i-option>
        <i-option value="SRV">SRV</i-option>
        <i-option value="TXT">TXT</i-option>
      </i-select>
    </form-item>
    <form-item
      label="记录值"
      prop="rdata"
      :rules="[requiredValidate, 
               params.datatype === 'A' && ipv4List,
               params.datatype === 'AAAA' && ipv6List,
               params.datatype === 'CNAME' && domainValidate,
               params.datatype === 'URL' && urlValidate
      ]"
    >
      <i-input
        type="textarea"
        v-model="params.rdata"
        :placeholder="['A', 'AAAA'].includes(params.datatype) ? '可以添加多个记录值，多个记录值必须用逗号分隔，每次最多填写20条': '请输入记录值' "
      />
    </form-item>
  </div>
</template>

<script>
import {
  urlValidate,
  domainValidate,
  IPv6SimpleValidateFunc,
  ipv4IsValid,
  ipv6IsValid
} from "@/util/common";

export default {
  components: {},
  props: {
    params: {
      type: Object,
      default: () => ({
        datatype: "A"
      })
    }
  },

  data() {
    this.requiredValidate = { required: true, message: "请填写记录值" };
    this.IPv6SimpleValidateFunc = IPv6SimpleValidateFunc;
    this.domainValidate = domainValidate;
    this.urlValidate = urlValidate;

    return {};
  },
  computed: {
    ipv4List() {
      return {
        validator: this.unitValidator(ipv4IsValid, "请正确输入IPv4记录")
      };
    },
    ipv6List() {
      return {
        validator: this.unitValidator(ipv6IsValid, "请正确输入IPv6记录")
      };
    }
  },
  methods: {
    unitValidator(fn, message) {
      return (rule, value, callback) => {

        const ipList = value.split(",");
        const isPass = ipList.every(item => {
          return fn(item.trim()) && !item.includes("/");
        });

        if (ipList.length > 20) {
          callback(new Error("每次最多填写20条"));
        }

        if (isPass) {
          callback();
        } else {
          callback(new Error(message));
        }
      };
    }

  }
};
</script>

