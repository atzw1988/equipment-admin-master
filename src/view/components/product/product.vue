<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-22 16:06:56
 * @LastEditTime: 2019-07-22 16:06:56
 * @LastEditors: your name
 -->
<template>
  <div>

    <Card v-if="is_add_show && is_detail_show">
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button @click="handleAdd" class="add-btn" type="success"><Icon type="search"/>&nbsp;新建&nbsp;</Button>
      </div>
      <!-- <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"/> -->
      <Table :loading='loading' border :columns="columns" :data="tableData"></Table>
      <Page :total="total_ps" size="small" show-total show-elevator show-sizer @on-change="handlepage" @on-page-size-change='handlepagesize'/>
    </Card>
    <Card v-if="!is_add_show" class="add_card">
      <div class="header">{{text_header}}</div>
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close"/>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="220">
        <span class="header_text">基础信息</span>
        <FormItem label="产品名称" prop="product_name">
          <Input v-model="formValidate.product_name" placeholder="请输入产品名称" clearable></Input>
        </FormItem>
        <FormItem label="所属分类">
          <Cascader :data="eq_kind" v-model="formValidate.product_type" placeholder="请选择所属分类" filterable trigger="hover"></Cascader>
        </FormItem>
        <span class="header_text">其他信息</span>
        <FormItem label="节点类型" prop="product_ntype">
          <RadioGroup v-model="formValidate.product_ntype">
            <Radio label="1">设备</Radio>
            <Radio label="2">网关</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否接入网关" prop="is_access_gateway" label-position='right'>
          <RadioGroup v-model="formValidate.is_access_gateway">
            <Radio label="1">是</Radio>
            <Radio label="2">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="联网协议" prop="product_netmodel">
            <Select v-model="formValidate.product_netmodel" placeholder="请选择联网协议">
                <Option value="CoAP">CoAP</Option>
                <Option value="WIFI">WIFI</Option>
                <Option value="蜂窝(2G/3G/4G)">蜂窝(2G/3G/4G)</Option>
                <Option value="以太网">以太网</Option>
                <Option value="LoRAWAN">LoRAWAN</Option>
                <Option value="其他">其他</Option>
            </Select>
        </FormItem>
        <FormItem label="数据格式" prop="product_dataformat">
            <Select v-model="formValidate.product_dataformat" placeholder="请选择数据格式">
                <Option value="ICA">ICA标准数据格式(Alink JSON)</Option>
                <Option value="custom">遗传/自定义</Option>
            </Select>
        </FormItem>
        <FormItem label="产品描述" prop="desc">
          <Input v-model="formValidate.product_description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入产品描述..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card v-if="!is_detail_show" class="detail_card">
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close_detail"/>
      <div class="header">嵊州地磁</div>
      <div class="middle">
        <span style="margin-right:50px">产品ID：{{sel.product_id}}</span>
        <span>设备数量：{{sel.deviceCount}}&nbsp;&nbsp;<Icon type="md-eye" size='24'/></span>
      </div>
      <div class="down">
        <span class="detail_text">产品信息</span>
        <Button class="edit" type="info" @click="handleeditor">编辑</Button>
        <Row class='detail'>
          <Col span="8">
            <Col class='left detail_list last' span="12">产品名称</Col>
            <Col class="detail_list last" span="12">{{sel.product_name}}</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list last' span="12">所属分类</Col>
            <Col class="detail_list last" span="12">{{sel.product_type.split(',').pop()}}</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list last' span="12">创建时间</Col>
            <Col class="right detail_list last" span="12">{{sel.create_date}}</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list' span="12">节点类型</Col>
            <Col v-if="sel.product_ntype == 1" class="detail_list" span="12">设备</Col>
            <Col v-if="sel.product_ntype == 2" class="detail_list" span="12">网关</Col>
          </Col>
          <Col span="16">
            <Col class='left detail_list' span="6">数据格式</Col>
            <Col v-if="sel.product_dataformat == 'ICA'" class="right detail_list" span="18">ICA标准数据格式(Alink JSON)</Col>
            <Col v-if="sel.product_dataformat == 'custom'" class="right detail_list" span="18">遗传/自定义</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list' span="12">状态</Col>
            <Col class="detail_list" span="12">{{sel.product_state_name}}</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list' span="12">是否接入网关</Col>
            <Col v-if="sel.is_access_gateway == 1" class="detail_list" span="12">是</Col>
            <Col v-if="sel.is_access_gateway == 2" class="detail_list" span="12">否</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list' span="12">联网协议</Col>
            <Col class="right detail_list" span="12">{{sel.product_netmodel}}</Col>
          </Col>
          <Col span="24">
            <Col class='left detail_list' span="4">产品描述</Col>
            <Col class="right detail_list" span="20">{{sel.product_description}}</Col>
          </Col>
        </Row>
      </div>
    </Card>
    <Modal
      title="手机验证"
      v-model="is_auth_code"
      :closable="false"
      :mask-closable="false"
      footer-hide
      @on-ok='submitCode'
      @on-cancel='cancelCode'
      class-name="vertical-center-modal">
      <Form ref="auth_code" :model="auth_code" :rules="code_rule" :label-width="100">
        <FormItem label="您绑定的手机">
          <span>134****1234</span>
        </FormItem>
        <FormItem label="验证码" prop="code">
          <Input type="text" style='width:200px' v-model="auth_code.code" placeholder="请输入验证码"></Input>
          <Button class="get_code" :disabled='!is_overdue' @click="get_code" type="info">{{code_text}}</Button>
        </FormItem>
        <FormItem>
          <Button class="code_btn" style="margin-left: 50px" type="primary" @click="submitCode('auth_code')">提交</Button>
          <Button class="code_btn" @click="cancelCode">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
