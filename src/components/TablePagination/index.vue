<template>
  <div
    class="table-pagination"
    :class="{'is-padding-top': isPaddingTop}"
  >

    <article class="table-pagination-top">
      <div class="top-left">
        <slot name="top-left" />
      </div>

      <div class="top-right">
        <slot name="top-right" />
      </div>
    </article>

    <slot name="neck" />

    <Table
      v-if="showTable"
      :data="dataFilter"
      :columns="columns"
      v-on="$listeners"
    />

    <slot />

    <article
      v-if="paginationEnable"
      class="table-pagination-footer"
    >
      <Page
        :current="current"
        :total="total"
        :page-size="size"
        prev-text="上一页"
        next-text="下一页"
        @on-change="handlePageChange"
      />
    </article>
  </div>
</template>

<style lang="less">
@import "./index.less";
</style>

<script>
export default {
  name: "TablePagination",

  props: {
    title: {
      type: String,
      default: ""
    },

    columns: {
      type: Array,
      default: null
    },

    data: {
      type: Array,
      default: () => []
    },

    calcHeight: {
      type: Boolean,
      default: false
    },

    paginationEnable: {
      type: Boolean,
      default: true
    },

    tableAutoInnerHeight: {
      type: Boolean,
      default: false
    },

    showTable: {
      type: Boolean,
      default: true
    },

    isPaddingTop: {
      type: Boolean,
      default: false
    },

    total: {
      type: Number,
      default: 0
    },

    current: {
      type: Number,
      default: 1
    },

    size: {
      type: Number,
      default: 10
    }
  },

  data() {
    return {
      tableHeight: "auto",
      tableKey: Math.random()
        .toString(36)
        .slice(2),

      slotNames: [],
      innerCurrent: 1
    };
  },

  computed: {
    dataFilter() {
      if (this.data.length > this.size) {
        const start = (this.innerCurrent - 1) * this.size;
        return this.data.slice(start, start + this.size);
      } else {
        return this.data;
      }
    }
  },

  watch: {
    current(val) {
      this.innerCurrent = val;
    },
    calcHeight(val) {
      if (!val) return;

      this.setTableHeight();

      this.$emit("update:calc-height", false);
    },

    columns(val) {
      if (val.length) {
        let names = [];

        val.forEach(col => {
          if (col.slot) {
            names.push(col.slot);
          }
        });

        this.slotNames = names;
      }
    },

    data: {
      immediate: true,
      async handler(newVal, oldVal) {
        if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;

        this.setTableHeight();
      }
    }
  },

  methods: {
    async setTableHeight() {
      if (this.tableAutoInnerHeight) return;

      await this.$nextTick();

      const el = this.$el;
      const height = el.clientHeight;

      let titleEl = el.querySelector(".table-pagination-title"),
        topEl = el.querySelector(".table-pagination-top"),
        footerEl = el.querySelector(".table-pagination-footer");

      this.tableHeight = height
        - (titleEl ? titleEl.clientHeight : 0)
        - (topEl ? topEl.clientHeight : 0)
        - (footerEl ? footerEl.clientHeight : 0);
    },

    handlePageSizeChange(val) {
      this.$emit("size-change", {
        size: val,
        page: this.page
      });
    },

    handlePageChange(val) {
      this.innerCurrent = val;
      this.$emit("page-change", {
        current: val,
        size: this.size
      });
    }
  }
};
</script>

