<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-24 15:32:36
 * @LastEditTime: 2019-08-27 18:02:32
 * @LastEditors: Please set LastEditors
 -->
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
                <Option v-for="item in productList" :value="item.product_id" :key="item.product_id">{{ item.product_name }}</Option>
              </Select>&nbsp;
              <Select class="sel-function" v-model="sel_eq_status" clearable style="width:100px" placeholder="全部状态">
                <Option value="1">在线</Option>
                <Option value="0">离线</Option>
              </Select>&nbsp;
              <Button @click="handleSearch_eq" class="search-btn" type="primary">&nbsp;搜索&nbsp;</Button>
              <Button @click="handleDel_eq" class="export-btn" type="error">批量移除</Button>
              <Button @click="handleAdd_eq" class="export-btn" type="success">添加设备</Button>
            </div>
            <div>
              <Table :loading='eq_de_loading'  @on-selection-change='table_sel' border :columns="detail_columns" :data="group_eq_data"></Table>
              <Page :total="de_total" size="small" show-total show-elevator show-sizer transfer @on-change="handlepage_eq" @on-page-size-change='handlepagesize_eq'/>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Card>
    <Drawer width='800' title="添加设备" :mask-closable="false" v-model="is_drawer_show" class="add_content">
      <Input class="sel-function" v-model="sel_unpeq_name" placeholder="可输入设备名称关键字" clearable style="width: 150px" />&nbsp;
      <Select class="sel-function" v-model="sel_unpeq_operator" clearable style="width:100px" placeholder="全部运营商">
        <Option v-for="item in operatorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>&nbsp;
      <Select class="sel-function" v-model="sel_unpeq_product" clearable style="width:100px" placeholder="全部产品">
        <Option v-for="item in productList" :value="item.product_id" :key="item.product_id">{{ item.product_name }}</Option>
      </Select>&nbsp;
      <Select class="sel-function" v-model="sel_unpeq_status" clearable style="width:100px" placeholder="全部状态">
        <Option value="1">在线</Option>
        <Option value="0">离线</Option>
      </Select>&nbsp;
      <Button @click="handleSearch_unpeq" class="search-btn" type="primary">&nbsp;搜索&nbsp;</Button>
      <div style="margin-top:20px">
        <Table :loading='ung_loading' @on-selection-change='table_sel_add' border :columns="add_columns" :data="ungroup_eq_data"></Table>
        <Page :total="ung_total" size="small" show-total show-elevator show-sizer transfer @on-change="handlepage_eq_nobind" @on-page-size-change='handlepagesize_eq_nobind'/>
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
import { getAllProduct } from '@/api/equipment'
import { getGroupList, addGroup, updateGroup, deleteGroup, getGroupEqList, deleteGroupEq, addGroupEq, getUngroupEqList } from '@/api/groupmana'
export default {
  name: 'tables_page',
  data () {
    return {
      sel_product: '',
      productList: [],
      sel_operator: '',
      operatorList: [
        { value: '1', label: '中国移动' },
        { value: '0', label: '中国电信' },
        { value: '2', label: '中国联通' }
      ],
      eq_total: 0,
      eq_online: 0,
      eq_offline: 0,
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
      sel: {},
      sel_eq_name: '',
      sel_eq_imei: '',
      sel_eq_operator: '',
      sel_eq_product: '',
      sel_eq_status: '',
      detail_columns: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '设备名称', key: 'device_name' },
        { title: 'IMEI', key: 'device_imei' },
        { title: '运营商', key: 'device_type_name' },
        { title: '归属产品', key: 'product_name' },
        { title: '设备状态', key: 'device_state_name' },
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
      de_page_index: 1,
      de_ps: 10,
      de_total: 0,
      group_eq_data: [],
      eq_de_loading: false,
      is_batch_show: false,
      file_name: '点击选择',
      batch_file: '',
      add_columns: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '设备名称', key: 'device_name' },
        { title: 'IMEI', key: 'device_imei' },
        { title: '运营商', key: 'device_type_name' },
        { title: '归属产品', key: 'product_name' },
        { title: '设备状态', key: 'device_state_name' }
      ],
      ung_page_index: 1,
      ung_ps: 10,
      ung_total: 0,
      ung_loading: false,
      ungroup_eq_data: [],
      sel_unpeq_name: '',
      sel_unpeq_operator: '',
      sel_unpeq_product: '',
      sel_unpeq_status: '',
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
        console.log(res)
        if (res.data.status === 1) {
          this.total_ps = res.data.data.total
          this.group_list = res.data.data.records
        }
        this.loading = false
      })
    },
    // 获取分组设备列表
    get_group_eq_list () {
      this.eq_de_loading = true
      let params = {
        group_id: this.sel.group_id,
        currentPage: this.de_page_index,
        pageSize: this.de_ps
      }
      if (this.sel_eq_name) {
        params.device_name = this.sel_eq_name
      }
      if (this.sel_eq_imei) {
        params.device_imei = this.sel_eq_imei
      }
      if (this.sel_eq_operator) {
        params.device_type = this.sel_eq_operator
      }
      if (this.sel_eq_product) {
        params.product_id = this.sel_eq_operator
      }
      if (this.sel_eq_status) {
        params.device_state = this.sel_eq_status
      }
      getGroupEqList(params).then(res => {
        console.log(res)
        if (res.data.status === 1) {
          let list = res.data.data.page.records
          list.forEach(item => {
            if (item.device_state === 0) {
              item.device_state_name = '离线'
            } else if (item.device_state === 1) {
              item.device_state_name = '在线'
            } else {
              item.device_state_name = '未知'
            }
            if (item.device_type === 0) {
              item.device_type_name = '中国电信'
            } else if (item.device_type === 1) {
              item.device_type_name = '中国移动'
            } else {
              item.device_type_name = '中国联通'
            }
          })
          this.eq_total = res.data.data.count.allcount
          this.eq_online = res.data.data.count.online
          this.eq_offline = res.data.data.count.offline
          this.de_total = res.data.data.total
          this.group_eq_data = list
        } else {
          this.notice_error_msg('获取设备列表失败！')
        }
        this.eq_de_loading = false
      })
    },
    // 获取未分组的设备列表
    get_ungroup_eq_list () {
      this.ung_loading = true
      let params = {
        group_id: this.sel.group_id,
        currentPage: this.ung_page_index,
        pageSize: this.ung_ps
      }
      if (this.sel_unpeq_name) {
        params.device_name = this.sel_unpeq_name
      }
      if (this.sel_unpeq_operator) {
        params.device_type = this.sel_unpeq_operator
      }
      if (this.sel_unpeq_product) {
        params.product_id = this.sel_unpeq_product
      }
      if (this.sel_unpeq_status) {
        params.device_state = this.sel_unpeq_status
      }
      getUngroupEqList(params).then(res => {
        console.log(res)
        if (res.data.status === 1) {
          let list = res.data.data.records
          list.forEach(item => {
            if (item.device_state === 0) {
              item.device_state_name = '离线'
            } else if (item.device_state === 1) {
              item.device_state_name = '在线'
            } else {
              item.device_state_name = '未知'
            }
            if (item.device_type === 0) {
              item.device_type_name = '中国电信'
            } else if (item.device_type === 1) {
              item.device_type_name = '中国移动'
            } else {
              item.device_type_name = '中国联通'
            }
          })
          this.ung_total = res.data.data.total
          this.ungroup_eq_data = list
        } else {
          this.error_msg('获取数据失败！')
        }
        this.ung_loading = false
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
      this.get_group_eq_list()
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
              console.log(res)
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
        getAllProduct().then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.productList = res.data.data
            console.log(this.productList)
          }
        })
      }
    },
    // 批量移除设备
    handleDel_eq () {
      if (this.sel_delete.length > 0) {
        let list = this.sel_delete.map(item => {
          return item.device_id
        })
        this.$Modal.confirm({
          title: '温馨提示',
          content: '确定要删除选中的设备吗？',
          onOk: () => {
            deleteGroupEq(this.sel.group_id, list.join(',')).then(res => {
              console.log(res)
              if (res.data.status === 1) {
                this.success_msg('所选设备移除成功！')
                this.get_group_eq_list()
              } else {
                this.error_msg('所选设备移除失败！')
              }
            })
          },
          onCancel: () => {

          }
        })
      } else {
        this.$Message.error('没有选择任何设备！')
      }
    },
    // 设备列表添加设备
    handleAdd_eq () {
      this.is_drawer_show = true
      this.get_ungroup_eq_list()
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
      deleteGroupEq(this.sel.group_id, this.group_eq_data[index].device_id).then(res => {
        if (res.data.status === 1) {
          this.success_msg('移除设备成功！')
          this.get_group_eq_list()
        } else {
          this.error_msg('移除设备失败！')
        }
      })
    },
    // 设备列表搜索
    handleSearch_eq () {
      this.get_group_eq_list()
    },
    // 设备列表换页
    handlepage_eq (val) {
      this.de_page_index = val
      this.get_group_eq_list()
    },
    // 设备列表切换每页条数
    handlepagesize_eq (val) {
      this.de_page_index = 1
      this.de_ps = val
      this.get_group_eq_list()
    },
    // 监听表格添加设备
    table_sel_add (val) {
      this.sel_add_eq = val
    },
    // 添加页面换页
    handlepage_eq_nobind (val) {
      this.ung_page_index = val
      this.get_ungroup_eq_list()
    },
    // 添加设备页面换每页条数
    handlepagesize_eq_nobind (val) {
      this.ung_page_index = 1
      this.ung_ps = val
      this.get_ungroup_eq_list()
    },
    // 添加页面搜搜
    handleSearch_unpeq () {
      this.get_ungroup_eq_list()
    },
    // 确认添加设备
    handleSubmit_eq () {
      if (this.sel_add_eq.length > 0) {
        let list = this.sel_add_eq.map(item => {
          return item.device_id
        })
        let data = {
          device_id: list.join(','),
          group_id: this.sel.group_id
        }
        addGroupEq(data).then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.success_msg('所选设备添加成功！')
            this.is_drawer_show = false
            this.get_group_eq_list()
          } else {
            this.error_msg('所选设备添加失败！')
          }
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
