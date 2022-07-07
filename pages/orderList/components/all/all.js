import http from "./../../../../utils/http";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: Number,
      value: "",
      observer(newVal, oldVal) {
        if (newVal === 0) {
          // console.log("请求全部")
          this.handleReset();
          this.getOrderList();
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusCode: "",
    pageNum: 1,
    pageSize: 10,
    list: [],
    // 是否还有下一页
    nextPage: true,
    ExchangeType:1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getOrderList(callback) {
      const {  pageNum, pageSize, nextPage,ExchangeType } = this.data;
      if (!nextPage) return;
      const data = {
         pageNum, pageSize,ExchangeType
      }
      http("get", `/Order/getAlreadyBuyOrderList`, data).then(res => {
        if (res.code === 0) {
          const { list, totalCount } = res.data.orders;
          this.setData({
            list: [...this.data.list, ...list],
          })
          callback && callback();
          this.data.pageNum++;
          if (this.data.list.length === totalCount) {
            this.setData({
              nextPage: false
            })
          }
        }
      })
    },

    handleReset() {
      this.setData({
        pageNum: 1,
        list: [],
        nextPage: true,
      })
    },

    // 刷新订单列表
    handleRefreshOrderList() {
      this.handleReset();
      this.getOrderList();
    }
  }
})
