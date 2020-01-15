<template>
    <main class="clearfix">
        <!-- 菜单 -->
        <menu-nav-dns></menu-nav-dns>
        <section class="content">
          <router-view></router-view>
        </section>
    </main>
</template>

<script>
import menuNavDns from '../components/MenuDns';

export default {
  name: 'DnsLayout',
  data () {
    return {
     
    }
  },
  mounted () {
   
  },
  components: {
      menuNavDns
  }
}
</script>

<style lang="less">
  @import '../assets/less/dns';
</style>
