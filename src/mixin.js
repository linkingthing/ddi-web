// mixins模块
export default {
  data() {
    return {
      tableHeight: 0, // ele表格高度
      docHeight: 0 // 浏览器文档高度
    };
  },
  beforeCreate() {
    this.$ipTypes = {
      ipv4: "ipv4",
      ipv6: "ipv6"
    };
  },
  mounted() {
    // ele表格高度
    if (this.$refs.ele) {
      this.tableHeight = this.$refs.ele.offsetHeight + 8;
    }

    this.docHeight = document.documentElement.clientHeight;

 
    // window.onresize = function(){
    //   location.reload();
    // };
  },
  methods: {
    filtersVariable(index,variable) {
      this.columns[index].filters = variable;
    }
  },
  watch: {
    tableHeight() {
      if (this.$refs.ele) {
        this.tableHeight = this.$refs.ele.offsetHeight + 8;
      }
    }
  }
};