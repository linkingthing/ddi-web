<template>
  <Button
    type="primary"
    icon="ios-search"
    @click="$emit('click')"
    class="btn-search"
    :loading="loading"
  ></Button>
</template>

<script>
export default {
  components: {},
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less">
.btn-search {
  width: 86px !important;
  .ivu-icon {
    font-size: 18px;
  }
}
</style>