<template>
  <div class="typeValue">
    <form-item
      label="类型"
      prop="type"
      :label-width="110"
    >
      <i-select v-model="params.type">
        <i-option value="A">A</i-option>
        <i-option value="AAAA">AAAA</i-option>
        <i-option value="CNAME">CNAME</i-option>
        <!-- <i-option value="MX">MX</i-option>
        <i-option value="NS">NS</i-option>
        <i-option value="NAPTR">NAPTR</i-option>
        <i-option value="PTR">PTR</i-option>
        <i-option value="SRV">SRV</i-option>
        <i-option value="TXT">TXT</i-option>
        <i-option value="URL">URL</i-option> -->
      </i-select>
    </form-item>
    <form-item
      label="记录值"
      :label-width="110"
      prop="value"
      :rules="[requiredValidate, 
               params.type === 'A' && isIPv4Validate,
               params.type === 'AAAA' && IPv6SimpleValidateFunc,
               params.type === 'CNAME' && domainValidate,
               params.type === 'URL' && urlValidate
      ]"
    >
      <i-input
        v-model="params.value"
        placeholder="请填写记录值"
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
        type: "A"
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

