<template>
  <div>
    <Card v-if="is_add_show && is_detail_show">
      <span>我的分组</span>
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button @click="handleAdd" class="add-btn" type="success"><Icon type="search"/>&nbsp;创建分组&nbsp;</Button>
      </div>
      <Table :loading='loading' border :columns="columns" :data="group_list"></Table>
      <Page :total="total_ps" size="small" show-total show-elevator show-sizer @on-change="handlepage" @on-page-size-change='handlepagesize'/>
    </Card>
    <Card v-if="!is_add_show" class="add_card">
      <div class="header">{{text_header}}</div>
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close"/>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="220">
        <FormItem label="分组名称" prop="group_name">
          <Input v-model="formValidate.group_name" placeholder="请输入分组名称" clearable></Input>
        </FormItem>
        <FormItem label="产品描述">
          <Input v-model="formValidate.group_description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入分组描述..."></Input>
        </FormItem>
        <FormItem>
          <Affix :offset-bottom="50">
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
          </Affix>
        </FormItem>
      </Form>
    </Card>
    <Card v-if="!is_detail_show" class="detail_card">
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close_detail"/>
      <div class="header">{{sel.group_name}}</div>
      <div class="middle">
        <span>设备总数：{{eq_total}}</span>
        <Divider type="vertical" />
        <span>在线设备：{{eq_online}}</span>
        <Divider type="vertical" />
        <span>离线设备：{{eq_offline}}</span>
      </div>
      <div class="down">
        <Tabs type="card" @on-click="get_eq_data">
          <TabPane label="分组信息">
            <Button class="edit" type="info" @click="handleeditor">编辑</Button>
            <Row class='detail'>
              <Col span="8">
                <Col class='left detail_list last' span="12">分组名称</Col>
                <Col class="detail_list last" span="12">{{sel.group_name}}</Col>
              </Col>
              <Col span="8">
                <Col class='left detail_list last' span="12">分组ID</Col>
                <Col class="detail_list last" span="12">{{sel.group_id}}</Col>
              </Col>
              <Col span="8">
                <Col class='left detail_list last' span="12">添加时间</Col>
                <Col class="right detail_list last" span="12">{{sel.create_date}}</Col>
              </Col>
              <Col span="24">
                <Col class='left detail_list' span="4">分组描述</Col>
                <Col class="detail_list right" span="20">{{sel.group_description}}</Col>
              </Col>
            </Row>
          </TabPane>
          <TabPane label="设备列表">
            <div class="eq_data">
              <Input class="sel-function" v-model="sel_eq_name" placeholder="可输入设备名称关键字" clearable style="width: 150px" />&nbsp;
              <Input class="sel-function" v-model="sel_eq_imei" placeholder="可输入设备IMEI关键字" clearable style="width: 150px" />&nbsp;
              <Select class="sel-function" v-model="sel_eq_operator" clearable style="width:100px" placeholder="全部运营商">
                <Option v-for="item in operatorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>&nbsp;
              <Select class="sel-function" v-model="sel_eq_product" clearable style="width:100px" placeholder="全部产品">
                <Option v-for="item in productList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>&nbsp;
              <Select class="sel-function" v-model="sel_eq_status" clearable style="width:100px" placeholder="全部状态">
                <Option value="online">在线</Option>
                <Option value="offline">离线</Option>
              </Select>&nbsp;
              <Button @click="handleSearch_eq" class="search-btn" type="primary">&nbsp;搜索&nbsp;</Button>
              <Button @click="handleDel_eq" class="export-btn" type="error">移除</Button>
              <Button @click="handleAdd_eq" class="export-btn" type="success">添加设备</Button>
            </div>
            <div>
              <Table  @on-selection-change='table_sel' border :columns="detail_columns" :data="tableData"></Table>
              <Page :total="40" size="small" show-total show-elevator show-sizer transfer @on-change="handlepage_eq" @on-page-size-change='handlepagesize_eq'/>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Card>
    <Drawer width='800' title="添加设备" :mask-closable="false" v-model="is_drawer_show" class="add_content">
      <Input class="sel-function" v-model="sel_eq_name" placeholder="可输入设备名称关键字" clearable style="width: 150px" />&nbsp;
      <Select class="sel-function" v-model="sel_eq_operator" clearable style="width:100px" placeholder="全部运营商">
        <Option v-for="item in operatorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>&nbsp;
      <Select class="sel-function" v-model="sel_eq_product" clearable style="width:100px" placeholder="全部产品">
        <Option v-for="item in productList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>&nbsp;
      <Select class="sel-function" v-model="sel_eq_status" clearable style="width:100px" placeholder="全部状态">
        <Option value="online">在线</Option>
        <Option value="offline">离线</Option>
      </Select>&nbsp;
      <Button @click="handleSearch_eq" class="search-btn" type="primary">&nbsp;搜索&nbsp;</Button>
      <div style="margin-top:20px">
        <Table  @on-selection-change='table_sel_add' border :columns="add_columns" :data="tableData"></Table>
        <Page :total="40" size="small" show-total show-elevator show-sizer transfer @on-change="handlepage_eq" @on-page-size-change='handlepagesize_eq'/>
      </div>
      <div class="add_eq_btn">
        <Button @click="handleCancel">取消</Button>
        <Button style="margin-left: 8px" type="primary" @click="handleSubmit_eq">确认添加</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
