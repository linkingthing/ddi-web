<template>
  <div class="SemanticListItem">
    <span v-if="isEdit">
      <Input
        placeholder="请输入名称"
        class="SemanticListItemInput"
        v-model="innerTitle"
      />
    </span>

    <span v-else>{{name}}</span>

    <span
      class="right-deal"
      :class="{isEdit}"
    >
      <Icon
        v-if="isEdit"
        class="icon-right-deal icon-finish"
        @click="handleClickFinish"
      />
      <Icon
        v-else
        class="icon-right-deal icon-edit"
        @click="handleClickEdit"
      />
      <Icon
        class="icon-right-deal icon-close"
        @click="handleClickDelete"
      />
    </span>

  </div>
</template>

<script>
export default {
  components: {},
  props: {
    id: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Number,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerTitle: ""
    };
  },
  computed: {},
  watch: {
    name(val) {
      this.innerTitle = val;
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleClickFinish() {
      this.$emit("onFinish", this.id, this.innerTitle);
    },
    handleClickEdit() {
      this.innerTitle = this.name;
      this.$emit("onEdit", this.id);
    },
    handleClickDelete() {
      this.$emit("onDelete", this.id);
    }
  }
};
</script>
<style lang="less">
.SemanticListItemInput {
  .ivu-input {
    background: #e6e6e6;
  }
}
</style>
<style lang="less" scoped>
.SemanticListItem {
  position: relative;
  display: flex;
  justify-content: space-between;

  color: #333;
  font-size: 14px;
  padding: 10px;
  line-height: 1;
  height: 34px;
  overflow: hidden;

  .SemanticListItemInput {
    position: absolute;
    left: 0;
    top: 0;
  }

  .icon-right-deal {
    font-size: 16px;
    cursor: pointer;
  }
  .right-deal {
    position: relative;
    z-index: 10;
    display: none;
    &.isEdit {
      display: block;
    }
  }
  &:hover {
    background: #f4f4f4;
    border-radius: 4px;
    .right-deal {
      display: block;
    }
  }
}
</style>