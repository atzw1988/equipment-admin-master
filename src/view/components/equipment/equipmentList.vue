<template>
  <div>
    <Card v-if="is_add_show && is_detail_show">
      <div class="search-con search-con-top">
        <Select v-model="sel_product" clearable style="width:150px" placeholder="全部产品">
          <Option v-for="item in productList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>&nbsp;
        <Select v-model="sel_operator" clearable style="width:150px" placeholder="全部运营商">
          <Option v-for="item in operatorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>&nbsp;&nbsp;
        <span>设备总数：{{eq_total}}</span>
        <Divider type="vertical" />
        <span>在线设备：{{eq_online}}</span>
        <Divider type="vertical" />
        <span>离线设备：{{eq_offline}}</span>
      </div>
      <span>我的设备</span>
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button @click="handleAdd" class="add-btn" type="success"><Icon type="search"/>&nbsp;添加设备&nbsp;</Button>
        <Button @click="handleBatch" class="add-btn" type="info"><Icon type="search"/>&nbsp;批量添加&nbsp;</Button>
        <Button @click="handleDel" class="add-btn" type="error"><Icon type="search"/>&nbsp;删除设备&nbsp;</Button>
      </div>
      <Table @on-selection-change='table_sel' border :columns="columns" :data="tableData"></Table>
      <Page :total="total_ps" size="small" show-total show-elevator show-sizer @on-change="handlepage" @on-page-size-change='handlepagesize'/>
    </Card>
    <Card v-if="!is_add_show" class="add_card">
      <div class="header">{{text_header}}</div>
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close"/>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="220">
        <span class="header_text">请选择设备运营商类型</span>
        <FormItem label="" prop="eq_kind_sel" class="check_my">
          <RadioGroup v-model="formValidate.eq_kind_sel" @on-change='check_eq_kind'>
            <Radio label="CMCC">
              <div class="check_kind" :class="formValidate.eq_kind_sel == 'CMCC'? 'active' : ''">
                <img src="../../../assets/images/yidonglogo.png" alt="" class="logo">
                <span class="name">中国移动</span>
                <div class="describe">describe</div>
              </div>
            </Radio>
            <Radio label="CT">
              <div class="check_kind" :class="formValidate.eq_kind_sel == 'CT'? 'active' : ''">
                <img src="../../../assets/images/zhongguodianxin.png" alt="" class="logo">
                <span class="name">中国电信</span>
                <div class="describe">describe</div>
              </div>
            </Radio>
          </RadioGroup>
        </FormItem>
        <span class="header_text">其他信息</span>
        <FormItem label="所属产品" prop="product">
          <Select clearable v-model="formValidate.product" placeholder="请选择设备所归属的产品">
            <Option v-for="item in eq_kind" :value='item.value' :key="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="IMEI" prop="imei">
          <Input v-model="formValidate.imei" placeholder="请输入设备IMEI号" clearable></Input>
        </FormItem>
        <FormItem label="IMSI" prop="imsi" v-if="formValidate.eq_kind_sel == 'CMCC'">
          <Input v-model="formValidate.imsi" placeholder="请输入设备IMSI号" clearable></Input>
        </FormItem>
        <FormItem label="产品名称">
          <Input v-model="formValidate.name" placeholder="请输入产品名称" clearable></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card v-if="!is_detail_show" class="detail_card">
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close_detail"/>
      <div class="header">{{sel.name}}</div>
      <div class="middle">
        <span style="margin-right:50px">归属产品：{{sel.name}}&nbsp;&nbsp;<Icon type="md-eye" size='24'/></span>
      </div>
      <div class="down">
        <Tabs type="card" @on-click="get_eq_data">
          <TabPane label="设备信息">
            <Button class="edit" type="info" @click="handleeditor">编辑</Button>
            <Row class='detail'>
              <Col span="8">
                <Col class='left detail_list last' span="12">设备名称</Col>
                <Col class="detail_list last" span="12">{{sel.name}}</Col>
              </Col>
              <Col span="8">
                <Col class='left detail_list last' span="12">归属产品</Col>
                <Col class="detail_list last" span="12">{{sel.product}}</Col>
              </Col>
              <Col span="8">
                <Col class='left detail_list last' span="12">添加时间</Col>
                <Col class="right detail_list last" span="12">{{sel.time}}</Col>
              </Col>
              <Col span="8">
                <Col class='left detail_list' span="12">归属运营商</Col>
                <Col v-if="sel.eq_kind_sel == 'CMCC'" class="detail_list" span="12">中国移动</Col>
                <Col v-if="sel.eq_kind_sel == 'CT'" class="detail_list" span="12">中国电信</Col>
              </Col>
              <Col span="8">
                <Col class='left detail_list' span="12">状态</Col>
                <Col v-if="sel.format == 'online'" class="detail_list" span="12"><Badge status="success" />在线</Col>
                <Col v-if="sel.format == 'offline'" class="detail_list" span="12"><Badge status="error" />离线</Col>
              </Col>
              <Col span="8">
                <Col class='left detail_list' span="12">最近更改时间</Col>
                <Col class="right detail_list" span="12">{{sel.up_time}}</Col>
              </Col>
              <Col span="8">
                <Col class='left detail_list' span="12">IMEI</Col>
                <Col class="detail_list" span="12">{{sel.imei}}</Col>
              </Col>
              <Col span="16">
                <Col class='left detail_list' span="8">DeviceID</Col>
                <Col class="right detail_list" span="16">{{sel.deviceId}}</Col>
              </Col>
              <Col span="24" v-if="sel.imsi">
                <Col class='left detail_list' span="4">IMSI</Col>
                <Col class="right detail_list" span="20">{{sel.imsi}}</Col>
              </Col>
            </Row>
          </TabPane>
          <TabPane label="设备数据">
            <div class="eq_data">
              <DatePicker value='yyyy年MM月dd日' v-model="time_interval" split-panels class="time_inta" type="daterange" placement="bottom-start" placeholder="请选择时间范围" style="width: 200px"></DatePicker>
              <Button @click="handleSearch_eq" class="search-btn" type="primary">&nbsp;搜索&nbsp;</Button>
              <Button @click="handleExport_eq" class="export-btn" type="info">&nbsp;导出&nbsp;</Button>
            </div>
            <div>
              <Table border :columns="detail_columns" :data="tableData"></Table>
              <Page :total="total_ps" size="small" transfer show-total show-elevator show-sizer @on-change="handlepage_eq" @on-page-size-change='handlepagesize_eq'/>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Card>
    <Modal
      title="上传文件"
      v-model="is_batch_show"
      :mask-closable="false"
      footer-hide
      class-name="vertical-center-modal">
      <div class="main_con">
        <div class="left">选择文件</div>
        <div class="right">
          <span class="right_text" id="excel_name">{{file_name}}</span>
          <input type="file" name="eq_files" id="files" @change="sel_file"
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
        </div>
      </div>
      <div style="margin-top: 10px">
        <div>
          <Button @click="get_template" type="info">下载模版</Button>
          <Button @click="submitFile" class="batch_submit" type="primary">立即提交</Button>
          <Button @click="cancelFile" class="batch_reset" type="warning">重置</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
