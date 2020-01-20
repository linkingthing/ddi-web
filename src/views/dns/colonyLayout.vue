<template>
    <main class="clearfix">
        <!-- 菜单 -->
        <menu-colony></menu-colony>
        <section class="content">
          <router-view></router-view>
        </section>
    </main>
</template>

<script>
import MenuColony from '@/components/MenuColony';

export default {
  name: 'colonyLayout',
  data () {
    return {
     
    }
  },
  mounted () {
   
  },
  components: {
      MenuColony
  }
}
</script>

<style lang="less">
  @import '../assets/less/sys';
</style>