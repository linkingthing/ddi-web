<template>
  <div class="allocation">
    <div
      class="bit"
      :style="`background: ${item.color}`"
      v-for="item in bitList"
      :key="item.id"
    >{{item.value}}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    len: {
      type: Number,
      default: 64
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  computed: {
    bitList() {
      const bitList = [];
      for (let i = 0; i < this.len; i++) {
        bitList.push({
          id: i,
          index: i,
          value: "0",
          color: "#f80",
          type: ""
        });
      }
      return bitList;
    }
  },
  created() {
    console.log("created", this);
  },
  mounted() {},
  methods: {},
  watch: {}
};
</script>

<style lang="less" scoped>
.allocation {
  overflow: hidden;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.bit {
  display: block;
  text-align: center;
  float: left;
  width: 20px;
  height: 20px;
  border-right: 1px solid #ddd;
}
</style>