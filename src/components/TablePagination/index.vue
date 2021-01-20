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

    <template v-if="showTable">
      <Table
        v-if="tableInnerHeight"
        :data="data"
        :columns="columns"
        :max-height="tableInnerHeight"
        v-on="$listeners"
        border
      />
      <Table
        v-else
        :data="data"
        :columns="columns"
        v-on="$listeners"
        border
        stripe
      />
    </template>

    <slot />

    <article
      v-if="showPage"
      class="table-pagination-footer"
    >
      <Page
        :current.sync="innerCurrent"
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

import { throttle } from "lodash";


let pageDataChangeFlat = false;

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

    paginationEnable: {
      type: Boolean,
      default: true
    },

    showTable: {
      type: Boolean,
      default: true
    },

    tableInnerHeight: {
      type: [String, Number],
      default: null
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
    showPage() {
      return this.paginationEnable || this.data.length > this.size;
    }
  },

  watch: {
    current: {
      deep: true,
      immediate: true,
      handler(val, old) {
        this.innerCurrent = val;

        if (val !== old && val > 0) {
          const { query } = this.$route;
          this.$router.replace({ query: { ...query, current: val } });
        }
      }
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
      deep: true,
      handler() {
        pageDataChangeFlat = true;
      }
    }

  },

  created() {
    const { query } = this.$route;
    if (query.current) {
      this.$emit("update:current", +query.current);
    } else {
      this.$emit("update:current", 1);
    }
    setInterval(() => {
      pageDataChangeFlat = true;
    }, 2000);
  },

  methods: {
    handlePageSizeChange(val) {
      this.$emit("size-change", {
        size: val,
        page: this.page
      });
    },

    handlePageChange(val) {
      if (pageDataChangeFlat) {
        pageDataChangeFlat = false;
        const { query } = this.$route;
        this.$router.push({ query: { ...query, current: val } });

        this.$emit("update:current", val);

        this.$emit("page-change", {
          current: val,
          size: this.size
        });
      }

    }
  }
};
</script>

