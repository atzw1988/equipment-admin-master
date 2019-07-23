<template>
  <div>

    <Card v-if="is_show">
      <div class="search-con search-con-top">
        <Input clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary"><Icon type="search"/>&nbsp;搜索&nbsp;</Button>
        <Button @click="handleAdd" class="add-btn" type="success"><Icon type="search"/>&nbsp;新建&nbsp;</Button>
      </div>
      <!-- <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"/> -->
      <Table border :columns="columns" :data="tableData"></Table>
    </Card>
    <Card v-if="!is_show">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="220">
        <span class="header_text">基础信息</span>
        <FormItem label="产品名称" prop="name">
          <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="所属分类" prop="kind">
          <Cascader :data="eq_kind" v-model="formValidate.kind"></Cascader>
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
            <Radio label="male">设备</Radio>
            <Radio label="female">网关</Radio>
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
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
// import Tables from '_c/tables'
import './index.less'
import { getTableData } from '@/api/data'
export default {
  name: 'tables_page',

  data () {
    return {
      columns: [
        { title: '产品名称', key: 'name', sortable: true },
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
      is_show: true,
      tableData: [],
      searchValue: '',
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
          { required: true, message: '请选择产品所属分类', trigger: 'blur' }
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
          value: '0',
          label: '智慧城市',
          children: [
            {
              value: '00',
              label: '公共服务',
              children: [
                {
                  value: '000',
                  label: '定位器'
                },
                {
                  value: '001',
                  label: '地磁检测器'
                },
                {
                  value: '002',
                  label: '智能井盖'
                },
                {
                  value: '003',
                  label: '井盖锁'
                },
                {
                  value: '004',
                  label: '垃圾箱'
                },
                {
                  value: '005',
                  label: '绿灯照明'
                }
              ]
            },
            {
              value: '01',
              label: '消防安全'
            },
            {
              value: '02',
              label: '智能楼宇'
            }
          ]
        },
        {
          value: '1',
          label: '智慧生活'
        },
        {
          value: '2',
          label: '智慧园区'
        }
      ]
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
      this.is_show = false
    },
    show (index) {
      console.log(index)
    },
    remove (index) {
      console.log(index)
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
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
