<template>
  <div>
    <Card v-if="is_add_show && is_detail_show">
      <span>角色管理</span>
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入角色名关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button @click="handleAdd" class="add-btn" type="success"><Icon type="search"/>&nbsp;添加角色&nbsp;</Button>
      </div>
      <Table border :columns="columns" :data="tableData"></Table>
      <Page :total="total_ps" size="small" show-total show-elevator show-sizer @on-change="handlepage" @on-page-size-change='handlepagesize'/>
    </Card>
    <Card v-if="!is_add_show" class="add_card">
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close"/>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="角色名称" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入角色名称" clearable></Input>
        </FormItem>
        <FormItem label="角色描述">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入角色描述..."></Input>
        </FormItem>
        <FormItem label="角色权限">
          <FormItem label="">
          </FormItem>
          <span>数据展示</span>
          <FormItem label="首页">
            <CheckboxGroup v-model="formValidate.home">
              <Checkbox label="查看"></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <span>设备管理</span>
          <FormItem label="产品列表">
            <CheckboxGroup v-model="formValidate.product" @on-change="checkAllGroupChange_product">
              <Checkbox label="查看"></Checkbox>
              <Checkbox label="修改"></Checkbox>
              <Checkbox label="新建"></Checkbox>
              <Checkbox label="删除"></Checkbox>
              <Checkbox
              :indeterminate="indeterminate.product"
              :value="checkAll.product"
              @click.prevent.native="handleCheckAll('product')">全选</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="设备列表">
            <CheckboxGroup v-model="formValidate.eq" @on-change="checkAllGroupChange_eq">
              <Checkbox label="查看"></Checkbox>
              <Checkbox label="修改"></Checkbox>
              <Checkbox label="新建"></Checkbox>
              <Checkbox label="删除"></Checkbox>
              <Checkbox
              :indeterminate="indeterminate.eq"
              :value="checkAll.eq"
              @click.prevent.native="handleCheckAll('eq')">全选</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="分组管理">
            <CheckboxGroup v-model="formValidate.group" @on-change="checkAllGroupChange_group">
              <Checkbox label="查看"></Checkbox>
              <Checkbox label="修改"></Checkbox>
              <Checkbox label="新建"></Checkbox>
              <Checkbox label="删除"></Checkbox>
              <Checkbox
              :indeterminate="indeterminate.group"
              :value="checkAll.group"
              @click.prevent.native="handleCheckAll('group')">全选</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <span>权限管理</span>
          <FormItem label="角色管理">
            <CheckboxGroup v-model="formValidate.role" @on-change="checkAllGroupChange_role">
              <Checkbox label="查看"></Checkbox>
              <Checkbox label="修改"></Checkbox>
              <Checkbox label="新建"></Checkbox>
              <Checkbox label="删除"></Checkbox>
              <Checkbox
              :indeterminate="indeterminate.role"
              :value="checkAll.role"
              @click.prevent.native="handleCheckAll('role')">全选</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="账号管理">
            <CheckboxGroup v-model="formValidate.account" @on-change="checkAllGroupChange_account">
              <Checkbox label="查看"></Checkbox>
              <Checkbox label="修改"></Checkbox>
              <Checkbox label="新建"></Checkbox>
              <Checkbox label="删除"></Checkbox>
              <Checkbox
              :indeterminate="indeterminate.account"
              :value="checkAll.account"
              @click.prevent.native="handleCheckAll('account')">全选</Checkbox>
            </CheckboxGroup>
          </FormItem>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card v-if="!is_detail_show" class="detail_card">
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close_detail"/>
      <div class="header">角色详情</div>
      <Button class="edit" type="info" @click="handleeditor">编辑</Button>
      <div class="down">
        <Row class='detail'>
          <Col span="24">
            <Col span="3">角色名称:</Col>
            <Col span="5">{{sel.name}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">角色描述:</Col>
            <Col span="5">{{sel.desc}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">角色权限:</Col>
            <Col span="21">
              <Col class="detail_text" span="24">
                <Col span="4">&nbsp;</Col>
                <Col span="5">查看</Col>
                <Col span="5">修改</Col>
                <Col span="5">新建</Col>
                <Col span="5">删除</Col>
              </Col>
              <Col span="24">
                <Col span="4">首页</Col>
                <Col span="5">
                  <Icon v-if="sel.home[0] == '查看'" class='ischeck' type="md-checkmark" />
                </Col>
              </Col>
              <Col span="24">
                <Col class="detail_text" span="4">设备管理</Col>
              </Col>
              <Col span="24">
                <Col span="4">产品列表</Col>
                <Col span="5">
                  <Icon v-if="sel.product[0] == '查看'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.product[1] == '修改'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.product[2] == '新建'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.product[3] == '删除'" class='ischeck' type="md-checkmark" />
                </Col>
              </Col>
              <Col span="24">
                <Col span="4">设备列表</Col>
                <Col span="5">
                  <Icon v-if="sel.eq[0] == '查看'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.eq[1] == '修改'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.eq[2] == '新建'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.eq[3] == '删除'" class='ischeck' type="md-checkmark" />
                </Col>
              </Col>
              <Col span="24">
                <Col span="4">分组管理</Col>
                <Col span="5">
                  <Icon v-if="sel.group[0] == '查看'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.group[1] == '修改'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.group[2] == '新建'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.group[3] == '删除'" class='ischeck' type="md-checkmark" />
                </Col>
              </Col>
              <Col span="24">
                <Col class="detail_text" span="4">权限管理</Col>
              </Col>
              <Col span="24">
                <Col span="4">角色管理</Col>
                <Col span="5">
                  <Icon v-if="sel.role[0] == '查看'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.role[1] == '修改'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.role[2] == '新建'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.role[3] == '删除'" class='ischeck' type="md-checkmark" />
                </Col>
              </Col>
              <Col span="24">
                <Col span="4">账号管理</Col>
                <Col span="5">
                  <Icon v-if="sel.account[0] == '查看'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.account[1] == '修改'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.account[2] == '新建'" class='ischeck' type="md-checkmark" />
                </Col>
                <Col span="5">
                  <Icon v-if="sel.account[3] == '删除'" class='ischeck' type="md-checkmark" />
                </Col>
              </Col>
            </Col>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>

<script>
// import Tables from '_c/tables'
import './rolemana.less'
import { getTableData } from '@/api/data'
export default {
  name: 'tables_page',

  data () {
    return {
      columns: [
        { title: '角色名称', key: 'name' },
        { title: '角色描述', key: 'name' },
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
        desc: '',
        home: [],
        product: [],
        eq: [],
        group: [],
        role: [],
        account: []
      },
      ruleValidate: {
        name: [
          { required: true, message: '分组名称是必填选项', trigger: 'blur' }
        ]
      },
      indeterminate: {
        product: false,
        eq: false,
        group: false,
        role: false,
        account: false
      },
      checkAll: {
        product: false,
        eq: false,
        group: false,
        role: false,
        account: false
      },
      sel: {
        name: '运维',
        desc: '只有查询权限',
        home: ['查看'],
        product: ['查看'],
        eq: ['查看'],
        group: ['查看'],
        role: ['查看'],
        account: ['查看']
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
        name: '',
        desc: ''
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
        content: '是否删除该角色，删除后无法撤销！',
        onOk: () => {
          this.$Message.success({
            content: '设备删除成功！',
            top: 100
          })
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
    handleCheckAll (val) {
      console.log(val)
      console.log(this.indeterminate[val])
      if (this.indeterminate[val]) {
        this.checkAll[val] = false
      } else {
        this.checkAll[val] = !this.checkAll[val]
      }
      this.indeterminate[val] = false
      if (this.checkAll[val]) {
        this.formValidate[val] = ['查看', '修改', '新建', '删除']
      } else {
        this.formValidate[val] = []
      }
    },
    checkAllGroupChange_product (data) {
      if (data.length === 4) {
        this.indeterminate.product = false
        this.checkAll.product = true
      } else if (data.length > 0) {
        this.indeterminate.product = true
        this.checkAll.product = false
      } else {
        this.indeterminate.product = false
        this.checkAll.product = false
      }
    },
    checkAllGroupChange_eq (data) {
      if (data.length === 4) {
        this.indeterminate.eq = false
        this.checkAll.eq = true
      } else if (data.length > 0) {
        this.indeterminate.eq = true
        this.checkAll.eq = false
      } else {
        this.indeterminate.eq = false
        this.checkAll.eq = false
      }
    },
    checkAllGroupChange_group (data) {
      if (data.length === 4) {
        this.indeterminate.group = false
        this.checkAll.group = true
      } else if (data.length > 0) {
        this.indeterminate.group = true
        this.checkAll.group = false
      } else {
        this.indeterminate.group = false
        this.checkAll.group = false
      }
    },
    checkAllGroupChange_role (data) {
      if (data.length === 4) {
        this.indeterminate.role = false
        this.checkAll.role = true
      } else if (data.length > 0) {
        this.indeterminate.role = true
        this.checkAll.role = false
      } else {
        this.indeterminate.role = false
        this.checkAll.role = false
      }
    },
    checkAllGroupChange_account (data) {
      if (data.length === 4) {
        this.indeterminate.account = false
        this.checkAll.account = true
      } else if (data.length > 0) {
        this.indeterminate.account = true
        this.checkAll.account = false
      } else {
        this.indeterminate.account = false
        this.checkAll.account = false
      }
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
