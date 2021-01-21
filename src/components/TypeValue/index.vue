<template>
  <div class="typeValue">
    <form-item
      label="类型"
      prop="rrType"
    >
      <span v-if="typeDisabled">{{params.rrType}}</span>
      <i-select
        v-else
        v-model="params.rrType"
      >
        <i-option value="A">A</i-option>
        <i-option value="AAAA">AAAA</i-option>
        <i-option value="CNAME">CNAME</i-option>

        <template v-if="hasAll">
          <i-option value="HINFO">HINFO</i-option>
          <i-option value="MX">MX</i-option>
          <i-option value="NS">NS</i-option>
          <i-option value="NAPTR">NAPTR</i-option>
          <i-option value="PTR">PTR</i-option>
          <i-option value="SRV">SRV</i-option>
          <i-option value="TXT">TXT</i-option>
        </template>

      </i-select>
    </form-item>
    <form-item
      label="记录值"
      prop="rdata"
      :rules="[requiredValidate, 
               params.rrType === 'A' && isIPv4Validate,
               params.rrType === 'AAAA' && IPv6SimpleValidateFunc,
               params.rrType === 'CNAME' && domainValidate,
               params.rrType === 'URL' && urlValidate,
               params.rrType === 'SOA' && soaValidate
      ]"
    >
      <i-input
        v-model="params.rdata"
        placeholder="请填写资源记录"
      />
    </form-item>

    <!-- <form-item
      v-if="isrrs && ['A','AAAA'].includes(params.rrType)"
      label="备份记录值"
      prop="rdataBackup"
      :rules="[ 
               params.rrType === 'A' && isIPv4Validate,
               params.rrType === 'AAAA' && IPv6SimpleValidateFunc,
               params.rrType === 'CNAME' && domainValidate,
               params.rrType === 'URL' && urlValidate
      ]"
    >
      <i-input
        v-model="params.rdataBackup"
        placeholder="请填写资源记录"
      />
    </form-item> -->
  </div>
</template>

<script>
import {
  isIPv4Validate,
  urlValidate,
  domainValidate,
  IPv6SimpleValidateFunc,
  domainReg,
  integerReg
} from "@/util/common";

export default {
  components: {},
  props: {
    typeDisabled: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => ({
        rrType: "A"
      })
    },
    hasAll: {
      type: Boolean,
      default: false
    },
    isrrs: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.requiredValidate = { required: true, message: "请填写记录值" };
    this.isIPv4Validate = isIPv4Validate;
    this.IPv6SimpleValidateFunc = IPv6SimpleValidateFunc;
    this.domainValidate = domainValidate;
    this.urlValidate = urlValidate;

    this.soaValidate = {
      validator: (rule, value, callback) => {
        const [domain1, domain2, num1, num2, num3, num4, num5] = value.split(" ")
        if (domainReg.test(domain1) && domainReg.test(domain2) && integerReg.test(num1) && integerReg.test(num2) && integerReg.test(num3) && integerReg.test(num4) && integerReg.test(num5)) {
          callback();
        } else {
          callback("请正确输入SOA记录值： 2个域名 + 5个整形组成，空格分隔");

        }
      }
    };
    return {};
  }
};
</script>

