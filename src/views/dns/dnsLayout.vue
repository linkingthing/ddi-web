<template>
    <main class="main-content">
        <!-- 菜单 -->
        <menu-nav-dns></menu-nav-dns>
        <section class="content">
          <router-view></router-view>
        </section>
    </main>
</template>

<script>
import menuNavDns from './MenuDns';

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

<style lang="less" scoped>
.main-content {
  position: absolute;
  margin: 0;
  bottom: 70px;
  top: 60px;
}

.content {
  height: 100%;
}
</style>