<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="code">
      <Row>
        <Col span="12" style="margin-top:4px">
          <Input v-model="form.code" placeholder="请输入验证码"></Input>
        </Col>
        <Col span="12">
          <div class="login-code" @click="refreshCode">
            <s-identify :identifyCode="identifyCode"></s-identify>
          </div>
        </Col>
      </Row>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import SIdentify from './verification-code'
export default {
  name: 'LoginForm',
  components: { SIdentify },
  data () {
    const validateCode = (rule, value, callback) => {
      if (this.identifyCode !== value.toUpperCase()) {
        this.form.code = ''
        this.refreshCode()
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ]
      },
      form: {
        userName: 'super_admin',
        password: '',
        code: ''
      },
      identifyCodes: '1234567890ABCDEFGHJKLMNOPQRSTUVWXYZ',
      identifyCode: ''
    }
  },
  computed: {

  },
  methods: {
    // 提交账号密码
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password
          })
        }
      })
    },
    // 更换验证码
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
      console.log(this.identifyCode)
    },
    // 生成随即
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
    }
  },
  mounted () {
    this.refreshCode()
  }
}
</script>
