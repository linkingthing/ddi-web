<template>
  <div
    class="no-data-list"
    :style="{marginTop: getTop}"
  >
    <img :src="img">

    <p>{{text}}</p>

    <template v-if="showButton">
      <div>
        <Button
          v-if="showAdd"
          type="primary"
          @click="$emit('add')"
        >
          {{buttonText}}
        </Button>

        <Button
          v-for="(btn, idx) in buttons"
          :key="idx"
          :type="btn.type || 'primary'"
          :class="btn.customClass"
          @click="$emit(btn.event)"
        >
          {{btn.text}}
        </Button>
      </div>

    </template>
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
import img from "@/assets/images/no-data-1.png";

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
      default: "还没有数据哦，快去添加吧！"
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

<style>
</style>