<template>
  <div
    class="CommonScroller"
    v-scroll="{scrollHander}"
  >
    <div
      class="CommonScrollerView"
      v-scrollView="{data,itemSize}"
    >
      <div
        class="CommonScrollerItem"
        v-for="(item) in renderData"
        :key="item.id"
        :style="item.style"
      >
        <slot
          :item="item"
          :index="item._index"
        ></slot>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  components: {},
  props: {
    data: {
      type: Array,
      default: () => ([])
    },

    buffer: {
      type: Number,
      default: 50
    },
    keyField: {
      type: String,
      default: "id"
    }

  },
  directives: {
    scroll: {
      bind: function (el, { value }) {
        const { scrollHander } = value;
        el.addEventListener("scroll", _.debounce(scrollHander, 300))

      },
      unbind: function (el) { }
    },
    scrollView: {
      bind: function (el, { value }) {
        console.log(el, this, data)
        const { data, itemSize } = value;
        el.style.height = data.length * itemSize + "px";

      },
      inserted: function (el, { value }) {
        console.dir(el.firstChild)

        console.log(el.firstChild.clientHeight, "inserted")
        // value.itemSize = el.firstChild.clientHeight
      },
      unbind: function (el) { }
    }
  },
  data() {
    return {
      scrollTop: 0,
      itemSize: 48,
    };
  },
  computed: {
    // 渲染的50个
    renderData() {
      const itemSize = this.itemSize || 48;
      const scrollTop = this.scrollTop;
      const height = this.data.length * itemSize;
      const prevLoader = 80;

      let startIndex = Math.floor(scrollTop / itemSize) - prevLoader;
      if (startIndex < 0) {
        startIndex = 0;
      }
      let endIndex = startIndex + this.buffer;
      if (endIndex > this.data.length) {
        endIndex = this.data.length;
      }

      console.log(startIndex, endIndex)

      return this.data.map((item, index) => {
        return {
          ...item,
          _index: index
        }
      }).slice(startIndex, endIndex).map(item => {
        return {
          ...item,
          style: `transform: translateY(${item._index * itemSize}px)`
        }
      })
    }
  },
  watch: {},
  created() { },
  mounted() { },
  methods: {
    scrollHander(e) {
      const { scrollTop } = e.target;
      this.scrollTop = scrollTop;
      console.log(e, scrollTop)
    }
  }
};
</script>

<style lang="less" scoped>
.CommonScroller {
  height: 100%;
  flex: 1;
  overflow: auto;
  .CommonScrollerView {
    position: relative;
    .CommonScrollerItem {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      will-change: transform;
    }
  }
}
</style>