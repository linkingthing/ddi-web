<template>
  <div class="Card card-item">
    <header>
      <h3>
        {{title}}
      </h3>
      <div>
        <slot name="right" />
        <Button
          v-if="download.self"
          type="primary"
          @click="handleDownload"
        >导出CSV</Button>
        <DatePicker
          :value="innerValue"
          @on-change="handleDataChange"
          type="date"
          placeholder="请选择日期"
          style="width: 120px"
        ></DatePicker>

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
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      innerValue: ""
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.innerValue = val;
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleDownload() {
      const url = `${this.download.self}?action=exportcsv`;
      const params = {
        period: this.value
      };

      this.$post({ url, params }).then(res => {
        const { downloadPath, fileName } = this.pathParser(res);
        this.downloadFile(downloadPath, fileName);
      });

    },
    pathParser({ path }) {
      const realPath = "/opt/website";
      const staticPath = "/public/";
      const fileName = path.slice(realPath.length + 1);
      return {
        downloadPath: staticPath.concat(fileName),
        fileName
      };
    },

    downloadFile(path, fileName) {
      let a = document.createElement("a");
      a.href = path;
      a.download = fileName;
      a.click();
    },

    handleDataChange(date) {
      this.$emit("input", date);
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