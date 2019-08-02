<template>
  <div class="password">
    <div class="logo">
      <img src="../../assets/images/log_ht.png" alt="">
      <span>华腾物联管理平台</span>
    </div>
    <Steps :current="current" class="step">
      <Step title="验证账号"></Step>
      <Step title="修改密码"></Step>
      <Step title="修改完成"></Step>
    </Steps>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" v-if="is_show && is_success">
      <FormItem label="帐户名" prop="account">
        <Input v-model="formValidate.account" placeholder="请输入帐户名"></Input>
      </FormItem>
      <FormItem label="验证码" prop="code">
        <Input class="code_inp" v-model="formValidate.code" placeholder="请输入手机验证码"></Input>
        <Button :disabled='!is_overdue' class="code_btn" type="success" @click="get_code">{{code_text}}</Button>
      </FormItem>
      <FormItem>
        <Button class="next_btn" type="primary" @click="handleNext('formValidate')">下一步</Button>
      </FormItem>
    </Form>
    <Form ref="formPassword" :model="formPassword" :rules="rulePassword" :label-width="80" v-if="!is_show">
      <FormItem label="新密码" prop="password">
        <Input type="password" v-model="formPassword.password" placeholder="请输入新密码"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="newpassword">
        <Input type="password" v-model="formPassword.newpassword" placeholder="请再次输入新密码"></Input>
      </FormItem>
      <FormItem>
        <Button class="next_btn" type="primary" @click="handleSubmit('formPassword')">提交</Button>
      </FormItem>
    </Form>
    <div v-if="!is_success" class="success_img">
      <div class="img">
        <img src="../../assets/images/success.png" alt="">
      </div>
      <p>密码修改成功!</p>
      <Button type="primary" @click="handleLogin">返回登陆页面</Button>
    </div>
  </div>
</template>
<script>
import './password.less'
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.formPassword.newpassword !== '') {
          // 对第二个密码框单独验证
          this.$refs.formPassword.validateField('newpassword')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.formPassword.password) {
        callback(new Error('两次输入的密码不同!'))
      } else {
        callback()
      }
    }
    return {
      current: 0,
      formValidate: {
        account: '',
        code: ''
      },
      ruleValidate: {
        account: [
          { required: true, message: '帐户名不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      code_time: null,
      code_text: '获取验证码',
      is_overdue: true,
      is_show: true,
      is_success: true,
      formPassword: {
        password: '',
        newpassword: ''
      },
      rulePassword: {
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newpassword: [
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    get_code () {
      console.log('获取验证码')
      clearInterval(this.code_time)
      let num = 60
      this.code_text = num + '秒后过期'
      this.is_overdue = false
      this.code_time = setInterval(() => {
        if (num > 0) {
          num--
          this.code_text = num + '秒后过期'
        } else {
          this.code_text = '重新获取'
          this.is_overdue = true
        }
      }, 1000)
    },
    handleNext (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
          this.current = 1
          this.is_show = false
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
          this.current = 2
          this.is_show = true
          this.is_success = false
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleLogin () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
