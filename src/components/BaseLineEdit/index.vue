<template>
  <div class="line-eidt">
    <span
      :contenteditable="contenteditable"
      ref="inputFocus"
    >
      {{innerValue}}
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
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      el: null,
      innerValue: "",
      contenteditable: false
    };
  },
  computed: {},
  watch: {
    value(val) {
      console.log(val)
      this.innerValue = val;
    }
  },
  created() {
    this.innerValue = this.value;

  },
  mounted() { },
  destroyed() {
    this.el.removeEventListener("compositionend", this.handleChangeText);
  },
  methods: {
    handleToggleEdit() {
      if (this.contenteditable) {

        this.$emit("on-edit-finish", this.innerValue);
      }



      this.contenteditable = !this.contenteditable;
      this.$nextTick().then(() => {
        const el = this.el = this.$refs.inputFocus;
        el.focus();
        el.addEventListener("compositionend", this.handleChangeText);

      });

    },
    handleChangeText(e) {

      console.log(e)
      // console.log(target.innerText)
      this.innerValue = e.target.innerText;
    }
  }
};
</script>

<style lang="less" scoped>
:focus {
  outline: none;
}

.line-eidt {
  cursor: pointer;

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