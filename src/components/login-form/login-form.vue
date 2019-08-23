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
    <Checkbox v-model="is_remember">记住密码</Checkbox>
    <span @click="find_my" class="login-tip">忘记密码?</span>
  </Form>
</template>
<script>
import SIdentify from './verification-code'
import { setCookie, getCookie, delCookie } from '@/libs/util'
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
      identifyCode: '',
      is_remember: false
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
          console.log(this.is_remember)
          let accountInfo = this.form.userName + '&' + this.form.password
          if (this.is_remember) {
            console.log(accountInfo)
            setCookie('accountInfo', accountInfo, 1440 * 3)
          } else {
            delCookie('accountInfo')
          }
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
    },
    loadAccountInfo () {
      let accountInfo = getCookie('accountInfo')
      if (Boolean(accountInfo) === false) {
        return false
      } else {
        let index = accountInfo.indexOf('&')
        let userName = accountInfo.substring(0, index)
        let passWord = accountInfo.substring(index + 1)
        this.form.userName = userName
        this.form.password = passWord
        this.is_remember = true
      }
    },
    // 跳转找回密码
    find_my () {
      this.$router.push({ name: 'password_page' })
    }
  },
  mounted () {
    this.refreshCode()
    this.loadAccountInfo()
  }
}
</script>
