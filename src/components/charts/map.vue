<template>
  <!-- <div id="map" ref="dom" class="charts chart-map"></div> -->
  <div class="eq_may">
    <Button class="back" @click="back_map" type="info">返回</Button>
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
      areaCode: 10000,
      geoJsonData: '',
      echartsMap: null,
      map: null,
      cityCode: 100000,
      mapData: [],
      deepTree: [
        { mapData: this.mapData, code: 100000 }
      ]
    }
  },
  methods: {
    back_map () {
      if (this.deepTree.length > 1) {
        this.mapData = this.deepTree[this.deepTree.length - 1].mapData
        this.deepTree.pop()
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
          let mapJsonList = this.geoJsonData.features
          console.log(this.geoJsonData)
          console.log(mapJsonList)
          console.log(this.cityName)
          let mapJson = {}
          for (let i in mapJsonList) {
            if (mapJsonList[i].properties.name === this.cityName) {
              mapJson.features = [].concat(mapJsonList[i])
              console.log(mapJson)
            }
          }
          this.mapData = []
          this.mapData.push({ name: this.cityName, value: Math.random() * 100, level: curlevel })
          this.loadMap(this.cityName, mapJson)
          this.geoJsonData = mapJson
          return
        }
        this.mapData = []
        for (var i = 0, l = subList.length; i < l; i++) {
          var name = subList[i].name
          var cityCode = subList[i].adcode
          this.mapData.push({
            name: name,
            value: Math.random() * 100,
            cityCode: cityCode,
            level: curlevel
          })
        }
        this.loadMapData(adcode)
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
              { max: 30, label: '安全', color: '#2c9a42' },
              { min: 30, max: 60, label: '警告', color: '#d08a00' },
              { min: 60, label: '危险', color: '#c23c33' }
            ],
            color: '#000',
            textStyle: {
              color: '#000'
            },
            visibility: 'off'
          },
          series: [
            {
              name: '数据名称',
              type: 'map',
              roam: false,
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
      this.district.search(this.cityCode, (status, result) => {
        if (status === 'complete') {
          this.deepTree.push({ mapData: this.mapData, code: params.data.cityCode })
          this.getData(result.districtList[0], params.data.level, this.cityCode)
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.echartsMap = echarts.init(this.$refs.map)
      this.echartsMap.on('click', this.echartsMapClick)
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
