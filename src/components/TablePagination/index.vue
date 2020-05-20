<template>
  <div class="table-pagination" :class="{'is-padding-top': isPaddingTop}">
    <!-- <h3 v-if="getTitle" class="table-pagination-title">{{ getTitle }}</h3> -->

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
      :data="data"
      :columns="columns"
      v-on="$listeners"
    />

    <slot />

    <article
      v-if="paginationEnable"
      class="table-pagination-footer"
    >
      <Page
        :current="currentPage"
        :total="totalPage"
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
    }
  },

  data() {
    return {
      tableHeight: "auto",
      tableKey: Math.random()
        .toString(36)
        .slice(2),

      totalPage: 0,
      currentPage: 0,

      slotNames: []
    };
  },

  computed: {
    // getTitle() {
    //   let title = this.$route.meta.title;

    //   if (!title || title.indexOf(":") === 0) {
    //     title = this.title;
    //   }

    //   return title;
    // }
  },

  watch: {
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
      this.$emit("page-change", {
        page: val,
        size: this.size
      });
    }
  }
};
</script>

