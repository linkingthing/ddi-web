<template>
  <div class="typeValue">
    <form-item label="类型" prop="datatype" :label-width="110">
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
      :label-width="110"
      prop="value"
      :rules="[
                    requiredValidate,
                    params.datatype === 'A' && isIPv4Validate,
                    params.datatype === 'AAAA' && isIPv6Validate
                  ]"
    >
      <i-input v-model="params.value" placeholder="请填写记录值"></i-input>
    </form-item>
  </div>
</template>

<script>
import {
  isIPv4Validate,
  isIPv6Validate
} from "@/util/common";

export default {
  components: {},
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    this.requiredValidate = { required: true, message: "请填写记录值" };
    this.isIPv4Validate = isIPv4Validate;
    this.isIPv6Validate = isIPv6Validate;
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
  watch: {}
};
</script>

