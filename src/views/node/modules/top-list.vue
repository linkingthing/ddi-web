<template>
  <div class="top-list">
    <Timeout
      v-if="isTimeOut"
      style="height: 312px;"
    />

    <ul v-else-if="data && data.length">
      <li
        class="top-item"
        v-for="(item, index) in data"
        :key="item[rowKey]"
      >
        <div
          v-for="(column, i) in columns"
          :key="i"
          :style="`${getStyle(column)}; text-align: ${column.align}`"
        >
          <template v-if="column.type === 'index'">

            <span class="index">{{index + 1}}</span>
          </template>
          <template v-else-if="typeof column.render==='function'">
            <exSlot
              :render="column.render"
              :row="item"
              :index="index"
              :column="column"
            />
          </template>
          <template v-else> {{item[column.key]}}</template>
        </div>

      </li>
    </ul>
    <NoDataFigure v-else />

  </div>
</template>

<script>
import NoDataFigure from "../NoDataFigure";

import Timeout from "@/components/Timeout";

const exSlot = {
  functional: true,
  render: (h, context) => {
    const params = {
      row: context.props.row,
      index: context.props.index
    };
    if (context.props.column) params.column = context.props.column;
    return context.props.render(h, params);
  }
};


export default {
  components: { NoDataFigure, exSlot, Timeout },
  props: {
    isTimeOut: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: "id"
    }
  },
  data() {
    return {
    };
  },
  computed: {

  },
  watch: {},
  created() {
  },
  mounted() { },
  methods: {
    getStyle(column) {
      return column.width ? `width: ${column.width}px` : "flex: 1";
    }
  }
};
</script>

<style lang="less" scoped>
.top-list {
  .top-item {
    display: flex;
    color: #222;
    font-size: 14px;
    padding: 18px 0;
    line-height: 24px;

    .index {
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      text-align: center;
      line-height: 24px;
      color: #fff;
      background: #b3b3b3;
    }
    &:first-child {
      .index {
        background: #4586fe;
      }
    }
    &:nth-child(2) {
      .index {
        background: #5dd48a;
      }
    }
    &:nth-child(3) {
      .index {
        background: #fead45;
      }
    }
  }
}
</style>