<template>
  <div
    class="PlanProcessItem"
    :class="type"
    @click="hanldeClick(type)"
  >
    <Icon
      :class="icon"
      style="font-size: 24px"
    />
    <p class="PlanProcessItemText">{{title}}</p>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    type: {
      type: String,
      default: ""  // "", visited, active
    },
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
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
  methods: {
    hanldeClick(type) {
      // if (type === "visited") {
      //   this.$emit("onchange", this.id);
      // }
      // TODO, 临时打开
      this.$emit("onchange", this.id);
    }
  }
};
</script>

<style lang="less" scoped>
.PlanProcessItem {
  height: 80px;
  width: 168px;
  text-align: center;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  border: 1px dashed #ccc;
  color: #999;
}

.PlanProcessItemText {
  padding-top: 10px;
}

.active {
  color: #fff;
  background: #4586fe;
  border-style: solid;
  box-shadow: 0px 10px 10px 0px rgba(3, 40, 92, 0.13);
}

.visited {
  color: #333;
  border-color: #333;
  cursor: pointer;
}
</style>