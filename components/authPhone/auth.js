import {
  decryptPhoneNumber,
  bind
} from "./../../api/user";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    control: {
      type: Boolean,
      observer(value) {
        if (value === false) {
          this.setData({
            controlDialog: false
          })
        }
      }
    }
  },

  data: {
    phoneNumber: "",

    controlDialog: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getPhoneNumber: function (e) {
      const {
        errMsg,
        iv,
        encryptedData
      } = e.detail;
      if (errMsg === "getPhoneNumber:ok") {
        this.decryptPhoneNumber(iv, encryptedData)
      }
    },

    // 解密手机号
    decryptPhoneNumber(iv, encryptedData) {
      decryptPhoneNumber({
        iv,
        encryptedData
      }).then(res => {
        if (res.code === 0) {
          const {
            phoneNumber
          } = res.data;
          this.setData({
            controlDialog: true,
            phoneNumber
          })
        }
      })
    },

    // 使用该号码
    handleUseCurrentPhone(e) {
      this.bindPhone()
    },

    // 绑定手机号
    bindPhone() {
      bind(this.data.phoneNumber).then(res => {
        if (res.code === 0) {
          this.triggerEvent("successBindPhone");
        }
      })
    },

    // 其他手机号
    handleUseOtherPhone() {
      // 获取加载的页面
      const pages = getCurrentPages();
      // 当前页面url
      const url = pages[pages.length - 1].route;
      wx.navigateTo({
        url: `/pages/login/login?path=${url}`
      })
    },

    // 关闭
    onClose() {
      this.triggerEvent("cancelBindPhone");
    }
  }
})