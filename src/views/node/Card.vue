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
        <Select
          v-if="value"
          style="width: 110px; margin-left: 20px"
          v-model="innerValue"
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
    value: {
      type: Number,
      default: 0
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
        hours: 2160
      }
    ];
    return {
      innerValue: 6
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.innerValue = val;
    },
    innerValue(val) {
      this.$emit("input", val);
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
        console.log(downloadPath)
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