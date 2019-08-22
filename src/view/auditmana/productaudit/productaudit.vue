<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-20 10:44:15
 * @LastEditTime: 2019-08-22 11:12:09
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <Card>
      <span>产品审批</span>
      <Tabs type="card" @on-click="get_audit_list">
        <TabPane :label="'未审核(' + noaudit_num + ')'">
          <div class="search-con search-con-top">
            <Input clearable placeholder="输入产品名称" class="search-input" v-model="noAudit_name"/>
            <Input clearable placeholder="输入企业名称" class="search-input" v-model="noAudit_company"/>
            <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
          </div>
          <Table border :columns="columns_noaudit" :data="noauditData"></Table>
          <Page :total="noAudit_total_ps" size="small" transfer show-total show-elevator show-sizer @on-change="handlepage_noAudit" @on-page-size-change='handlepagesize_noAudit'/>
        </TabPane>
        <TabPane :label="'已审核(' + audit_num + ')'">
          <div class="search-con search-con-top">
            <Input clearable placeholder="输入产品名称" class="search-input" v-model="audit_name"/>
            <Input clearable placeholder="输入企业名称" class="search-input" v-model="audit_company"/>
            <Input clearable placeholder="输入产品ID" class="search-input" v-model="audit_id"/>
            <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
          </div>
          <Table border :columns="columns_audit" :data="auditData"></Table>
          <Page :total="audit_total_ps" size="small" transfer show-total show-elevator show-sizer @on-change="handlepage_audit" @on-page-size-change='handlepagesize_audit'/>
        </TabPane>
        <Modal
          :width = 50
          :mask-closable=false
          v-model="noAudit_model"
          title="审批"
          @on-ok="noAudit_ok"
          @on-cancel="noAudit_cancel">
          <Form :model="onAudit_Item" :label-width="120">
            <FormItem label="品产名称:">
              {{onAudit_Item.name}}
            </FormItem>
            <FormItem label="企业名称:">
              {{onAudit_Item.company}}
            </FormItem>
            <FormItem label="所属分类:">
              {{onAudit_Item.kind}}
            </FormItem>
            <FormItem label="移动产品ID:">
              <Input v-model="onAudit_Item.yd_id" placeholder="请输入移动产品ID"></Input>
            </FormItem>
            <FormItem label="移动产品密钥:">
              <Input v-model="onAudit_Item.yd_key" placeholder="请输入移动产品密钥"></Input>
            </FormItem>
            <FormItem label="电信产品ID:">
              <Input v-model="onAudit_Item.dx_id" placeholder="请输入电信产品ID"></Input>
            </FormItem>
            <FormItem label="电信产品密钥:">
              <Input v-model="onAudit_Item.dx_key" placeholder="请输入电信产品密钥"></Input>
            </FormItem>
            <FormItem label="节点类型:">
              {{onAudit_Item.node_kind}}
            </FormItem>
            <FormItem label="是否接入网管:">
              {{onAudit_Item.is_online}}
            </FormItem>
            <FormItem label="联网协议:">
              {{onAudit_Item.online_kind}}
            </FormItem>
            <FormItem label="数据格式:">
              {{onAudit_Item.data_kind}}
            </FormItem>
            <FormItem label="创建时间:">
              {{onAudit_Item.create_time}}
            </FormItem>
            <FormItem label="审批意见:">
              <Input v-model="onAudit_Item.des" placeholder="请输入审批意见"></Input>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          :width = 50
          v-model="audit_model"
          title="详情"
          @on-ok="audit_ok">
          <Form :model="audit_Item" :label-width="120">
            <FormItem label="品产名称:">
              {{audit_Item.name}}
            </FormItem>
            <FormItem label="企业名称:">
              {{audit_Item.company}}
            </FormItem>
            <FormItem label="所属分类:">
              {{audit_Item.kind}}
            </FormItem>
            <FormItem label="移动产品ID:">
              {{audit_Item.yd_id}}
            </FormItem>
            <FormItem label="移动产品密钥:">
              {{audit_Item.yd_key}}
            </FormItem>
            <FormItem label="电信产品ID:">
              {{audit_Item.dx_id}}
            </FormItem>
            <FormItem label="电信产品密钥:">
              {{audit_Item.dx_key}}
            </FormItem>
            <FormItem label="节点类型:">
              {{audit_Item.node_kind}}
            </FormItem>
            <FormItem label="是否接入网管:">
              {{audit_Item.is_online}}
            </FormItem>
            <FormItem label="联网协议:">
              {{audit_Item.online_kind}}
            </FormItem>
            <FormItem label="数据格式:">
              {{audit_Item.data_kind}}
            </FormItem>
            <FormItem label="创建时间:">
              {{audit_Item.create_time}}
            </FormItem>
            <FormItem label="审批意见:">
              {{audit_Item.des}}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          :width = 50
          :mask-closable=false
          v-model="editor_model"
          title="编辑"
          @on-ok="editorAudit_ok"
          @on-cancel="editorAudit_cancel">
          <Form :model="audit_Item" :label-width="120">
            <FormItem label="品产名称:">
              {{audit_Item.name}}
            </FormItem>
            <FormItem label="企业名称:">
              {{audit_Item.company}}
            </FormItem>
            <FormItem label="所属分类:">
              {{audit_Item.kind}}
            </FormItem>
            <FormItem label="移动产品ID:">
              <Input v-model="audit_Item.yd_id" placeholder="请输入移动产品ID"></Input>
            </FormItem>
            <FormItem label="移动产品密钥:">
              <Input v-model="audit_Item.yd_key" placeholder="请输入移动产品密钥"></Input>
            </FormItem>
            <FormItem label="电信产品ID:">
              <Input v-model="audit_Item.dx_id" placeholder="请输入电信产品ID"></Input>
            </FormItem>
            <FormItem label="电信产品密钥:">
              <Input v-model="audit_Item.dx_key" placeholder="请输入电信产品密钥"></Input>
            </FormItem>
            <FormItem label="节点类型:">
              {{audit_Item.node_kind}}
            </FormItem>
            <FormItem label="是否接入网管:">
              {{audit_Item.is_online}}
            </FormItem>
            <FormItem label="联网协议:">
              {{audit_Item.online_kind}}
            </FormItem>
            <FormItem label="数据格式:">
              {{audit_Item.data_kind}}
            </FormItem>
            <FormItem label="创建时间:">
              {{audit_Item.create_time}}
            </FormItem>
            <FormItem label="审批意见:">
              <Input v-model="audit_Item.des" placeholder="请输入审批意见"></Input>
            </FormItem>
          </Form>
        </Modal>
      </Tabs>
    </Card>
  </div>
