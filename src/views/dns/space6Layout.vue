<template>
   <main class="clearfix">
        <!-- 菜单 -->
        <menuNav ref="menuNav"></menuNav>
        <section class="content" ref="contentRef">
            <router-view></router-view>
        </section>
    </main>
</template>

<script>
import menuNav from '@/components/Menu';

export default {
  name: 'space6Layout',
  data () {
    return {
     
    }
  },
  mounted () {
    
  },
  components: {
      menuNav
  }
}
</script>

<style scoped>

</style>
