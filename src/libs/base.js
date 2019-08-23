export default {
  install (Vue) {
    Vue.prototype.success_msg = function (text) {
      this.$Message.success({
        content: text,
        top: 100
      })
    }
    Vue.prototype.error_msg = function (text) {
      this.$Message.error({
        content: text,
        top: 100
      })
    }
    Vue.prototype.notice_success_msg = function (text) {
      this.$Notice.success({
        title: text
      })
    }
    Vue.prototype.notice_error_msg = function (text) {
      this.$Notice.error({
        title: text
      })
    }
  }
}
