<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="6" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <chart-map style="height: 670px;" :value="pieData" text="用户访问来源"></chart-map>
      </Card>
    </Row>
    <!-- <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row> -->
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartMap } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    Example,
    ChartMap
  },
  data () {
    return {
      inforCardData: [
        { title: '设备总数', icon: 'md-cloud', count: 803, color: '#2d8cf0' },
        { title: '在线设备', icon: 'md-cloud-done', count: 232, color: '#19be6b' },
        { title: '离线设备', icon: 'md-cloud-download', count: 142, color: '#ff9900' },
        { title: '报警设备', icon: 'ios-thunderstorm', count: 657, color: '#ed3f14' }
      ],
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
