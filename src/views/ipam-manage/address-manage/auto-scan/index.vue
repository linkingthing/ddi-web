<template>
  <ModalCustom 
    :visible.sync="dialogVisible"
    title="自动扫描设置"
    @confirm="handleConfirm"
  >
    <IviewLoading v-if="loading" />

    <div>
      <div class="info-row">
        <div class="info-row-label">扫描频率</div>
        <Select v-model="frequency" style="width:260px">
          <Option
            v-for="item in frequencies"
            :value="item.value"
            :key="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
      </div>
      <div class="info-row">
        <div class="info-row-label">开始时间</div>
        <TimePicker
          format="HH:mm"
          v-model="startTime"
          placeholder="请选择开始时间"
          style="width: 260px" />
      </div>
    </div>
  </ModalCustom>
</template>

<script>
import ModalCustom from "@/components/ModalCustom";

const frequencies = [
  {
    label: "每月",
    value: "每月"
  },
  {
    label: "每周",
    value: "每周"
  },
  {
    label: "每天",
    value: "每天"
  }
];

export default {
  components: {
    ModalCustom
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    data: {
      type: Array,
      default: () => []
    },

    url: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      loading: false,
      dialogVisible: false,
      frequencies,
      frequency: "每月",
      startTime: ""
    };
  },

  watch: {
    visible(val) {
      if (!val) return;
      
      this.dialogVisible = val;
    },

    dialogVisible(val) {
      this.init();

      this.$emit("update:visible", val);
    }
  },

  methods: {
    init() {
      this.frequency = "每月";
      this.startTime = "";
    },

    async handleConfirm() {
      try {
        await this.validate();

        this.loading = true;
        
        await this.$post();

        this.$emit("confirmed");
      } 
      catch (err) {
        console.error(err);

        this.$$error(err && err.message);

        return Promise.reject();
      }
      finally {
        this.loading = false;
      }
    },

    validate() {
      let { startTime } = this;
      
      if (!startTime) {
        return Promise.reject({ message: "请选择开始时间" });
      }

      return Promise.resolve();
    },

    getParams() {
      return {
        startTime: this.startTime,
        frequency: this.frequency,
        ids: this.data.map(item => item.id)
      };
    }
  }
};
</script>