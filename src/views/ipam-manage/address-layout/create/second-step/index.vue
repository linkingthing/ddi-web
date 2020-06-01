<template>
  <div class="second-step segment-list">
    <div
      class="segment-item"
      v-for="(item, idx) in list"
      :key="idx">
      <section class="item-top">
        <div class="item-title">
          <Input
            v-if="currentItem && currentItem.id === item.id"
            placeholder="请输入标识名称"
            maxlength="255"
            v-model="item.name"
            :data-id="item.id"
            @on-blur="handleItemNameBlur"
            @on-enter="handleItemNameEnter" 
          />

          <div v-else @dblclick="handleItemDBClick(item, $event)">
            <span class="item-title-content">
              {{item.name}} 
            </span>
            <span class="item-title-desc">双击修改</span>
          </div>
        </div>

        <Button
          type="default"
          class="item-top-button"
          @click="handleAddItem(item)"
        >
          添加
        </Button>
      </section>

      <template v-if="item.tags.length">
        <section
          class="tag-child"
          v-for="(child, childIndex) in item.tags"
          :key="childIndex">
          <div class="tag-child-input">
            <label class="child-label">名称：</label>
            <Input
              placeholder="请填写名称"
              v-model="child.name"
              maxlength="50" 
            />
            <label class="child-label">值：</label>
            
            <Input
              v-if="item.value > 4"
              placeholder="请填写值"
              v-model="child.value"
              :maxlength="child.maxlength" />
            <select-input
              v-else
              v-model="child.value"
              :options="item.options"
              :maxlength="child.maxlength"
              placeholder="请填写值"/>
          </div>
          
          <img
            class="child-delete"
            @click="handleDeleteItem(item, childIndex)"
            :src="deleteImg">
        </section>
      </template>

      <div class="segment-no-data" v-else>点击添加按钮即可添加前缀</div>
    </div>
  </div>
</template>

<script>
import deleteImg from "./../images/delete.png";
import SelectInput from "@/components/SelectInput";

export default {
  components: {
    "select-input": SelectInput
  },

  props: {
    layoutId: {
      type: String,
      default: ""
    },
    
    url: {
      type: String,
      default: ""
    },

    reset: {
      type: Boolean,
      default: false
    },
    
    segments: {
      type: Array,
      default: () => []
    }
  },
  
  data() {
    return {
      deleteImg,
      list: [],
      currentItem: {}
    };
  },
  
  watch: {
    layoutId: {
      immediate: true,
      handler() {
        this.init();
      } 
    },

    reset(val) {
      if (!val) return;

      this.doReset();

      this.$emit("update:reset", false);
    }
  },

  methods: {
    async init() {
      if (!this.layoutId) return;
      
      try {
        let { data } = await this.$get({ url: `${this.url}/${this.layoutId}/segments` });

        this.list = data.sort((a,b) => a.index - b.index).map((item, i) => {
          const max = this.segments[i];    
          
          let options = max <= 4 ? this.generateOptions(max) : undefined;

          return {
            id: item.id,
            name: item.name || `标识${i + 1}`,
            tags: item.tags ? item.tags.map((tag, idx) => ({ 
              name: tag, 
              value: item.values[idx].toString(2),
              maxlength: max
            })) : [],
            sourceOptions: options ? [...options] : [],
            options,
            value: max,
            edit: false
          };
        }); 
      } catch (err) {
        this.$handleError(err);
      }     
    },

    generateOptions(value) {
      const res = Math.pow(2, value);

      return new Array(res).fill(0).map((i, idx) => {
        const val = idx.toString(2);

        return {
          label: val,
          value: val
        };
      });
    },

    handleSearch(item, value) {
      item.options = item.sourceOptions.filter(item => item.indexOf(value) >= 0);
    },

    handleFocus(item, value) {
      item.options = item.sourceOptions.filter(item => item.indexOf(value) >= 0);
    },

    doReset() {
      this.currentItem = null;
      this.list = [];
    },

    handleItemNameBlur() {
      this.currentItem = null;
    },

    handleItemNameEnter() {
      this.currentItem = null;
    },

    async handleItemDBClick(item) {
      if (this.currentItem && item.id === this.currentItem.id) return;

      this.currentItem = item;

      await this.$nextTick();

      let input = this.$el.querySelector(`.ivu-input-wrapper[data-id='${item.id}']`).querySelector(".ivu-input");

      if (input) input.focus();
    },

    async getData() {
      try {
        await this.validate();

        return this.getResults();
      } catch (err) {
        this.$handleError(err);

        return Promise.reject();
      }
    },

    getResults() {      
      return this.list.map(item => {
        let tags = [], values = [];

        Object.values(item.tags).forEach(({ name,value }) => {
          tags.push(name.trim());
          values.push(parseInt(value.trim(), 2));
        });

        return {
          id: item.id,
          name: item.name.trim(),
          tags,
          values
        };
      });
    },

    handleAddItem(segment) {
      if (segment.tags.length === Math.pow(2, segment.value)) {
        this.$$warning("超出标识范围！");

        return;
      }

      segment.tags.push({
        name: "",
        value: "",
        maxlength: segment.value
      });
    },

    handleDeleteItem(segment, idx) {
      segment.tags.splice(idx, 1);
    },

    validate() {
      const len = this.list.length;

      if (Array.from(new Set(this.list.map(({ name }) => name.trim()))).length < len) {
        return Promise.reject({ message: "各网段名称不能相同！" });
      }

      for (let i = 0; i < len; i++) {
        let item = this.list[i];

        if (!item.name.trim()) {
          return Promise.reject({ message: "请输入网段名称！" });
        }

        const tagLen = item.tags.length;
        
        let value = null;

        if (Array.from(new Set(item.tags.map(({ name }) => name.trim()))).length < tagLen) {
          return Promise.reject({ message: "网段下各项名称不能相同！" });
        }

        for (let j = 0; j < tagLen; j++) {
          let tag = item.tags[j];

          if (value === parseInt(tag.value)) {
            return Promise.reject({ message: "同一网段值不能相同" });
          }

          value = parseInt(tag.value);

          if (!tag.name.trim()) {
            return Promise.reject({ message: "请输入名称！" });
          }

          if (!/(1|0)/g.test(tag.value.toString().trim())) {
            return Promise.reject({ message: "请输入正确的值！" });
          }
        }
      }
    }
  }
};
</script>

<style lang="less">
@import "./index.less";
</style>