// import Tables from '_c/tables'
import './product.less'
import { getProductList, addProduct, deleteProduct, updateProduct } from '@/api/product'
export default {
  name: 'tables_page',

  data () {
    const validatecode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('验证码不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger((value * 1))) {
          callback(new Error('验证码为数字'))
        } else {
          if ((value + '').length !== 6) {
            callback(new Error('验证码长度为6位'))
          } else {
            callback()
          }
        }
      }, 500)
    }
    return {
      columns: [
        { title: '产品名称', key: 'product_name' },
        { title: '产品ID', key: 'product_id' },
        { title: '节点类型', key: 'product_ntype' },
        { title: '设备数', key: 'deviceCount' },
        { title: '审核状态', key: 'product_state_name' },
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
      text_header: '',
      is_add_show: true,
      is_detail_show: true,
      is_editor: false,
      tableData: [],
      loading: false,
      searchValue: '',
      total_ps: 0,
      page_index: 1,
      ps: 10,
      formValidate: {
        product_name: '',
        product_type: [],
        product_ntype: '',
        is_access_gateway: '',
        product_netmodel: '',
        product_dataformat: '',
        product_description: ''
      },
      ruleValidate: {
        product_name: [
          { required: true, message: '产品名称为必填项', trigger: 'blur' }
        ],
        product_ntype: [
          { required: true, message: '请选择产品节点类型', trigger: 'change' }
        ],
        is_access_gateway: [
          { required: true, message: '请选择产品是否接入网关', trigger: 'change' }
        ],
        product_netmodel: [
          { required: true, message: '请选择产品联网协议', trigger: 'blur' }
        ],
        product_dataformat: [
          { required: true, message: '请选择产品数据格式', trigger: 'blur' }
        ]
      },
      eq_kind: [
        {
          value: '智慧城市',
          label: '智慧城市',
          children: [
            {
              value: '公共服务',
              label: '公共服务',
              children: [
                {
                  value: '定位器',
                  label: '定位器'
                },
                {
                  value: '地磁检测器',
                  label: '地磁检测器'
                },
                {
                  value: '智能井盖',
                  label: '智能井盖'
                },
                {
                  value: '井盖锁',
                  label: '井盖锁'
                },
                {
                  value: '垃圾箱',
                  label: '垃圾箱'
                },
                {
                  value: '绿灯照明',
                  label: '绿灯照明'
                }
              ]
            },
            {
              value: '消防安全',
              label: '消防安全'
            },
            {
              value: '智能楼宇',
              label: '智能楼宇'
            }
          ]
        },
        {
          value: '智慧生活',
          label: '智慧生活'
        },
        {
          value: '智慧园区',
          label: '智慧园区'
        }
      ],
      sel: {},
      sel_delete: {},
      is_auth_code: false,
      auth_code: {
        code: ''
      },
      code_rule: {
        code: [
          { validator: validatecode, trigger: 'blur' }
        ]
      },
      code_text: '点击获取',
      is_overdue: true,
      code_time: null
    }
  },
  methods: {
    // 获取产品列表
    get_product_list () {
      this.loading = true
      let params = {
        currentPage: this.page_index,
        pageSize: this.ps
      }
      if (this.searchValue) {
        params.productName = this.searchValue
      }
      getProductList(params).then(res => {
        console.log(res)
        if (res.status === 200) {
          let list = res.data.data.records
          list.forEach(item => {
            if (item.product_state === 1) {
              item.product_state_name = '审核通过'
            } else {
              item.product_state_name = '审核中'
            }
            item.is_access_gateway += ''
          })
          this.tableData = list
          this.total_ps = res.data.data.total
        } else {
          this.error_msg('获取产品列表失败！')
        }
        this.loading = false
      })
    },
    // 搜索
    handleSearch () {
      console.log('搜索')
      this.get_product_list()
    },
    // 新建按钮
    handleAdd () {
      this.text_header = '新建产品'
      this.is_add_show = false
      this.formValidate = {}
    },
    // 查看产品详情
    show (index) {
      console.log(index)
      this.is_detail_show = false
      this.is_editor = true
      console.log()
      this.sel = this.tableData[index]
    },
    // 表格内删除
    remove (index) {
      console.log(index)
      if (this.tableData[index].deviceCount > 0) {
        this.notice_error_msg('该产品下有设备,不允许删除！')
      } else {
        this.sel_delete = this.tableData[index]
        this.is_auth_code = true
      }
    },
    // 换页
    handlepage (num) {
      this.page_index = num
      this.get_product_list()
    },
    // 修改每页条数
    handlepagesize (num) {
      this.page_index = 1
      this.ps = num
      this.get_product_list()
    },
    // 关闭新建、编辑页面
    close () {
      console.log(this.is_editor)
      if (this.is_editor) {
        this.is_detail_show = false
        this.is_add_show = true
        this.formValidate.product_type = this.formValidate.product_type.join(',')
      } else {
        this.is_add_show = true
        this.is_detail_show = true
      }
    },
    // 关闭详情页面
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
          this.formValidate.product_type = this.formValidate.product_type.join(',')
          if (this.is_editor) {
            updateProduct(this.formValidate).then(res => {
              console.log(res)
              if (res.data.data) {
                this.success_msg('修改产品成功！')
                this.is_add_show = true
                this.get_product_list()
              }
            })
          } else {
            addProduct(this.formValidate).then(res => {
              if (res.data.data) {
                this.success_msg('添加产品成功！')
                this.is_add_show = true
                this.formValidate = {}
                this.get_product_list()
              } else {
                this.error_msg('添加产品失败！')
              }
            })
          }
        } else {
          this.error_msg('有必填选项空白！')
        }
      })
    },
    // 新建、编辑表单重置
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 编辑
    handleeditor () {
      this.text_header = '编辑产品'
      this.is_add_show = false
      this.is_detail_show = true
      this.is_editor = true
      this.formValidate = this.sel
      this.formValidate.product_type = this.formValidate.product_type.split(',')
    },
    // 获取验证码
    get_code () {
      clearInterval(this.code_time)
      let num = 60
      this.code_text = num + '秒后过期'
      this.is_overdue = false
      this.code_time = setInterval(() => {
        if (num > 0) {
          num--
          this.code_text = num + '秒后过期'
        } else {
          this.code_text = '重新获取'
          this.is_overdue = true
        }
      }, 1000)
    },
    // 提交验证码
    submitCode (val) {
      clearInterval(this.code_time)
      this.$refs[val].validate((valid) => {
        if (valid) {
          this.code_text = '点击获取'
          this.is_auth_code = false
          deleteProduct(this.sel_delete.product_id).then(res => {
            if (res.data.data) {
              this.success_msg('删除产品成功！')
              this.get_product_list()
            } else {
              this.error_msg('删除产品失败！')
            }
          })
        } else {
          this.is_auth_code = true
          this.error_msg('验证码不能为空')
        }
      })
    },
    // 验证弹窗取消
    cancelCode () {
      clearInterval(this.code_time)
      this.is_auth_code = false
      this.code_text = '点击获取'
    }
  },
  mounted () {
    this.get_product_list()
  }
}
</script>

<style>

</style>
