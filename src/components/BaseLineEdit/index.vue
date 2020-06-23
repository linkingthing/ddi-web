<template>
  <div class="line-eidt">
    <Input
      v-if="contenteditable"
      v-model.number="innerValue"
      style="width: 60px"
    />
    <span v-else>
      {{innerValue}}
      {{isPercent ? '%' : ''}}
    </span>

    <img
      :src="contenteditable ? require('./icon-edit-finish.png') : require('./icon-table-edit.png')"
      @click="handleToggleEdit"
    >
  </div>
</template>

<script>
export default {
  name: "BaseLineEdit",
  components: {},
  props: {
    isPercent: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      el: null,
      innerValue: 0,
      contenteditable: false
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.innerValue = val;
    }
  },
  created() {
    this.innerValue = this.value;

  },
  mounted() { },

  methods: {
    handleToggleEdit() {
      if (this.contenteditable) {
        this.$emit("on-edit-finish", this.innerValue);
      }
      this.contenteditable = !this.contenteditable;
    },
    handleChangeText(e) {
      this.innerValue = e.target.innerText;
    }
  }
};
</script>

<style lang="less">
:focus {
  outline: none;
}

.line-eidt {
  cursor: pointer;

  .ivu-input {
    height: initial;
    padding: 0 5px;
  }
  span {
    padding: 0 5px;
  }
  img {
    width: 32px;
    height: 24px;
    padding: 4px 8px;
    box-sizing: border-box;
    border-radius: 6px;
    background: #ebebeb;
    vertical-align: bottom;
  }
}
</style>