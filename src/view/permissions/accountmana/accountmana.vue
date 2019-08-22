<template>
  <div>
    <Card v-if="is_add_show && is_detail_show">
      <span>账户管理</span>
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入角色名关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button @click="handleAdd" class="add-btn" type="success"><Icon type="search"/>&nbsp;新建账户&nbsp;</Button>
      </div>
      <Table :loading="loading" border :columns="columns" :data="tableData"></Table>
      <Page :total="total_ps" size="small" show-total show-elevator show-sizer @on-change="handlepage" @on-page-size-change='handlepagesize'/>
    </Card>
    <Card v-if="!is_add_show" class="add_card">
      <div class="header">{{text_header}}</div>
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close"/>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="220">
        <FormItem label="账号名称" prop="login_name">
          <Input v-model="formValidate.login_name" placeholder="请输入账户名称" clearable></Input>
        </FormItem>
        <FormItem label="姓名" prop="user_name">
          <Input v-model="formValidate.user_name" placeholder="请输入姓名" clearable></Input>
        </FormItem>
        <FormItem label="联系电话" prop="user_phone">
          <Input v-model="formValidate.user_phone" placeholder="请输入联系电话" clearable></Input>
        </FormItem>
        <FormItem label="企业名称" prop="org_id">
          <Select v-if="role_kind === 1" clearable v-model="formValidate.org_id" placeholder="请选择账户所属的企业">
            <Option v-for="item in enterpriseList" :value='item.org_id' :key="item.org_id">{{item.org_name}}</Option>
          </Select>
          <span v-if="role_kind !== 1">xxx公司</span>
        </FormItem>
        <FormItem label="角色" prop="role_id">
          <Select clearable v-model="formValidate.role_id" placeholder="请选择账户所属的角色类型">
            <Option v-for="item in roleList" :value='item.role_id' :key="item.role_id">{{item.role_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否启用" prop="user_state">
            <RadioGroup v-model="formValidate.user_state">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
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
            <Col span="5">{{sel.login_name}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">姓名:</Col>
            <Col span="5">{{sel.user_name}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">联系电话:</Col>
            <Col span="5">{{sel.user_phone}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">企业名称:</Col>
            <Col span="5">{{sel.org_name}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">角色:</Col>
            <Col span="5">{{sel.role_name}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">添加时间:</Col>
            <Col span="5">{{sel.create_date}}</Col>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
// import Tables from '_c/tables'
import './accountmana.less'
import { getUserList, deleteUser, addUser, updateUser, lockUser, getRoleList, getOrgList } from '@/api/user'
export default {
  name: 'tables_page',

  data () {
    return {
      columns: [
        { title: '账户名称', key: 'login_name' },
        { title: '姓名', key: 'user_name' },
        { title: '电话', key: 'user_phone' },
        { title: '企业名称', key: 'org_name' },
        { title: '角色', key: 'role_name' },
        {
          title: '是否启用',
          key: 'user_state',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  size: 'large',
                  value: params.row.user_state,
                  'true-value': 1,
                  'false-value': 2
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'on-change': (val) => {
                    this.switch_change(params.row, val)
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
      is_add_show: true,
      is_detail_show: true,
      is_editor: false,
      tableData: [],
      loading: false,
      searchValue: '',
      total_ps: 0,
      page_index: 1,
      ps: 10,
      text_header: '',
      formValidate: {
        login_name: '',
        user_name: '',
        user_phone: '',
        org_id: '',
        role_id: '',
        user_state: 0
      },
      role_kind: 1,
      ruleValidate: {
        login_name: [
          { required: true, message: '账户名称是必填选项', trigger: 'blur' }
        ],
        user_name: [
          { required: true, message: '姓名是必填选项', trigger: 'blur' }
        ],
        user_phone: [
          { required: true, message: '联系电话是必填选项', trigger: 'blur' }
        ],
        org_id: [
          { required: true, message: '必须选择所归属的企业', trigger: 'change' }
        ],
        role_id: [
          { required: true, message: '必须选择所归属的角色类型', trigger: 'change' }
        ],
        user_state: [
          { required: true, message: '必须选择账户是否启用', trigger: 'change' }
        ]
      },
      enterpriseList: [],
      roleList: [],
      sel: {}
    }
  },
  methods: {
    // 获取账户列表
    get_list () {
      this.loading = true
      let params = {
        currentPage: this.page_index,
        pageSize: this.ps
      }
      if (this.searchValue) {
        params.login_name = this.searchValue
      }
      getUserList(params).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.tableData = res.data.data.records
          this.total_ps = res.data.data.total
        } else {
          this.$Message.error(res.data.message)
        }
        this.loading = false
      })
    },
    // 搜索
    handleSearch () {
      console.log('搜索')
      this.get_list()
    },
    // 添加按钮
    handleAdd () {
      this.is_add_show = false
      this.text_header = '新建账户'
      this.formValidate = {
        login_name: '',
        user_name: '',
        user_phone: '',
        org_id: '',
        role_id: '',
        user_state: 0
      }
    },
    // 表格内账号启用开关
    switch_change (params, val) {
      let data = {
        user_id: params.user_id,
        user_state: val
      }
      lockUser(data).then(res => {
        console.log(res)
        if (res.data) {
          this.$Message.success({
            content: '操作成功！',
            top: 100
          })
        } else {
          this.$Message.error({
            content: '操作失败！',
            top: 100
          })
        }
      })
    },
    // 查看
    show (index) {
      console.log(index)
      this.sel = this.tableData[index]
      this.is_detail_show = false
      this.is_editor = true
    },
    // 表格内删除
    remove (index) {
      deleteUser(this.tableData[index].user_id).then(res => {
        if (res.status === 200) {
          this.$Message.success({
            content: '删除账户成功！',
            top: 100
          })
          this.get_list()
        } else {
          this.$Message.error({
            content: '删除账户失败！',
            top: 100
          })
        }
      })
    },
    // 换页
    handlepage (val) {
      this.page_index = val
      this.get_list()
    },
    // 每页条数切换
    handlepagesize (val) {
      this.page_index = 1
      this.ps = val
      this.get_list()
    },
    // 新建或者编辑页面关闭
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
    // 关闭详情页面
    close_detail () {
      this.is_detail_show = true
      this.is_editor = false
    },
    // 新建或者编辑表单提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        console.log(this.is_editor)
        if (valid) {
          console.log(this.formValidate)
          this.formValidate.user_state = this.formValidate.user_state * 1
          if (!this.is_editor) {
            addUser(this.formValidate).then(res => {
              console.log(res)
              this.$Message.success({
                content: '添加账号成功！',
                top: 100
              })
              this.is_add_show = true
              this.get_list()
            })
          } else {
            updateUser(this.formValidate).then(res => {
              console.log(res)
              this.$Message.success({
                content: '修改账户成功！',
                top: 100
              })
              this.is_add_show = true
              this.get_list()
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
    // 编辑按钮
    handleeditor () {
      this.text_header = '编辑账户'
      this.is_add_show = false
      this.is_detail_show = true
      this.is_editor = true
      this.formValidate = this.sel
    }
  },
  mounted () {
    this.get_list()
    getRoleList().then(res => {
      if (res.status === 200) {
        this.roleList = res.data.data
      } else {
        this.$Message.error(res.data.message)
      }
    })
    getOrgList().then(res => {
      if (res.status === 200) {
        this.enterpriseList = res.data.data
      } else {
        this.$Message.error(res.data.message)
      }
    })
  }
}
</script>

<style>

</style>
