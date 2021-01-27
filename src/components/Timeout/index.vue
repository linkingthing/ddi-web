<template>
  <div
    class="no-data-list"
    :style="{marginTop: getTop}"
  >
    <img :src="img">
    <p>{{text}}</p>
  </div>
</template>


<script>
import img from "./timeout.png";

export default {
  name: "ListNoData",

  props: {
    buttons: {
      type: Array,
      default: () => []
    },

    buttonText: {
      type: String,
      default: "添加"
    },

    text: {
      type: String,
      default: "数据请求超时"
    },

    showButton: {
      type: Boolean,
      default: true
    },

    showAdd: {
      type: Boolean,
      default: true
    },

    top: {
      type: [String, Number],
      default: 0
    }
  },

  data() {
    return {
      img
    };
  },

  computed: {
    getTop() {
      return parseFloat(this.top) + "px";
    }
  }
};
</script>

<style lang="less" scoped>
.no-data-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  img {
    width: 120px;
  }
  p {
    line-height: 1;
    margin: 32px 0 30px;
    font-size: 14px;
    color: #999;
  }

  .ivu-btn {
    min-width: 100px;
    margin-right: 24px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>