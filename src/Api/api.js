import http from '../utils/ajax.js'
console.log('http', http);
export default {
  register(params) {
      return http.post('/v1/account/register', params)
    },
    login(params) {
      return http.post('/v1/account/login', params)
    },
    logout() {
      return http.post('/v1/account/logout', "", true)
    },
    resetPassword(params) {
      return http.post('/v1/account/resetpassword', params)
    },
    updatePassword(params) {
      return http.post('/v1/account/updatepassword', params, true);
    },
    getUser() {
      return http.post('/v1/account/detail', "", true)
    },
    getArticleList(params) {
      return http.post('/v1/cms/articles', params)
    },
    getArticleDetails(url, params) {
      return http.post(url, params);
    },
    getMenusList() {
      return http.post('/v1/cms/menus/list', "");
    },
    sendSMS(params) {
      return http.post('/v1/message/send_sms_capcha', params)
    },
    CheckSmsVerifyCode(params) {
      return http.post('/v1/message/check_sms_capcha', params)
    },
    bindBankCard(params) {
      return http.post('/v1/account/updatebankcard', params, true);
    },
    getBankCard() {
      return http.post('/v1/account/getbankcard', "", true);
    },
    getBalance() {
      return http.post('/v1/account/balance', "", true);
    },
    getDepositList(params) {
      return http.post('/v1/deposits', params, true);
    },
    getDepositChannels() {
      return http.post('/v1/deposit/channels',"", true);
    },
    getDepositBanks(params) {
      return http.post('/v1/deposit/banks',params, true);
    },
    getDepositApply(params){
      return http.post('/v1/deposit/apply',params, true);
    },
    getWithdrawList(params) {
      return http.post('/v1/withdraws', params, true);
    },
    getOrderDetail(type, id) {
      return http.post(`/v1/${type}/detail/${id}`, "", true);
    },
    applyWithdraw(params) {
      return http.post('/v1/withdraw/apply', params, true);
    },
    getFinanceNews(params) {
      return http.post('/v1/financenews', params);
    },
    getConfigInfoList() {
      return http.post('/v1/customerconfiginfos', "", true);
    },
    getConfigInfoDetail(params) {
      return http.post('/v1/CustomerConfigInfo/detail', params, true);
    },
    applyConfitInfo(params) {
      return http.post('/v1/CustomerConfigInfo/apply', params, true);
    },
    updateConfigInfo(params) {
      return http.post('/v1/customerconfiginfo/update', params, true);
    },
    updateBatchConfigInfo(params) {
      return http.post('/v1/customerconfiginfo/batchupdate', params, true);
    },
    uploadIdCard(params) {
      return http.post('/v1/file/upload_idcard_images', params, true);
    },
    setIdcardRecord(params) {
      return http.post('/v1/file/bind_idcard_images', params, true);
    },
    setIdcardauth(params) {
      return http.post('/v1/account/idcardauth', params, true);
    },
    getIdCard(params) {
      return http.post('/v1/file/get_idcard_images', params, true);
    },
    getLatestVersion(){
      return http.post('/v1/version/latest', "");  
    }
}
