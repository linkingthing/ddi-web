<template>
    <main class="clearfix">
        <!-- 菜单 -->
        <menu-nav-sys></menu-nav-sys>
        <section class="content">
          <router-view></router-view>
        </section>
    </main>
</template>

<script>
import menuNavSys from '../components/MenuSys';

export default {
  name: 'sysLayout',
  data () {
    return {
     
    }
  },
  mounted () {
   
  },
  components: {
      menuNavSys
  }
}
</script>

<style lang="less">
  @import '../assets/less/sys';
</style>
