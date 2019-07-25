<template>
  <div>
    <Card v-if="is_add_show && is_detail_show">
      <span>角色管理</span>
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入角色名关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button @click="handleAdd" class="add-btn" type="success"><Icon type="search"/>&nbsp;新建账户&nbsp;</Button>
      </div>
      <Table border :columns="columns" :data="tableData"></Table>
      <Page :total="total_ps" size="small" show-total show-elevator show-sizer @on-change="handlepage" @on-page-size-change='handlepagesize'/>
    </Card>
    <Card v-if="!is_add_show" class="add_card">
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close"/>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="220">
        <FormItem label="账号名称" prop="account">
          <Input v-model="formValidate.account" placeholder="请输入账户名称" clearable></Input>
        </FormItem>
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入姓名" clearable></Input>
        </FormItem>
        <FormItem label="联系电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="请输入联系电话" clearable></Input>
        </FormItem>
        <FormItem label="企业名称" prop="enterprise">
          <Select v-if="formValidate.kind === 1" clearable v-model="formValidate.enterprise" placeholder="请选择账户所属的企业">
            <Option v-for="item in enterpriseList" :value='item.value' :key="item.value">{{item.label}}</Option>
          </Select>
          <span v-if="formValidate.kind !== 1">xxx公司</span>
        </FormItem>
        <FormItem label="角色" prop="role">
          <Select clearable v-model="formValidate.role" placeholder="请选择账户所属的角色类型">
            <Option v-for="item in roleList" :value='item.value' :key="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否启用" prop="enable">
            <RadioGroup v-model="formValidate.enable">
                <Radio label="male">是</Radio>
                <Radio label="female">否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card v-if="!is_detail_show" class="detail_card">
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close_detail"/>
      <div class="header">账号详情</div>
      <Button class="edit" type="info" @click="handleeditor">编辑</Button>
      <div class="down">
        <Row class='detail'>
          <Col span="24">
            <Col span="3">账号名称:</Col>
            <Col span="5">{{sel.account}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">姓名:</Col>
            <Col span="5">{{sel.name}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">联系电话:</Col>
            <Col span="5">{{sel.phone}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">企业名称:</Col>
            <Col span="5">{{sel.enterprise}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">角色:</Col>
            <Col span="5">{{sel.role}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">添加时间:</Col>
            <Col span="5">{{sel.time}}</Col>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
// import Tables from '_c/tables'
import './accountmana.less'
import { getTableData } from '@/api/data'
export default {
  name: 'tables_page',

  data () {
    return {
      columns: [
        { title: '账户名称', key: 'name' },
        { title: '姓名', key: 'name' },
        { title: '电话', key: 'name' },
        { title: '企业名称', key: 'email' },
        { title: '角色', key: 'name' },
        {
          title: '是否启用',
          key: 'handle',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  size: 'large',
                  value: params.row.handle,
                  'true-value': '1',
                  'false-value': '0'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'on-change': (val) => {
                    this.switch_change(params.index, val)
                  }
                }
              }, [h('span', {
                slot: 'open',
                domProps: {
                  innerHTML: '启用'
                }
              }),
              h('span', {
                slot: 'close',
                domProps: {
                  innerHTML: '停用'
                }
              })])
            ])
          }
        },
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
      is_add_show: true,
      is_detail_show: true,
      is_editor: false,
      tableData: [],
      searchValue: '',
      total_ps: 40,
      page_index: 1,
      ps: 10,
      formValidate: {
        account: '',
        name: '',
        phone: '',
        enterprise: '',
        role: '',
        enable: '',
        kind: 1
      },
      ruleValidate: {
        account: [
          { required: true, message: '账户名称是必填选项', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名是必填选项', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话是必填选项', trigger: 'blur' }
        ],
        enterprise: [
          { required: true, message: '必须选择所归属的企业', trigger: 'change' }
        ],
        role: [
          { required: true, message: '必须选择所归属的角色类型', trigger: 'change' }
        ],
        enable: [
          { required: true, message: '必须选择账户是否启用', trigger: 'change' }
        ]
      },
      enterpriseList: [
        { value: 'xxx公司', label: 'xxx公司' },
        { value: 'xxxx公司', label: 'xxxx公司' },
        { value: 'xxxxx公司', label: 'xxxxx公司' }
      ],
      roleList: [
        { value: '管理员', label: '管理员' },
        { value: '运维', label: '运维' },
        { value: '测试', label: '测试' }
      ],
      sel: {
        account: 'huateng',
        name: '张三',
        phone: '18888888888',
        enterprise: 'xxxx公司',
        role: '管理员',
        enable: 'male',
        kind: 1,
        time: '2019-07-25'
      }
    }
  },
  methods: {
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
        account: '',
        name: '',
        phone: '',
        enterprise: '',
        role: '',
        enable: '',
        kind: 1
      }
    },
    switch_change (params, val) {
      console.log(params)
      console.log(val)
    },
    show (index) {
      console.log(index)
      this.is_detail_show = false
      this.is_editor = true
    },
    remove (index) {
      console.log(index)
    },
    handlepage (val) {
      console.log(val)
    },
    handlepagesize (val) {
      console.log(val)
    },
    check_eq_kind (val) {
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
          this.$Message.error({
            content: '必填选项不能为空！',
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
