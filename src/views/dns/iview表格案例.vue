<template>
    <main class="clearfix">
        <!-- 菜单 -->
        <menu-nav></menu-nav>
        <section class="content fr">
          <!-- iview table案例 -->
          <div class="index-main clusterMg t-box">
            dns
            <!-- <div class="header-title">
                <span class="tit">设备管理</span>
                <div class="button-box fr">
                  <i-button type="primary" class="me-button add-btn" icon="md-add">新增</i-button>
                </div>
            </div>
            <div class="table-box iview-table">
                <div class="table-s">
                  <Table 
                    border 
                    :columns="columns" 
                    :data="data" 
                    :disabled-hover="true">
                  </Table>
                </div>
                <Page show-sizer :page-size="20" :page-size-opts="[10, 20, 30]" :total="100" show-total show-elevator/>
            </div> -->
          </div>
        </section>
    </main>
</template>

<script>
import menuNav from '@/components/Menu';

export default {
  name: 'dnsLayout',
  data () {
    return {
     columns: [{
        title: '设备名',
        key: 'date1',
        sortable: true,
        align: 'center',
        width: 118
      },
      {
        title: '设备类型',
        key: 'date2',
        align: 'center',
        width: 118
      },
      {
        title: '集群组',
        key: 'date3',
        align: 'center',
        width: 115
      },
      {
        title: 'IPv4管理地址',
        key: 'date4',
        align: 'center',
        width: 185
      },
      {
        title: 'IPv6管理地址',
        key: 'date5',
        align: 'center',
        width: 185
      },
      {
        title: '物理状态监控',
        slot: 'date6',
        align: 'center',
        width: 130,
        render: (h, params) => {
          return h('span', {
            class: 'state err'
          }, '离线');
        }
      },
      {
        title: '服务状态监控',
        slot: 'date7',
        align: 'center',
        width: 130,
        render: (h, params) => {
          return h('Tooltip', {
            props: {
              placement: "right"
            }
          },[
            '在线',
            [
              h('p', { slot: 'content'},'CPU:12.8%'),
              h('p', { slot: 'content'},'内存:3/16GB'),
              h('p', { slot: 'content'},'磁盘:100/1000GB')
            ]
          ]);
        }
      },
      {
        title: '统计分析',
        slot: 'date8',
        sortable: true,
        align: 'center',
        width: 155,
        render: (h, params) => {
          return h('div', [
              h('a', {
              }, '并发量'),
              h('span', {
              }, ' '),
              h('a', {
              }, '网络流量')
          ]);
        }
      },
      {
        title: '操作',
        slot: 'date9',
        align: 'center',
        width: 410,
        render: (h, params) => {
          return h('div', [
              h('Button', {
                class: 'k-btn',
              }, '服务管理'),
              h('Button', {
                class: 'k-btn',
              }, '修改'),
              h('Button', {
                class: 'k-btn',
              }, '重启'),
              h('Button', {
                class: 'k-btn',
              }, '停用'),
              h('Button', {
                class: 'k-btn',
              }, '删除')
          ]);
        }
      }],
      data: [{
        date1: 'ate1',
        date2: '设备类型',
        date3: '集群组',
        date4: 'IPv4管理地址',
        date5: 'IPv6管理地址'
      },{
        date1: 'ate1',
        date2: '设备类型',
        date3: '集群组',
        date4: 'IPv4管理地址',
        date5: 'IPv6管理地址'
      }]
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
