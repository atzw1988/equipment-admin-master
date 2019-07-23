<template>
  <div>

    <Card v-if="is_add_show && is_detail_show">
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button @click="handleAdd" class="add-btn" type="success"><Icon type="search"/>&nbsp;新建&nbsp;</Button>
      </div>
      <!-- <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"/> -->
      <Table border :columns="columns" :data="tableData"></Table>
      <Page :total="total_ps" size="small" show-total show-elevator show-sizer @on-change="handlepage" @on-page-size-change='handlepagesize'/>
    </Card>
    <Card v-if="!is_add_show" class="add_card">
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close"/>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="220">
        <span class="header_text">基础信息</span>
        <FormItem label="产品名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入产品名称" clearable></Input>
        </FormItem>
        <FormItem label="所属分类">
          <Cascader :data="eq_kind" v-model="formValidate.kind" placeholder="请选择所属分类" filterable trigger="hover"></Cascader>
        </FormItem>
        <span class="header_text">其他信息</span>
        <FormItem label="节点类型" prop="node_kind">
          <RadioGroup v-model="formValidate.node_kind">
            <Radio label="male">设备</Radio>
            <Radio label="female">网关</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否接入网关" prop="gateway" label-position='right'>
          <RadioGroup v-model="formValidate.gateway">
            <Radio label="male">是</Radio>
            <Radio label="female">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="联网协议" prop="agreement">
            <Select v-model="formValidate.agreement" placeholder="请选择联网协议">
                <Option value="CoAP">CoAP</Option>
                <Option value="WIFI">WIFI</Option>
                <Option value="cellular">蜂窝(2G/3G/4G)</Option>
                <Option value="etheric">以太网</Option>
                <Option value="LoRAWAN">LoRAWAN</Option>
                <Option value="other">其他</Option>
            </Select>
        </FormItem>
        <FormItem label="数据格式" prop="format">
            <Select v-model="formValidate.format" placeholder="请选择数据格式">
                <Option value="ICA">ICA标准数据格式(Alink JSON)</Option>
                <Option value="custom">遗传/自定义</Option>
            </Select>
        </FormItem>
        <FormItem label="产品描述" prop="desc">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入产品描述..."></Input>
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
        <span style="margin-right:50px">产品ID：{{sel.name}}</span>
        <span>设备数量：{{sel.num}}&nbsp;&nbsp;<Icon type="md-eye" size='24'/></span>
      </div>
      <div class="down">
        <span class="detail_text">产品信息</span>
        <Button class="edit" type="info" @click="handleeditor">编辑</Button>
        <Row class='detail'>
          <Col span="8">
            <Col class='left detail_list' span="12">产品名称</Col>
            <Col class="detail_list" span="12">{{sel.name}}</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list' span="12">所属分类</Col>
            <Col class="detail_list" span="12">{{sel.kind[0]}}>{{sel.kind[1]}}</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list' span="12">创建时间</Col>
            <Col class="right detail_list" span="12">{{sel.time}}</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list' span="12">节点类型</Col>
            <Col class="detail_list" span="12">{{sel.node_kind}}</Col>
          </Col>
          <Col span="16">
            <Col class='left detail_list' span="6">数据格式</Col>
            <Col v-if="sel.format == 'ICA'" class="right detail_list" span="18">ICA标准数据格式(Alink JSON)</Col>
            <Col v-if="sel.format == 'custom'" class="right detail_list" span="18">遗传/自定义</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list' span="12">状态</Col>
            <Col class="detail_list" span="12">{{sel.status}}</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list' span="12">是否接入网关</Col>
            <Col class="detail_list" span="12">{{sel.gateway}}</Col>
          </Col>
          <Col span="8">
            <Col class='left detail_list' span="12">联网协议</Col>
            <Col class="right detail_list" span="12">{{sel.agreement}}</Col>
          </Col>
          <Col span="24">
            <Col class='left detail_list last' span="4">产品描述</Col>
            <Col class="right detail_list last" span="20">{{sel.desc}}</Col>
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
import './index.less'
import { getTableData } from '@/api/data'
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
        { title: '产品名称', key: 'name', sortable: false },
        { title: '产品ID', key: 'email', editable: true },
        { title: '节点类型', key: 'email', editable: true },
        { title: '设备数', key: 'email', editable: true },
        { title: '创建时间', key: 'createTime' },
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
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
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
        kind: [],
        node_kind: '',
        gateway: '',
        desc: '',
        agreement: '',
        format: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '产品名称为必填项', trigger: 'blur' }
        ],
        kind: [
          { required: true, message: '请选择产品所属分类', trigger: '' }
        ],
        node_kind: [
          { required: true, message: '请选择产品节点类型', trigger: 'change' }
        ],
        gateway: [
          { required: true, message: '请选择产品是否接入网关', trigger: 'change' }
        ],
        agreement: [
          { required: true, message: '请选择产品联网协议', trigger: 'blur' }
        ],
        format: [
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
      sel: {
        name: '嵊州地磁',
        kind: ['智慧城市', '公共服务', '地磁检测器'],
        node_kind: '设备',
        gateway: '是',
        desc: '123',
        agreement: 'CoAP',
        format: 'ICA',
        time: '2019-07-23',
        status: '开发中',
        num: 1000
      },
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
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },
    handleSearch () {
      console.log('搜索')
    },
    handleAdd () {
      this.is_add_show = false
      this.formValidate = {
        name: '',
        kind: [],
        node_kind: '',
        gateway: '',
        desc: '',
        agreement: '',
        format: ''
      }
    },
    show (index) {
      console.log(index)
      this.is_detail_show = false
      this.is_editor = true
    },
    remove (index) {
      console.log(index)
      this.$Modal.confirm({
        title: '温馨提示',
        content: '确定要删除该产品吗？',
        onOk: () => {
          this.is_auth_code = true
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
        }
      })
    },
    handlepage (val) {
      console.log(val)
    },
    handlepagesize (val) {
      console.log(val)
    },
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
    close_detail () {
      this.is_detail_show = true
      this.is_editor = false
    },
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
          this.$Message.success({
            content: '添加产品成功！',
            top: 100
          })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleeditor () {
      this.is_add_show = false
      this.is_detail_show = true
      this.is_editor = true
      this.formValidate = this.sel
    },
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
    submitCode (val) {
      clearInterval(this.code_time)
      this.$refs[val].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.code_text = '点击获取'
          this.is_auth_code = false
          this.$Message.success({
            content: '删除产品成功！',
            top: 100
          })
        } else {
          this.is_auth_code = true
          this.$Message.error('验证码不能为空')
        }
      })
    },
    cancelCode () {
      clearInterval(this.code_time)
      this.is_auth_code = false
      this.code_text = '点击获取'
    }
  },
  mounted () {
    getTableData().then(res => {
      this.tableData = res.data
    })
  }
}
</script>

<style>

</style>
