<template>
    <main class="clearfix">
        <!-- 菜单 -->
        <menu-dhcp></menu-dhcp>
        <section class="content">
          <router-view></router-view>
        </section>
    </main>
</template>

<script>
import menuDhcp from '../components/MenuDhcp';

export default {
  name: 'DhcpLayout',
  data () {
    return {
     
    }
  },
  mounted () {
   
  },
  components: {
      menuDhcp
  }
}
</script>

<style lang="less">
  @import '../assets/less/dns';
</style>
