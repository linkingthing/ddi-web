<template>
  <div class="Card">
    <h3>
      {{title}}
      <span v-for="item in infos" :key="item">{{item}}</span>
    </h3>

    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    infos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
  watch: {}
};
</script>

<style lang="less" scoped>
.Card {
  h3 {
    font-size: 24px;
    color: #697075;
    span {
      font-size: 16px;
      color: #929292;
      padding: 0 15px;
    }
  }
}
</style>