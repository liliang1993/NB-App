import Api from 'api/api'
export default {
  methods : {
    /**
     * 重新更新客户所有信息
    */
    updateUserInfo () {
      Api.getUser().then(res => {
        this.$store.dispatch('updateUserInfo',res.Data);
      });
    }
  }
}