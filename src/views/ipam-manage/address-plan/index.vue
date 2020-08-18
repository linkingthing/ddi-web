<template>
  <div class="plan">
    <div
      style=""
      class="plan-content"
    >
      <PlanTab />
      <PlanProcess />

      <PlanStepCreatePrefix />
      <PlanStepSemantic />
    </div>

  </div>
</template>

<style lang="less">
.plan {
  padding-top: 60px;
}
.plan-content {
  padding: 24px;
  border-top: 1px solid #efefef;
}
</style>

<script>
import PlanTab from "./modules/PlanTab";
import PlanProcess from "./modules/PlanProcess";
import PlanStepCreatePrefix from "./modules/PlanStepCreatePrefix";
import PlanStepSemantic from "./modules/PlanStepSemantic";
import { columns } from "./define";

export default {
  components: {
    PlanTab,
    PlanProcess,
    PlanStepCreatePrefix,
    PlanStepSemantic
  },

  data() {
    return {
      url: this.$getApiByRoute().url,
      loading: true,
      tableData: [],
      columns: columns(this),
      showCreate: false
    };
  },

  mounted() {
    this.handleQuery();
  },

  methods: {
    async handleQuery() {
      this.loading = true;

      try {
        let { data } = await this.$get({ url: this.url });

        this.tableData = data.map(item => {
          item.creationTimestamp = this.$trimDate(item.creationTimestamp);

          return item;
        });
      } catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    },

    handleViewLayouts(data) {
      this.$router.push(`/address/ipam/plans/${data.id}/layouts?prefix=${data.prefix}&maskLen=${data.maskLen}`);
    },

    handleAdd() {
      this.showCreate = true;
    },

    handleSaved() {
      this.showCreate = false;

      this.handleQuery();
    },

    async handleDelete({ id }) {
      try {
        await this.$$confirm({ content: "您确定要删除当前数据吗？" });

        this.loading = true;

        await this.$delete({ url: this.url + "/" + id });

        this.$$success("删除成功！");

        this.handleQuery();
      }
      catch (err) {
        this.$handleError(err);
      }
      finally {
        this.loading = false;
      }
    }
  }
};
</script>