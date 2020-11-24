<template>
  <div
    class="multiple-select"
    :style="`height: ${height}px`"
  >
    <div class="multiple-select-search multiple-select-card">
      <div class="multiple-search multiple-select-head">
        <Icon class="icon-search-btn multiple-searc-icon" />
        <Input
          :placeholder="placeholder"
          class="multiple-select-search-input"
          v-model="keywords"
        />
      </div>
      <div class="multiple-select-search-list multiple-select-body">
        <ol>
          <li
            v-for="item in showDataList"
            :key="item.id"
            @click="handleSelect(item)"
          >
            <div
              class="ellipsis"
              v-if="item.name.length > 20 || item.prefixs"
            >
              <Tooltip
                :content="item.prefixs || item.name"
                max-width="300"
              >
                {{item.name.slice(0, 20)}}...
              </Tooltip>
            </div>
            <div v-else>
              {{item.name}}
            </div>
          </li>

        </ol>
      </div>

    </div>
    <div class="multiple-select-show multiple-select-card">
      <div class="multiple-select-head">
        <h3 class="multiple-select-card-title">{{tips}}:</h3>
      </div>
      <div class="multiple-select-body">
        <div
          class="selected-labels"
          v-if="selectedList.length"
        >

          <Tag
            v-for="item in selectedList"
            :key="item.id"
            closable
            @on-close="handleClose(item)"
          >
            <Tooltip
              placement="bottom-start"
              :content="item && item.prefixs"
              max-width="300"
              :disabled="item && !item.prefixs"
            >
              {{item.name}}
            </Tooltip>
          </Tag>

        </div>

        <div v-else> 暂未选择 </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "on-change"
  },
  props: {
    height: {
      type: Number,
      default: 200
    },
    dataList: {
      type: Array,
      default: () => ([])
    },
    value: {
      type: Array,
      default: () => ([])
    },
    placeholder: {
      type: String,
      default: "请输入关键字搜索"
    },
    tips: {
      type: String,
      default: "已选"
    },
    clearKeywords: {
      type: Boolean,
      default: false
    },
    isAsyncSearch: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      keywords: "",
      selectedList: []
    };
  },
  computed: {
    showDataList() {
      // 过滤已选择的和条件过滤的内容
      return this.dataList.filter(item => item.name.includes(this.keywords.trim())).filter(item => !this.isSelected(item.id));
    }
  },
  watch: {
    clearKeywords() {
      this.keywords = "";
    },
    value: {
      deep: true,
      immediate: true,
      handler(value, old) {
        // value不存在于 dataList时， value id 和 name 默认为本身
        if (Array.isArray(value) && JSON.stringify(value) !== JSON.stringify(old)) {
          this.selectedList = value.map(item => this.dataList.find(data => data.id === item) || { id: item, name: item });
        }
      }
    },

    dataList: {
      deep: true,
      immediate: true,
      handler(value) {
        this.selectedList = this.value.map(item => value.find(data => data.id === item) || { id: item, name: item });
      }
    },
    selectedList: {
      deep: true,
      handler(value) {
        this.$emit("on-change", value.map(item => item.id));
      }
    },
    keywords(value) {
      if (this.isAsyncSearch && value.trim()) {
        this.$emit("onSearch", value);
      }
    }
  },
  created() {

  },
  methods: {
    isSelected(id) {
      const selectedIds = this.selectedList.map(item => item.id);
      return selectedIds.includes(id);
    },
    handleSelect(item) {
      if (!this.isSelected(item.id)) {
        this.selectedList.push(item);
      }
    },
    handleClose({ id }) {
      this.selectedList = this.selectedList.filter(item => item.id !== id);
    }
  }
};
</script>

<style lang="less">
.multiple-select {
  display: flex;
  width: 100%;

  .multiple-select-search {
    width: 280px;
    margin-right: 12px;

    .multiple-search {
      position: relative;
      height: 40px;
      .multiple-searc-icon {
        position: absolute;
        top: 12px;
        left: 0;
        font-size: 16px;
      }
      .multiple-select-search-input {
        padding: 2px 16px;

        border: 0;
        border-radius: 0;
        border-bottom: 1px solid #ccc;

        .ivu-input {
          border: 0;
          box-shadow: none;
        }
      }
    }

    .multiple-select-search-list {
      padding: 12px 0;

      ol {
        overflow-y: auto;
        height: 100%;
      }
      li {
        line-height: 26px;
        height: 26px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        padding: 0 4px;
        max-width: 100%;
        overflow: hidden;

        &:hover {
          background: #f5f5f5;
        }
        .ellipsis {
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }
      }
    }
  }
  .multiple-select-show {
    flex: 1;
    .selected-labels {
      height: 100%;
      overflow: auto;
    }
    .ivu-tooltip-popper {
      position: relative;
      z-index: 1000;
    }
  }
  .multiple-select-card {
    display: flex;
    flex-direction: column;
    padding: 0 14px;
    border: 1px solid #ccc;
    border-radius: 4px;

    .multiple-select-card-title {
      font-size: 14px;
      color: #333;
      padding: 10px 0;
      line-height: 16px;
    }
    .multiple-select-head {
      height: 40px;
    }

    .multiple-select-body {
      height: 100%;
      overflow-y: auto;
      & ::-webkit-scrollbar {
        width: 5px;
        height: 12px;
        background-color: #e8e8e8;
      }
    }
  }
}
</style>