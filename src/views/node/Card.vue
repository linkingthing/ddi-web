<template>
  <div class="Card card-item">
    <header>
      <h3>
        {{title}}
      </h3>
      <div>
        <slot name="right" />
        <Button
          v-if="download.url"
          type="primary"
          @click="handleDownload"
        >导出CSV</Button>
        <Select
          v-if="hasTimeFilter"
          style="width: 110px; margin-left: 20px"
          v-model="value"
        >
          <Option
            v-for="(item) in dateList"
            :key="item.hours"
            :value="item.hours"
          >{{item.label}}</Option>
        </Select>
      </div>
    </header>

    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    download: {
      type: Object,
      default: () => ({})
    },
    hasTimeFilter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.dateList = [
      {
        label: "6小时",
        hours: 6 // from
      },
      {
        label: "12小时",
        hours: 12
      },
      {
        label: "1天",
        hours: 24
      },
      {
        label: "7天",
        hours: 168
      },
      {
        label: "1个月",
        hours: 720
      },
      {
        label: "3个月",
        hours: 148
      }
    ];
    return {
      value: 6
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.$emit("input", val);
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleDownload() {
      console.log(this.download)
      const url = `${this.download.self}?action=exportcsv`;
      const params = {
        period: this.value
      };

      this.$post({ url, params }).then(res => {
        const downloadPath = this.pathParser(res);
      });

    },
    pathParser({ path }) {
      const realPath = "/opt/website";
      const staticPath = "/public";
      return staticPath.concat(path.slice(realPath.length));
    },

    downloadFile(path) {
      let a = document.createElement("a");
      a.href = path;
      a.download = "csv file";
      a.click();
    }
  }
};
</script>

<style lang="less" scoped>
.Card {
  padding: 28px 25px;
  background: #fff;
  header {
    display: flex;
    justify-content: space-between;
  }
  h3 {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    line-height: 32px;
    span {
      font-size: 16px;
      color: #929292;
      padding: 0 15px;
    }
  }
}
</style>