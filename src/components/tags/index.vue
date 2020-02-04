<template>
  <div class="myTag">
    <template v-if="list.length>3">
      <Tag
        color="default"
        v-for="value in unfold ? list : list.slice(0, 3) "
        :key="value.id"
      >{{value.name}}</Tag>
      <Icon :type="unfold ? 'ios-arrow-up' : 'ios-arrow-down' " @click="handleUnfold" />
    </template>
    <Tag v-else color="default" v-for="value in list" :key="value.id">{{value.name}}</Tag>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      unfold: false // 默认闭合
    };
  },
  methods: {
    handleUnfold() {
      console.log(123);
      this.unfold = !this.unfold;
    }
  }
};
</script>