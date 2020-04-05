<template>
  <div class="Calipers">
    <Slider v-model="value5" :step="10" range></Slider>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      value5: 50
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
  watch: {}
};
</script>

<style lang="less" scoped>
</style>