</template>

<script>
// import Tables from '_c/tables'
import './productaudit.less'
// import { getProductList } from '@/api/data'
export default {
  name: 'tree_table_page',

  data () {
    return {
      noaudit_num: 3,
      audit_num: 3,
      columns_noaudit: [
        { title: '产品名称', key: 'name' },
        { title: '企业', key: 'company' },
        { title: '所属分类', key: 'kind' },
        { title: '创建时间', key: 'time' },
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
                    this.noAudit_show(params.index)
                  }
                }
              }, '审批')
            ])
          }
        }
      ],
      noauditData: [
        { name: '嵊州地磁', company: 'XXX有限公司', kind: '智慧城市-公共服务-地磁', time: '2019-08-20' },
        { name: '嵊州地磁', company: 'XXX有限公司', kind: '智慧城市-公共服务-地磁', time: '2019-08-20' },
        { name: '嵊州地磁', company: 'XXX有限公司', kind: '智慧城市-公共服务-地磁', time: '2019-08-20' }
      ],
      columns_audit: [
        { title: '产品名称', key: 'name' },
        { title: '企业', key: 'company' },
        { title: '所属分类', key: 'kind' },
        { title: '产品ID', key: 'id' },
        { title: '创建时间', key: 'time' },
        {
          title: '操作',
          key: 'handle',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.audit_show(params.index)
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.audit_editor(params.index)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      auditData: [
        { name: '嵊州地磁', company: 'XXX有限公司', kind: '智慧城市-公共服务-地磁', time: '2019-08-20', id: 'DASKJDKASDASD124' },
        { name: '嵊州地磁', company: 'XXX有限公司', kind: '智慧城市-公共服务-地磁', time: '2019-08-20', id: 'DASKJDKASDASD124' },
        { name: '嵊州地磁', company: 'XXX有限公司', kind: '智慧城市-公共服务-地磁', time: '2019-08-20', id: 'DASKJDKASDASD124' }
      ],
      noAudit_name: '',
      noAudit_company: '',
      audit_name: '',
      audit_company: '',
      audit_id: '',
      noAudit_total_ps: 40,
      noAudit_page_index: 1,
      noAudit_ps: 10,
      audit_total_ps: 50,
      audit_page_index: 1,
      audit_ps: 10,
      noAudit_model: false,
      audit_model: false,
      editor_model: false,
      onAudit_Item: {
        name: '嵊州地磁',
        company: 'XXX有限公司',
        kind: '智慧城市-公共服务-地磁',
        yd_id: '',
        yd_key: '',
        dx_id: '',
        dx_key: '',
        node_kind: '设备',
        is_online: '是',
        online_kind: 'CoAp',
        data_kind: 'ICA 标准数据格式(Alink JSON)',
        create_time: '2019-08-20',
        des: ''
      },
      audit_Item: {
        name: '嵊州地磁',
        company: 'XXX有限公司',
        kind: '智慧城市-公共服务-地磁',
        yd_id: '123456789',
        yd_key: 'ASDFGHJKL',
        dx_id: '123456789',
        dx_key: 'ASDFGHJKL',
        node_kind: '设备',
        is_online: '是',
        online_kind: 'CoAp',
        data_kind: 'ICA 标准数据格式(Alink JSON)',
        create_time: '2019-08-20',
        des: '123'
      }
    }
  },
  methods: {
    // Tab切换获取已审核列表
    get_audit_list () {
      console.log(1)
    },
    // 搜索
    handleSearch () {
      console.log('搜索')
    },
    // 表格内审批
    noAudit_show (index) {
      console.log(index)
      this.noAudit_model = true
    },
    // 表格内详情
    audit_show (index) {
      this.audit_model = true
    },
    // 表格内编辑
    audit_editor () {
      this.editor_model = true
    },
    // 待审核换页
    handlepage_noAudit (val) {
      console.log(val)
    },
    // 待审核更换每页条数
    handlepagesize_noAudit (val) {
      console.log(val)
    },
    // 已审核换页
    handlepage_audit (val) {
      console.log(val)
    },
    // 已审核更换每页条数
    handlepagesize_audit (val) {
      console.log(val)
    },
    // 审核确定
    noAudit_ok () {

    },
    // 审核取消
    noAudit_cancel () {

    },
    // 详情确定
    audit_ok () {

    },
    // 编辑确定
    editorAudit_ok () {

    },
    // 编辑取消
    editorAudit_cancel () {

    }
  },
  mounted () {
    // getTableData().then(res => {
    //   this.tableData = res.data
    // })
  }
}
</script>

<style>

</style>