// import Tables from '_c/tables'
import './equipmentList.less'
import { getTableData } from '@/api/data'
export default {
  name: 'tables_page',

  data () {
    return {
      sel_product: '',
      productList: [
        { value: 'one', label: '产品1' },
        { value: 'two', label: '产品2' },
        { value: 'three', label: '产品3' }
      ],
      sel_operator: '',
      operatorList: [
        { value: 'one', label: '中国移动' },
        { value: 'two', label: '中国电信' },
        { value: 'three', label: '中国联通' }
      ],
      eq_total: 1000,
      eq_online: 900,
      eq_offline: 100,
      columns: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '设备名称', key: 'name' },
        { title: 'IMEI', key: 'name' },
        { title: '运营商', key: 'email' },
        { title: '归属产品', key: 'email' },
        { title: '设备状态', key: 'email' },
        { title: '添加时间', key: 'createTime' },
        {
          title: '操作',
          key: 'handle',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, '查看'),
              h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?',
                  transfer: true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'on-ok': () => {
                    this.remove(params.index)
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, '删除')
              ])
            ])
          }
        }
      ],
      text_header: '',
      is_add_show: true,
      is_detail_show: true,
      is_editor: false,
      tableData: [],
      searchValue: '',
      total_ps: 40,
      page_index: 1,
      ps: 10,
      formValidate: {
        name: '',
        imei: '',
        imsi: '',
        eq_kind_sel: '',
        product: ''
      },
      sel_delete: [],
      ruleValidate: {
        imei: [
          { required: true, message: '设备IMEI号是必填选项', trigger: 'blur' }
        ],
        imsi: [
          { required: true, message: '移动设备的IMSI号是必填选项', trigger: 'blur' }
        ],
        eq_kind_sel: [
          { required: true, message: '请选择设备的运营商类型', trigger: 'change' }
        ],
        product: [
          { required: true, message: '请选择设备所归属的产品', trigger: 'change' }
        ]
      },
      eq_kind: [
        {
          value: '地磁',
          label: '地磁'
        },
        {
          value: '定位器',
          label: '定位器'
        },
        {
          value: '井盖',
          label: '井盖'
        },
        {
          value: '地锁',
          label: '地锁'
        }
      ],
      eq_kind_sel: 'CMCC',
      sel: {
        name: '无名路地磁1',
        imei: '123456789',
        imsi: '123456789',
        eq_kind_sel: 'CMCC',
        product: '地磁',
        time: '2019-07-23',
        format: 'online',
        up_time: '2019-07-24',
        deviceId: 'e1f4afde-be26-4887-91d2-018d83733c9d'
      },
      time_interval: '',
      detail_columns: [
        { title: '时间', key: 'createTime' },
        { title: '信息', key: 'email' }
      ],
      is_batch_show: false,
      file_name: '点击选择',
      batch_file: ''
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    // 搜索
    handleSearch () {
      console.log('搜索')
    },
    // 表单内选择
    table_sel (val) {
      console.log(val)
      this.sel_delete = val
    },
    // 添加设备
    handleAdd () {
      this.text_header = '新建设备'
      this.is_add_show = false
      this.formValidate = {
        name: '',
        imei: '',
        imsi: '',
        eq_kind_sel: '',
        product: ''
      }
    },
    // 批量删除
    handleDel () {
      if (this.sel_delete.length > 0) {
        this.$Modal.confirm({
          title: '温馨提示',
          content: '确定要删除选中的设备吗？',
          onOk: () => {
            this.$Message.success({
              content: '所选设备删除成功！',
              top: 100
            })
          },
          onCancel: () => {
            this.$Message.info('Clicked cancel')
          }
        })
      } else {
        this.$Message.error('没有选择任何设备！')
      }
    },
    // 批量添加
    handleBatch () {
      console.log(1)
      this.is_batch_show = true
    },
    // 查看设备详情
    show (index) {
      console.log(index)
      this.is_detail_show = false
      this.is_editor = true
    },
    // 表格内删除
    remove (index) {
      console.log(index)
      this.$Message.success({
        content: '设备删除成功！',
        top: 100
      })
    },
    // 换页
    handlepage (val) {
      console.log(val)
    },
    // 改变每页条数
    handlepagesize (val) {
      console.log(val)
    },
    // 监听设备选择运营商类型
    check_eq_kind (val) {
      console.log(val)
    },
    // 关闭新建、编辑设备页面
    close () {
      console.log(this.is_editor)
      if (this.is_editor) {
        this.is_detail_show = false
        this.is_add_show = true
      } else {
        this.is_add_show = true
        this.is_detail_show = true
      }
    },
    // 关闭设备详情页面
    close_detail () {
      this.is_detail_show = true
      this.is_editor = false
    },
    // 新建、编辑表单提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        console.log(valid)
        if (valid) {
          console.log(this.formValidate)
          if (this.is_editor) {
            this.$Message.success({
              content: '添加产品成功！',
              top: 100
            })
          } else {
            this.$Message.success({
              content: '修改产品成功！',
              top: 100
            })
          }
        } else {
          this.$Message.error({
            content: '必填选项不能为空！',
            top: 100
          })
        }
      })
    },
    // 新建、编辑表单重置
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 编辑
    handleeditor () {
      this.text_header = '编辑设备'
      this.is_add_show = false
      this.is_detail_show = true
      this.is_editor = true
      this.formValidate = this.sel
    },
    // 监听标签切换
    get_eq_data (val) {
      if (val === 1) {
        console.log('获取设备数据')
      }
    },
    // 设备数据时间搜索
    handleSearch_eq () {
      console.log(this.time_interval)
    },
    // 设备数据导出
    handleExport_eq () {
      console.log('导出')
    },
    // 设备数据换页
    handlepage_eq (val) {
      console.log(val)
    },
    // 设备数据切换每页条数
    handlepagesize_eq (val) {
      console.log(val)
    },
    // 批量导入选择文件
    sel_file (e) {
      console.log(e)
      this.batch_file = e.target.value
      this.file_name = e.target.files[0].name
    },
    // 下载模板
    get_template () {
      console.log('模版')
    },
    // 批量导入提交
    submitFile () {
      if (this.batch_file) {
        this.is_batch_show = false
        this.$Message.success({
          content: '批量导入设备成功！',
          top: 100
        })
      } else {
        this.$Message.error('请选择文件')
      }
    },
    // 批量导入取消
    cancelFile () {
      this.file_name = '点击选择'
      this.batch_file = ''
    }
  },
  mounted () {
    getTableData().then(res => {
      this.tableData = res.data
    })
    if (this.$route.params.id) {
      this.is_detail_show = false
    }
  }
}
</script>

<style>

</style>
