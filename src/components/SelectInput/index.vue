<template>
  <Poptip
    v-model="visible"
    :key="key"
    width="400"
    trigger="focus"
    popper-class="select-input-custom">
      
    <Input
      :placeholder="placeholder"
      v-model="inputValue"
      :maxlength="maxlength"
      @on-change="handleFilter"
    />

    <div class="select-input-custom-list" slot="content">
      <div
        v-for="(item, idx) in innerOptions"
        :key="idx"
        :class="{'is-selected': item.selected}"
        @click="handleClickItem(item)"
        class="list-item"
      >
        {{item.label}}
      </div>
    </div>
  </Poptip>
</template>

<script>
export default {
  name: "SelectInput",

  props: {
    value: {
      type: [String, Number],
      default: ""
    },

    placeholder: {
      type: String,
      default: ""
    },

    maxlength: {
      type: Number,
      default: 100
    },

    options: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      visible: false,
      key: Math.random().toString().slice(2),
      inputValue: "",
      sourceOptions: [],
      innerOptions: []
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newVal, oldVal) {
        newVal = newVal ? newVal.toString().trim() : "";
        oldVal = oldVal ? oldVal.toString().trim() : "";

        if (newVal === oldVal) return;

        this.inputValue = newVal;
      }
    },

    options: {
      immediate: true,
      handler(val) {
        if (!val) return;

        this.sourceOptions = JSON.parse(JSON.stringify(val)).map(item => { 
          item.selected = false; 

          return item; 
        });

        this.innerOptions = JSON.parse(JSON.stringify(this.sourceOptions));
      }
    }
  },

  methods: {
    handleClickItem({ value }) {
      this.innerOptions = this.innerOptions.map(item => {
        item.selected = item.value === value;

        return item;
      });

      this.inputValue = value;

      this.$emit("input", value);
    },

    handleFilter() {
      const value = this.inputValue.trim();

      this.innerOptions = this.sourceOptions.filter(item => item.label.toString().indexOf(value) >= 0);

      this.$emit("input", value);
    },

    handleBlur() {        
      this.visible = false;
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>