// import Tables from '_c/tables'
import './groupmana.less'
import { getGroupList, addGroup, updateGroup, deleteGroup } from '@/api/groupmana'
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
        { title: '分组名称', key: 'group_name' },
        { title: '分组ID', key: 'group_id' },
        { title: '设备数', key: 'deviceCount' },
        { title: '创建时间', key: 'create_date' },
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
      group_list: [],
      text_header: '',
      is_add_show: true,
      is_detail_show: true,
      is_editor: false,
      is_drawer_show: false,
      tableData: [],
      loading: false,
      searchValue: '',
      total_ps: 40,
      page_index: 1,
      ps: 10,
      formValidate: {
        group_name: '',
        group_description: ''
      },
      sel_delete: [],
      ruleValidate: {
        group_name: [
          { required: true, message: '分组名称是必填选项', trigger: 'blur' }
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
      sel: {},
      sel_eq_name: '',
      sel_eq_imei: '',
      sel_eq_operator: '',
      sel_eq_product: '',
      sel_eq_status: '',
      detail_columns: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '设备名称', key: 'name' },
        { title: 'IMEI', key: 'name' },
        { title: '运营商', key: 'name' },
        { title: '归属产品', key: 'name' },
        { title: '设备状态', key: 'name' },
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
                    this.show_eq(params.index)
                  }
                }
              }, '查看'),
              h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要移除设备吗?',
                  transfer: true
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'on-ok': () => {
                    this.remove_eq(params.index)
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
                }, '移除')
              ])
            ])
          }
        }
      ],
      is_batch_show: false,
      file_name: '点击选择',
      batch_file: '',
      add_columns: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '设备名称', key: 'name' },
        { title: 'IMEI', key: 'name' },
        { title: '运营商', key: 'name' },
        { title: '归属产品', key: 'name' },
        { title: '设备状态', key: 'name' }
      ],
      sel_add_eq: []
    }
  },
  methods: {
    // 获取分组列表
    get_group_list () {
      this.loading = true
      let params = {
        currentPage: this.page_index,
        pageSize: this.ps
      }
      if (this.searchValue) {
        params.group_name = this.searchValue
      }
      getGroupList(params).then(res => {
        if (res.data.status === 1) {
          this.total_ps = res.data.data.total
          this.group_list = res.data.data.records
        }
        this.loading = false
      })
    },
    // 分组搜索
    handleSearch () {
      this.get_group_list()
    },
    // 新建分组
    handleAdd () {
      this.text_header = '新建分组'
      this.is_add_show = false
      this.formValidate = {}
    },
    // 查看分组详情
    show (index) {
      this.is_detail_show = false
      this.is_editor = true
      this.sel = this.group_list[index]
    },
    // 表格内删除
    remove (index) {
      console.log(index)
      deleteGroup(this.group_list[index].group_id).then(res => {
        console.log(res)
        if (res.data.status === 1) {
          this.$Message.success({
            content: '分组删除成功！',
            top: 100
          })
          this.get_group_list()
        } else {
          this.$Message.error({
            content: '分组删除失败！',
            top: 100
          })
        }
      })
    },
    // 换页
    handlepage (val) {
      this.page_index = val
      this.get_group_list()
    },
    // 切换每页条数
    handlepagesize (val) {
      this.page_index = 1
      this.ps = val
      this.get_group_list()
    },
    // 关闭新建、编辑页面
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
    // 关闭分组详情页面
    close_detail () {
      this.is_detail_show = true
      this.is_editor = false
    },
    // 新建、编辑表单提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (!this.is_editor) {
            addGroup(this.formValidate).then(res => {
              if (res.data.status === 1) {
                this.$Message.success({
                  content: '创建分组成功！',
                  top: 100
                })
                this.is_add_show = true
                this.get_group_list()
              } else {
                this.$Message.error({
                  content: '创建分组失败！',
                  top: 100
                })
              }
            })
          } else {
            updateGroup(this.formValidate).then(res => {
              console.log(res)
              if (res.data.status === 1) {
                this.$Message.success({
                  content: '修改分组信息成功！',
                  top: 100
                })
                this.is_add_show = true
                this.get_group_list()
              } else {
                this.$Message.error({
                  content: '修改分组信息成功！',
                  top: 100
                })
              }
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
    // 编辑分组
    handleeditor () {
      this.text_header = '编辑分组'
      this.is_add_show = false
      this.is_detail_show = true
      this.is_editor = true
      this.formValidate = this.sel
    },
    // 切换设备裂变页面
    get_eq_data (val) {
      if (val === 1) {
        console.log('获取设备数据')
      }
    },
    // 批量移除设备
    handleDel_eq () {
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
    // 设备列表添加设备
    handleAdd_eq () {
      this.is_drawer_show = true
    },
    // 表格内选择
    table_sel (val) {
      console.log(val)
      this.sel_delete = val
    },
    // 查看设备详情
    show_eq (index) {
      this.$router.push({ name: 'equipmentList_page', params: { id: index } })
    },
    // 设备列表表格内移出
    remove_eq (index) {
      console.log(index)
      this.$Message.success({
        content: '设备删除成功！',
        top: 100
      })
    },
    // 设备列表搜索
    handleSearch_eq () {
      console.log(this.time_interval)
    },
    // 设备列表换页
    handlepage_eq (val) {
      console.log(val)
    },
    // 设备列表切换每页条数
    handlepagesize_eq (val) {
      console.log(val)
    },
    // 监听表格添加设备
    table_sel_add (val) {
      console.log(val)
      this.sel_add_eq = val
    },
    // 确认添加设备
    handleSubmit_eq () {
      if (this.sel_add_eq.length > 0) {
        this.$Message.success({
          content: '设备添加成功！',
          top: 100
        })
      } else {
        this.$Notice.error({
          title: '请先选择要添加的设备'
        })
      }
    },
    // 取消添加设备
    handleCancel () {
      this.is_drawer_show = false
    }
  },
  mounted () {
    this.get_group_list()
  }
}
</script>

<style>

</style>
