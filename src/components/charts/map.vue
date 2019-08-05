<template>
  <!-- <div id="map" ref="dom" class="charts chart-map"></div> -->
  <div class="eq_may">
    <Button class="back" @click="back_map" type="info">返回</Button>
    <!-- <div class="map_tips" v-if="is_tip_show" :style="{top: top + 'px', left: left + 'px'}">
      <div v-cloak class="map_tips_city">{{eq_num.name}}</div>
      <div class="map_tips_group">
        <div class="map_tips_lol">地磁设备：{{eq_num.a}}万个</div>
        <div class="map_tips_king">井盖设备：{{eq_num.b}}万个</div>
        <div class="map_tips_cf">路灯设备：{{eq_num.c}}万个</div>
        <div class="map_tips_car">定位器设备：{{eq_num.d}}万个</div>
      </div>
    </div> -->
    <div style="height:670px;" id="map" ref="map"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import './map.less'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartMap',
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data () {
    return {
      opts: {},
      district: {},
      cityName: '中国',
      cityCenter: [34.915085, 116.368324],
      areaCode: 10000,
      geoJsonData: '',
      echartsMap: null,
      map: null,
      cityCode: 100000,
      mapData: [],
      deepTree: [
        { mapData: this.mapData, code: 100000 }
      ],
      is_tip_show: false,
      eq_num: {
        name: '北京',
        a: 10000,
        b: 10001,
        c: 10002,
        d: 10003
      },
      selcityCode: '',
      top: 0,
      left: 0,
      count: 0,
      timeTicket: null,
      time_tip: 1
    }
  },
  methods: {
    back_map () {
      if (this.deepTree.length > 1) {
        if (this.deepTree.length === 2) {
          this.cityCenter = [34.915085, 116.368324]
        } else {
          console.log(this.deepTree[this.deepTree.length - 1])
          this.cityCenter = this.deepTree[this.deepTree.length - 1].center
        }
        this.mapData = this.deepTree[this.deepTree.length - 1].mapData
        this.deepTree.pop()
        console.log(this.deepTree)
        this.loadMapData(this.deepTree[this.deepTree.length - 1].code)
      }
    },
    resize () {
      this.echartsMap.resize()
    },
    getData (data, level, adcode) {
      var subList = data.districtList
      if (subList) {
        var curlevel = subList[0].level
        if (curlevel === 'street') {
          console.log(subList)
          let mapJsonList = this.geoJsonData.features
          let mapJson = {}
          for (let i in mapJsonList) {
            if (mapJsonList[i].properties.name === this.cityName) {
              mapJson.features = [].concat(mapJsonList[i])
            }
          }
          this.mapData = []
          this.mapData.push({
            name: this.cityName,
            value: Math.random() * 100,
            level: curlevel
            // center: [ subList[i].center.lat, subList[i].center.lng ]
          })
          this.loadMap(this.cityName, mapJson)
          this.geoJsonData = mapJson
          return
        }
        this.mapData = []
        for (var i = 0, l = subList.length; i < l; i++) {
          var name = subList[i].name
          var cityCode = subList[i].adcode
          var center = [ subList[i].center.lat, subList[i].center.lng ]
          this.mapData.push({
            name: name,
            value: (Math.random() * 100).toFixed(2),
            cityCode: cityCode,
            level: curlevel,
            center: center
          })
        }
        this.loadMapData(adcode)
        this.timeTick()
      }
    },
    loadMapData (areaCode) {
      AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
        var districtExplorer = window.districtExplorer = new DistrictExplorer({
          eventSupport: true,
          map: this.map
        })
        districtExplorer.loadAreaNode(areaCode, (error, areaNode) => {
          if (error) {
            console.error(error)
            return
          }
          let mapJson = {}
          mapJson.features = areaNode.getSubFeatures()
          this.loadMap(this.cityName, mapJson)
          this.geoJsonData = mapJson
        })
      })
    },
    loadMap (mapName, data) {
      if (data) {
        echarts.registerMap(mapName, data)
        var option = {
          visualMap: {
            type: 'piecewise',
            pieces: [
              { max: 30, label: '安全', color: '#50a3ba' },
              { min: 30, max: 60, label: '警告', color: '#eac736' },
              { min: 60, label: '危险', color: '#d94e5d' }
            ],
            color: '#000',
            textStyle: {
              color: '#000'
            },
            visibility: 'off'
          },
          tooltip: {
            padding: 0,
            enterable: true,
            transitionDuration: this.time_tip,
            textStyle: {
              color: '#000',
              decoration: 'none'
            },
            backgroundColor: 'rgba(0, 0, 0, 0)',
            formatter: (params) => {
              let tipHtml = ''
              tipHtml = '<div class="map_tips">' +
              '<div v-cloak class="map_tips_city">' + params.name.substr(0, 2) + '</div>' +
              '<div class="map_tips_group">' +
                '<div class="map_tips_lol">地磁设备：' + params.data.value + '万个</div>' +
                '<div class="map_tips_king">井盖设备：' + params.data.value + '万个</div>' +
                '<div class="map_tips_cf">路灯设备：' + params.data.value + '万个</div>' +
                '<div class="map_tips_car">定位器设备：' + params.data.value + '万个</div>' +
              '</div>' +
              '</div>'
              return tipHtml
            }
          },
          series: [
            {
              name: '数据名称',
              type: 'map',
              roam: true,
              zoom: 1.5,
              center: [this.cityCenter[1], this.cityCenter[0]],
              mapType: mapName,
              selectedMode: 'single',
              showLegendSymbol: false,
              visibility: 'off',
              itemStyle: {
                normal: {
                  color: '#ccc',
                  areaColor: '#fff',
                  borderColor: '#fff',
                  borderWidth: 0.5,
                  label: {
                    show: true,
                    textStyle: {
                      // color: 'rgb(249, 249, 249)'
                      color: '#000'
                    }
                  }
                },
                emphasis: {
                  areaColor: false,
                  borderColor: '#fff',
                  areaStyle: {
                    color: '#fff'
                  },
                  label: {
                    show: true,
                    textStyle: {
                      color: 'rgb(249, 249, 249)'
                    }
                  }
                }
              },
              data: this.mapData
            }
          ]
        }
        this.echartsMap.setOption(option)
        on(window, 'resize', this.resize)
      }
    },
    echartsMapClick (params) {
      if (params.data.level === 'street') return
      this.cityCode = params.data.cityCode
      this.cityName = params.data.name
      this.cityCenter = params.data.center
      this.district.search(this.cityCode, (status, result) => {
        if (status === 'complete') {
          this.deepTree.push({ mapData: this.mapData, code: params.data.cityCode, center: params.data.center })
          this.getData(result.districtList[0], params.data.level, this.cityCode)
        }
      })
    },
    echartsMapMove (params) {
      console.log('移入')
      this.time_tip = 0
      clearInterval(this.timeTicket)
      this.echartsMap.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: params.dataIndex
      })
    },
    echartsMapOut () {
      console.log('移出')
      this.time_tip = 1
      let dataLength = this.mapData.length
      clearInterval(this.timeTicket)
      this.timeTicket = setInterval(() => {
        this.echartsMap.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: (this.count) % dataLength
        })
        this.count++
      }, 5000)
    },
    timeTick () {
      let dataLength = this.mapData.length
      clearInterval(this.timeTicket)
      this.timeTicket = setInterval(() => {
        this.echartsMap.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: (this.count) % dataLength
        })
        this.count++
      }, 5000)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.echartsMap = echarts.init(this.$refs.map)
      this.echartsMap.on('click', this.echartsMapClick)
      this.echartsMap.on('mousemove', this.echartsMapMove)
      this.echartsMap.on('mouseout', this.echartsMapOut)
      this.opts = {
        subdistrict: 1,
        showbiz: false
      }
      this.district = new AMap.DistrictSearch(this.opts)
      this.district.search('中国', (status, result) => {
        if (status === 'complete') {
          this.getData(result.districtList[0], '', 100000)
        }
      })
      // let legend = this.value.map(_ => _.name)
      // let option = {
      //   title: {
      //     text: this.text,
      //     subtext: this.subtext,
      //     x: 'center'
      //   },
      //   tooltip: {
      //     trigger: 'item',
      //     formatter: '{a} <br/>{b} : {c} ({d}%)'
      //   },
      //   legend: {
      //     orient: 'vertical',
      //     left: 'left',
      //     data: legend
      //   },
      //   series: [
      //     {
      //       type: 'pie',
      //       radius: '55%',
      //       center: ['50%', '60%'],
      //       data: this.value,
      //       itemStyle: {
      //         emphasis: {
      //           shadowBlur: 10,
      //           shadowOffsetX: 0,
      //           shadowColor: 'rgba(0, 0, 0, 0.5)'
      //         }
      //       }
      //     }
      //   ]

      // }
      // this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      // this.dom.setOption(option)
      // on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
