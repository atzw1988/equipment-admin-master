<template>
  <div>
    <Card v-if="is_add_show && is_detail_show">
      <span>组织机构</span>
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入公司名关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button @click="handleAdd" class="add-btn" type="success"><Icon type="search"/>&nbsp;新建机构&nbsp;</Button>
      </div>
      <Table border :columns="columns" :data="tableData"></Table>
      <Page :total="total_ps" size="small" show-total show-elevator show-sizer @on-change="handlepage" @on-page-size-change='handlepagesize'/>
    </Card>
    <Card v-if="!is_add_show" class="add_card">
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close"/>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="220">
        <FormItem label="公司名称" prop="company">
          <Input v-model="formValidate.company" placeholder="请输入公司名称" clearable></Input>
        </FormItem>
        <FormItem label="联系人" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入联系人" clearable></Input>
        </FormItem>
        <FormItem label="联系电话" prop="phone">
          <Input v-model="formValidate.phone" placeholder="请输入联系电话" clearable></Input>
        </FormItem>
        <FormItem label="公司描述">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入公司描述,最多100个字符..."></Input>
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
      <tree-table expand-key="account" :expand-type="false" :selectable="false" :columns="columns_account" :data="account_data" ></tree-table>
      <Page :total="total_ps" size="small" show-total show-elevator show-sizer @on-change="handlepage_ac" @on-page-size-change='handlepagesize_ac'/>
    </Card>
  </div>
</template>

<script>
// import Tables from '_c/tables'
import './organization.less'
import { getTableData } from '@/api/data'
export default {
  name: 'tree_table_page',

  data () {
    return {
      columns: [
        { title: '公司名称', key: 'name' },
        { title: '联系人', key: 'email' },
        { title: '电话', key: 'email' },
        { title: '角色数', key: 'email' },
        { title: '用户数', key: 'email' },
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
      is_add_show: true,
      is_detail_show: true,
      is_editor: false,
      tableData: [],
      searchValue: '',
      total_ps: 40,
      page_index: 1,
      ps: 10,
      formValidate: {
        company: '',
        name: '',
        phone: '',
        desc: ''
      },
      ruleValidate: {
        company: [
          { required: true, message: '账户名称是必填选项', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名是必填选项', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话是必填选项', trigger: 'blur' }
        ]
      },
      sel: {
        company: 'huateng',
        name: '张三',
        phone: '18888888888',
        desc: '123...123',
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
    },
    handleSearch_ac () {

    },
    handlepage_ac (val) {
      console.log(val)
    },
    handlepagesize_ac (val) {
      console.log(val)
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
