<template>
  <div>
    <Card v-if="is_add_show && is_detail_show">
      <span>角色管理</span>
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入角色名关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button @click="handleAdd" class="add-btn" type="success"><Icon type="search"/>&nbsp;添加角色&nbsp;</Button>
      </div>
      <Table :loading='loading' border :columns="columns" :data="role_list"></Table>
      <Page :total="total_ps" size="small" show-total show-elevator show-sizer @on-change="handlepage" @on-page-size-change='handlepagesize'/>
    </Card>
    <Card v-if="!is_add_show" class="add_card">
      <Icon class="close_add" type="md-close-circle" size='24' @click.stop="close"/>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="角色名称" prop="role_name">
          <Input v-model="formValidate.role_name" placeholder="请输入角色名称" clearable></Input>
        </FormItem>
        <FormItem label="角色描述">
          <Input v-model="formValidate.role_ms" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入角色描述..."></Input>
        </FormItem>
        <FormItem label="角色权限">
          <FormItem label="">
          </FormItem>
            <div class="app-container">
              <Tree-table :data="data_tree" :columns="columns_tree" border @getAuth="getAuth"></Tree-table>
            </div>
          </FormItem>
        </FormItem>
        <FormItem>
          <Button class="reset_btn" @click="handleReset('formValidate')">重置</Button>
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
            <Col span="5">{{sel.role_name}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">角色描述:</Col>
            <Col span="5">{{sel.role_ms}}</Col>
          </Col>
          <Col span="24">
            <Col span="3">角色权限:</Col>
            <Col span="21">
              <Col class="detail_text" span="24">
                <Col span="4">&nbsp;</Col>
                <Col span="4">查看</Col>
                <Col span="4">修改</Col>
                <Col span="4">新建</Col>
                <Col span="4">删除</Col>
                <Col span="4">锁定</Col>
              </Col>
              <Col span="24" v-for="(item, index) in data_tree" :key="index">
                <Col class="detail_text" span="4">{{item.description}}</Col>
                <Col span="24" v-for="ele in item.children" :key="ele.id">
                  <Col span="4">{{ele.description}}</Col>
                  <Col span="4" v-for="par in ele.sonData1" :key="par.id">
                    <Icon v-if="is_have(par.name)" class='ischeck' type="md-checkmark" />
                  </Col>
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
import TreeTable from '@/components/TreeTableAuthor'
import './rolemana.less'
import { getRoleList, deleteRole, roleDetail, getModuleList, addRole, updateRole } from '@/api/rolemana'
export default {
  name: 'tables_page',
  components: { TreeTable },
  data () {
    return {
      columns: [
        { title: '角色名称', key: 'role_name' },
        { title: '角色描述', key: 'role_ms' },
        { title: '用户数', key: 'userNumber' },
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
      role_list: [],
      loading: false,
      searchValue: '',
      total_ps: 40,
      page_index: 1,
      ps: 10,
      mod_list: [],
      formValidate: {},
      ruleValidate: {
        role_name: [
          { required: true, message: '分组名称是必填选项', trigger: 'blur' }
        ]
      },
      indeterminate: {},
      checkAll: {},
      check_list: {},
      sel: {
        name: '运维',
        desc: '只有查询权限',
        home: ['查看'],
        product: ['查看'],
        eq: ['查看'],
        group: ['查看'],
        role: ['查看'],
        account: ['查看']
      },
      columns_tree: [
        {
          text: '菜单列表',
          value: 'description',
          width: 200,
          option: 'sonData1'
        },
        {
          text: '功能权限',
          value: 'sonData1',
          option: 'sonData1',
          act: 'act'
        }
      ],
      data_tree: [],
      moudel_list: []
    }
  },
  methods: {
    getAuth (data) {
      let opt = []
      data.forEach(val => {
        opt.push(val.id)
        if (val.children) {
          val.children.forEach(el => {
            if (el.selectchecked.length) {
              opt.push(el.id)
              opt.push(el.selectchecked)
            }
          })
        }
      })
      console.log(data)
      opt = opt.join().split(',').filter(n => { return n })
      console.log(opt)
      this.$refs['formValidate'].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.formValidate.modules = opt.join(',')
          console.log(this.formValidate)
          if (!this.is_editor) {
            addRole(this.formValidate).then(res => {
              console.log(res)
              if (res.data.status === '200') {
                this.success_msg('添加角色成功！')
                this.is_add_show = true
                this.get_role_list()
              } else {
                this.eeror_msg('添加角色失败！')
              }
            })
          } else {
            updateRole(this.formValidate).then(res => {
              console.log(res)
              if (res.data.status === '200') {
                this.success_msg('修改角色成功！')
                this.is_add_show = true
                this.get_role_list()
              } else {
                this.eeror_msg('修改角色失败！')
              }
            })
          }
        } else {
          this.error_msg('必填选项不能为空！')
        }
      })
    },
    // 获取角色列表
    get_role_list () {
      this.loading = true
      let params = {
        currentPage: this.page_index,
        pageSize: this.ps
      }
      if (this.searchValue) {
        params.roleName = this.searchValue
      }
      getRoleList(params).then(res => {
        if (res.status === 200) {
          this.role_list = res.data.data.records
          this.total_ps = res.data.data.total
        } else {
          this.role_list = []
          this.error_msg('获取列表失败！')
        }
        this.loading = false
      })
    },
    // 获取模块列表
    get_module_list () {
      getModuleList().then(res => {
        if (res.status === 200) {
          let list = []
          let data = res.data.data
          console.log(data)
          data.forEach(item => {
            if (!item.parent_id) {
              let params = {
                type: 0,
                description: item.modules_name,
                'checked': false,
                'id': item.modules_id,
                isIndeterminate: false,
                checkAll: false,
                act: '全选',
                children: []
              }
              list.push(params)
            }
          })
          data.forEach(item => {
            list.forEach(ele => {
              if (item.parent_id === ele.id) {
                let params = {
                  type: 1,
                  'id': item.modules_id,
                  'description': item.modules_name,
                  'parentId': '-1',
                  'checked': false,
                  selectchecked: [],
                  checkAll: false,
                  isIndeterminate: false,
                  'sonData1': []
                }
                this.indeterminate[item.modules_permission] = false
                this.checkAll[item.modules_permission] = false
                this.check_list[item.modules_permission] = []
                ele.children.push(params)
              }
            })
          })
          data.forEach(item => {
            list.forEach(ele => {
              ele.children.forEach(a => {
                if (item.parent_id === a.id) {
                  let params = {
                    type: 2,
                    'description': item.modules_name,
                    'parentId': a.id,
                    'checked': false,
                    'id': item.modules_id,
                    name: item.modules_permission
                  }
                  a.sonData1.push(params)
                  // this.check_list[a.modules_permission].push(item.modules_id)
                }
              })
            })
          })
          console.log(list)
          this.data_tree = list
        } else {
          this.notice_error_msg('获取模块列表失败！')
        }
      })
    },
    handleSearch () {
      console.log('搜索')
      this.get_role_list()
    },
    // 新建角色
    handleAdd () {
      this.is_add_show = false
      this.formValidate = {}
    },
    // 表格内查看角色详情
    show (index) {
      console.log(this.role_list)
      this.sel = this.role_list[index]
      this.is_detail_show = false
      this.is_editor = true
      let params = {
        role_id: this.role_list[index].role_id
      }
      roleDetail(params).then(res => {
        let data = res.data.data.modules.split(',')
        this.moudel_list = data
        console.log(this.moudel_list)
      })
    },
    // 对比权限
    is_have (ele) {
      return this.moudel_list.some(item => {
        return item === ele
      })
    },
    // 表格内删除
    remove (index) {
      console.log(index)
      deleteRole(this.role_list[index].role_id).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.success_msg('角色删除成功！')
          this.get_role_list()
        } else {
          this.error_msg('角色删除失败！')
        }
      })
    },
    handlepage (val) {
      console.log(val)
      this.page_index = val
      this.get_role_list()
    },
    handlepagesize (val) {
      console.log(val)
      this.page_index = 1
      this.ps = val
      this.get_role_list()
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
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleeditor () {
      this.is_add_show = false
      this.is_detail_show = true
      this.is_editor = true
      this.formValidate = this.sel
      console.log(this.data_tree)
      this.data_tree.forEach(a => {
        a.children.forEach(b => {
          b.sonData1.forEach(c => {
            if (this.is_have(c.name)) {
              c.checked = true
              b.selectchecked.push(c.id)
            }
          })
        })
      })
    }
  },
  mounted () {
    this.get_role_list()
    this.get_module_list()
  }
}
</script>

<style>

</style>
