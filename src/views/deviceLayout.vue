<template>
    <main class="clearfix">
        <!-- 菜单 -->
        <menu-device></menu-device>
        <section class="content">
          <router-view></router-view>
        </section>
    </main>
</template>

<script>
import menuDevice from '../components/MenuDevice';

export default {
  name: 'DhcpLayout',
  data () {
    return {
     
    }
  },
  mounted () {
   
  },
  components: {
      menuDevice
  }
}
</script>

<style lang="less">
  @import '../assets/less/dns';
</style>
