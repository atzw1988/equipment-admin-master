<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        console.log(res)
        if (res.data.data) {
          this.$router.push({
            name: this.$config.homeName
          })
          this.$Notice.success({
            title: '登陆成功',
            desc: '欢迎回来'
          })
          this.getUserInfo().then(res => {
            console.log(res)
          })
        } else {
          this.$Message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style>

</style>
