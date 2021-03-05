<template>
  <div class="no-data">
    <img
      src="../../../../assets/images/nodata.png"
      alt=""
    >
    <p>暂无数据，请去 <span @click="handleGo">组织管理</span> 中添加规划信息</p>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    handleGo(){
      this.$router.push({
        path: "/address/ipam/address/organize"
      })
    }
  }
};
</script>

<style lang="less" scoped>
.no-data {
  padding-top: 290px;
  text-align: center;
  img {
    width: 146px;
  }
  p {
    font-size: 14px;
    color: #777;
    span {
      color: #4586FE;
      cursor: pointer;
    }
  }
}
</style>