<template>
  <div class="netword-list">
    <Input
      v-model="ipList"
      type="textarea"
      :autosize="autosize"
    />
  </div>
</template>

<script>
export default {
  components: {},
  model: {
    props: "value",
    event: "onchange"
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    autosize: {
      type: Object,
      default: () => ({ minRows: 4, maxRows: 6 })
    }
  },
  data() {
    return {
      ipList: []
    };
  },
  computed: {},
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log(val)
        this.ipList = val.join("\n");
      }
    },
    ipList(val) {
      const ips = val.split("\n").map(item => item.trim()).filter(item => item.length);
      this.$emit("onchange", ips);
    }
  },
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" scoped>

</style>