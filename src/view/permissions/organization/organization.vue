<template>
  <div>
    <Card v-if="is_add_show && is_detail_show">
      <span>组织机构</span>
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入公司名关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button @click="handleAdd" class="add-btn" type="success"><Icon type="search"/>&nbsp;新建机构&nbsp;</Button>
      </div>
      <Table :loading='loading_org' border :columns="columns" :data="org_list"></Table>
      <Page :total="total_ps_org" size="small" show-total show-elevator show-sizer @on-change="handlepage" @on-page-size-change='handlepagesize'/>
    </Card>
    <Card v-if="!is_add_show" class="add_card">
      <div class="header">{{text_header}}</div>
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close"/>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="220">
        <FormItem label="公司名称" prop="org_name">
          <Input v-model="formValidate.org_name" placeholder="请输入公司名称" clearable></Input>
        </FormItem>
        <FormItem label="联系人" prop="org_contacts">
          <Input v-model="formValidate.org_contacts" placeholder="请输入联系人" clearable></Input>
        </FormItem>
        <FormItem label="联系电话" prop="org_phone">
          <Input v-model="formValidate.org_phone" placeholder="请输入联系电话" clearable></Input>
        </FormItem>
        <FormItem label="公司描述">
          <Input v-model="formValidate.org_description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入公司描述,最多100个字符..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card v-if="!is_detail_show" class="detail_card">
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close_detail"/>
      <div class="header">XXX有限公司</div>
      <div class="middle">
        <span>角色数：2</span>
        <Divider type="vertical" />
        <span>账户数：2</span>
      </div>
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入公司名关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch_ac" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button class="edit" type="info" @click="handleeditor">编辑</Button>
      </div>
      <tree-table :loading='loading_acc' expand-key="account" :expand-type="false" :selectable="false" :columns="columns_account" :data="account_data" ></tree-table>
      <Page :total="total_ps_acc" size="small" show-total show-elevator show-sizer @on-change="handlepage_ac" @on-page-size-change='handlepagesize_ac'/>
    </Card>
  </div>
</template>

<script>
// import Tables from '_c/tables'
import './organization.less'
import { getOrganizationList, getOrganizationDetail, addOrganization, updateOrganization, deleteOrganization } from '@/api/organization'
export default {
  name: 'tree_table_page',

  data () {
    return {
      columns: [
        { title: '公司名称', key: 'org_name' },
        { title: '联系人', key: 'org_contacts' },
        { title: '电话', key: 'org_phone' },
        { title: '角色数', key: 'roleCount' },
        { title: '用户数', key: 'userCount' },
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
      org_list: [],
      loading_org: false,
      total_ps_org: 0,
      page_index_org: 1,
      ps_org: 10,
      columns_account: [
        { title: '账号', key: 'account' },
        { title: '角色', key: 'role' },
        { title: '联系人', key: 'name' },
        { title: '联系电话', key: 'phone' },
        { title: '创建时间', key: 'createTime' }
      ],
      account_data: [
        {
          account: 'ABAB',
          role: '管理员',
          name: '张三',
          phone: '12345678901',
          createTime: '2019-07-25',
          children: [
            {
              account: 'AAAA',
              role: '运维',
              name: '李四',
              phone: '12345678901',
              createTime: '2019-07-26'
            },
            {
              account: 'BBBB',
              role: '测试',
              name: '王五',
              phone: '12345678901',
              createTime: '2019-07-26'
            }
          ]
        }
      ],
      loading_acc: false,
      total_ps_acc: 0,
      page_index_acc: 1,
      ps_acc: 10,
      is_add_show: true,
      is_detail_show: true,
      is_editor: false,
      tableData: [],
      searchValue: '',
      text_header: '',
      formValidate: {},
      ruleValidate: {
        org_name: [
          { required: true, message: '账户名称是必填选项', trigger: 'blur' }
        ],
        org_contacts: [
          { required: true, message: '姓名是必填选项', trigger: 'blur' }
        ],
        org_phone: [
          { required: true, message: '联系电话是必填选项', trigger: 'blur' }
        ]
      },
      sel: {}
    }
  },
  methods: {
    // 获取组织机构列表
    get_org_list () {
      this.loading_org = true
      let params = {
        currentPage: this.page_index_org,
        pageSize: this.ps_org
      }
      if (this.searchValue) {
        params.orgName = this.searchValue
      }
      getOrganizationList(params).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.total_ps_org = res.data.data.total
          this.org_list = res.data.data.records
        } else {
          this.error_msg('获取组织机构列表失败！')
        }
        this.loading_org = false
      })
    },
    // 搜索
    handleSearch () {
      this.get_org_list()
    },
    // 新建机构
    handleAdd () {
      this.text_header = '新建组织机构'
      this.is_add_show = false
      this.formValidate = {}
    },
    // 表格内查看机构详情
    show (index) {
      console.log(index)
      this.loading_acc = true
      this.is_detail_show = false
      this.is_editor = true
      this.sel = this.org_list[index]
      let params = {
        orgId: this.org_list[index].org_id
      }
      getOrganizationDetail(params).then(res => {
        console.log(res)
        this.loading_acc = false
      })
    },
    // 表格内删除机构
    remove (index) {
      console.log(index)
      deleteOrganization(this.org_list[index].org_id).then(res => {
        if (res.data.data) {
          this.success_msg('删除组织机构成功！')
          this.get_org_list()
        } else {
          this.error_msg('删除组织机构失败！')
        }
      })
    },
    // 换页
    handlepage (val) {
      console.log(val)
      this.page_index_org = val
      this.get_org_list()
    },
    // 更换每页条数
    handlepagesize (val) {
      console.log(val)
      this.page_index_org = 1
      this.ps_org = val
      this.get_org_list()
    },
    // 关闭新建、编辑页面
    close () {
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
    // 新建、编辑表单提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(this.formValidate)
          if (!this.is_editor) {
            addOrganization(this.formValidate).then(res => {
              if (res.status === 200) {
                this.success_msg('新建组织机构成功！')
                this.is_add_show = true
                this.get_org_list()
              } else {
                this.error_msg('新建组织机构失败！')
              }
            })
          } else {
            updateOrganization(this.formValidate).then(res => {
              if (res.status === 200) {
                this.success_msg('修改组织机构成功！')
                this.is_add_show = true
                this.get_org_list()
              } else {
                this.error_msg('修改组织机构失败！')
              }
            })
          }
        } else {
          this.error_msg('必填选项不能为空！')
        }
      })
    },
    // 新建、编辑表单重置
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 编辑页面
    handleeditor () {
      this.text_header = '编辑组织机构'
      this.is_add_show = false
      this.is_detail_show = true
      this.is_editor = true
      this.formValidate = this.sel
    },
    // 组织机构详情页内搜索
    handleSearch_ac () {

    },
    // 组织机构详情页内换页
    handlepage_ac (val) {
      console.log(val)
      this.page_index_acc = val
    },
    // 组织机构详情页更换每页条数
    handlepagesize_ac (val) {
      console.log(val)
      this.page_index_acc = 1
      this.ps_acc = val
    }
  },
  mounted () {
    this.get_org_list()
  }
}
</script>

<style>

</style>
