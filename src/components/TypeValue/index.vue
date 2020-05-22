<template>
  <div class="typeValue">
    <form-item
      label="类型"
      prop="type"
    >
      <i-select v-model="params.datatype">
        <i-option value="A">A</i-option>
        <i-option value="AAAA">AAAA</i-option>
        <i-option value="CNAME">CNAME</i-option>
        <i-option value="MX">MX</i-option>
        <i-option value="NS">NS</i-option>
        <i-option value="NAPTR">NAPTR</i-option>
        <i-option value="PTR">PTR</i-option>
        <i-option value="SRV">SRV</i-option>
        <i-option value="TXT">TXT</i-option>
        <i-option value="URL">URL</i-option>
      </i-select>
    </form-item>
    <form-item
      label="记录值"
      prop="rdata"
      :rules="[requiredValidate, 
               params.datatype === 'A' && isIPv4Validate,
               params.datatype === 'AAAA' && IPv6SimpleValidateFunc,
               params.datatype === 'CNAME' && domainValidate,
               params.datatype === 'URL' && urlValidate
      ]"
    >
      <i-input
        v-model="params.rdata"
        placeholder="可以添加多个记录值，多个记录值必须用 换行符分隔，每次最多填写20条"
      />
    </form-item>
  </div>
</template>

<script>
import {
  isIPv4Validate,
  urlValidate,
  domainValidate,
  IPv6SimpleValidateFunc
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
    this.isIPv4Validate = isIPv4Validate;
    this.IPv6SimpleValidateFunc = IPv6SimpleValidateFunc;
    this.domainValidate = domainValidate;
    this.urlValidate = urlValidate;
    return {};
  }
};
</script>

