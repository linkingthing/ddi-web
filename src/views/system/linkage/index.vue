<template>
  <div class="system-linkage">
    <div class="system-linkage-content">
      <div class="proccess-bar">
        <div class="proccess-bar-item">
          <img
            src="./system.png"
            alt=""
          >
          <p>上级系统</p>
        </div>
        <div class="proccess-bar-item proccess-bar-line">
          <div>......</div>
          <div class="proccess-bar-line-mark">
            上报
            <img
              src="./arrow-left.png"
              alt=""
            >
          </div>
          <div>......</div>
        </div>
        <div class="proccess-bar-item">
          <img
            src="./system.png"
            alt=""
          >
          <p>本系统</p>
        </div>
        <div class="proccess-bar-item proccess-bar-line">
          <div>......</div>
          <div class="proccess-bar-line-mark">
            下发
            <img
              src="./arrow-right.png"
              alt=""
            >
          </div>
          <div>......</div>

        </div>
        <div class="proccess-bar-item">
          <img
            src="./system.png"
            alt=""
          >
          <p>上级系统</p>
        </div>
      </div>

      <div class="system-linkage-tab">
        <div class="system-linkage-tab-item system-linkage-tab-active">
          上报服务
        </div>
        <div class="system-linkage-tab-item">
          下发服务
        </div>
      </div>

      <div class="line">
      </div>

      <div class="center-form">

        <Form
          :model="params"
          :label-width="110"
          label-position="left"
        >
          <FormItem
            label="启动上报服务"
            prop=""
          >
            <i-switch v-model="params.open" />
          </FormItem>
          <FormItem
            label="上级系统IP地址"
            prop=""
          >
            <Input placeholder="请填写上级系统IP地址"></Input>
          </FormItem>
          <FormItem :label-width="0">
            <Button type="primary" long>确定</Button>
          </FormItem>

        </Form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      params: {
        open: true
      }
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
};
</script>

<style lang="less" scoped>
.system-linkage {
  padding-top: 60px;
  .system-linkage-content {
    width: 1000px;
    margin: 20px auto;
    height: 20px;
    .proccess-bar {
      display: flex;
      background-color: #f5f5f5;
      height: 170px;
      padding: 0 70px;
      .proccess-bar-item {
        padding: 40px 0 30px;
        color: #333;
        font-size: 14px;
        text-align: center;
        font-weight: bold;
        img {
          margin-bottom: 20px;
        }
      }
      .proccess-bar-line {
        flex: 1;
        display: flex;
        letter-spacing: 20px;
        line-height: 80px;
        .proccess-bar-line-mark {
          letter-spacing: 3px;
          width: 41px;
          line-height: 20px;
          padding: 20px 0;
        }
      }
    }

    .system-linkage-tab {
      margin: 36px auto 20px;
      padding: 2px;
      background-color: #e6e6e6;
      height: 40px;
      width: 332px;
      border-radius: 6px;
      display: flex;
      justify-content: space-around;
      .system-linkage-tab-item {
        width: 163px;
        height: 36px;
        border-radius: 6px;
        font-size: 14px;
        text-align: center;
        font-weight: bold;
        color: #777;
        padding: 5px;
        line-height: 26px;
        cursor: pointer;
      }
      .system-linkage-tab-active {
        background: #ffffff;
        color: #333;
      }
    }
    .line {
      position: relative;
      height: 1px;
      background: radial-gradient(
        ellipse farthest-corner at 50% 50%,
        #ccc,
        #ddd 50%,
        #fff
      );
    }
    .center-form {
      width: 332px;
      margin: 30px auto;
    }
  }
}
</style>