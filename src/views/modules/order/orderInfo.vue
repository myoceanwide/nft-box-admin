<template>
  <el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible"
    width="80%">
    <el-form :model="dataForm" ref="dataForm" inline label-width="140px">
      <div class="main">
        <div class="content">
          <div class="order-number">
            <div class="num-cont flex flex-wrap">
              <el-form-item label="用户手机号码:" class="flex50">
                <span class="text">{{ detail.phoneNumber }}</span>
              </el-form-item>
              <el-form-item label="订单编号:" class="flex50">
                <span class="text">{{ detail.orderNumber }}</span>
              </el-form-item>
              <el-form-item label="订单状态:" class="flex50">
                <span class="text">{{ orderStatus[detail.orderStatus] }}</span>
              </el-form-item>
              <el-form-item label="订单类型:" class="flex50">
                <span class="text">{{ detail.orderType === 0 ? '盲盒' : '自营' }}</span>
              </el-form-item>
              <el-form-item label="下单时间:" class="flex50">
                <span class="text">{{ detail.addTime }}</span>
              </el-form-item>
              <el-form-item label="订单名称:" class="flex50">
                <span class="text">{{ detail.itemName }}</span>
              </el-form-item>
              <el-form-item label="订单金额:" class="flex50">
                <span class="text">{{ detail.goodsPrice }}</span>
              </el-form-item>
              <el-form-item label="福利币抵扣金额:" class="flex50">
                <span class="text">{{ detail.payStarCoin }}</span>
              </el-form-item>
              <el-form-item label="余额抵扣金额:" class="flex50">
                <span class="text">{{ detail.payAccountAmount }}</span>
              </el-form-item>
              <el-form-item label="用户实际付款金额:" class="flex50">
                <span class="text">{{ detail.payAmount }}</span>
              </el-form-item>
            </div>
          </div>
          <div class="order-state">
            <div class="state-cont">
              <div class="item-list" v-if="isAuth('admin:ordergoods:queryListByOrderId')">
                <el-table :data="orderList" border max-height="300">
                  <el-table-column prop="goodsCount" label="数量" align="center">
                  </el-table-column>
                  <el-table-column prop="goodsName" label="奖品" align="center">
                  </el-table-column>
                  <el-table-column prop="goodsStatus" label="奖品状态" align="center">
                    <template slot-scope="scope">
                      <span>{{ getGoodsState(scope.row.goodsStatus) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="reSellPrice" label="转卖金额" align="center">
                  </el-table-column>
                </el-table>
              </div>
              <div class="flex content-between mt20">
                <el-form v-if="isAuth('admin:order:refund')" :model="refundForm" :inline="true" :rules="refundRule" style="width: 100%;" class="flex-align content-between">
                  <el-form-item label="实付款退款" prop="refundAmount" class="flex">
                    <div class="flex-align">
                      <el-input v-model="refundForm.refundAmount" class="handlerInput" placeholder="实付款退款" clearable></el-input>
                      <el-button type="danger" size="small" @click="refundMoney('refundAmount')">退款</el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="余额退款" prop="refundAccountAmount">
                    <div class="flex-align">
                      <el-input v-model="refundForm.refundAccountAmount" class="handlerInput" placeholder="余额退款" clearable></el-input>
                      <el-button type="danger" size="small" @click="refundMoney('refundAccountAmount')">退余额</el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <div class="item-list" v-if="isAuth('admin:order:queryRefundList')">
                <el-table :data="refundList" border max-height="300">
                  <el-table-column prop="refundNumber" label="退款单号" align="center"></el-table-column>
                  <el-table-column prop="refundAccountAmount" label="退款账户金额" align="center"></el-table-column>
                  <el-table-column prop="refundAmount" label="退款账户金额" align="center"></el-table-column>
                  <el-table-column prop="refundStatus" label="退款状态" align="center">
                    <template slot-scope="scope">
                      <el-tag :type="scope.row.refundStatus === 3 ? 'danger': ''">{{ refundStatus[scope.row.refundStatus] }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="refundTime" label="退款时间" align="center"></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="flex-center">
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data () {
    return {
      visible: false,
      orderNumber: 0,
      dataForm: {},
      refundForm: {
        refundAmount: '',
        refundAccountAmount: ''
      },
      orderList: [],
      refundList: [],
      orderStatus: {
        1: '待付款',
        2: '待发货',
        3: '已发货',
        4: '已完成',
        5: '退款',
        6: '失败'
      },
      refundStatus: {
        1: '退款中',
        2: '退款成功',
        3: '退款失败'
      },
      detail: {},
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      refundRule: {
        refundAmount: [
          { required: true, message: '实付款退款不能为空', trigger: 'blur' }
        ],
        refundAccountAmount: [
          { required: true, message: '余额退款不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id, orderNumber) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.orderNumber = orderNumber
      if (!id) return
      this.getDetail(id)
      this.getOrderList(id)
      this.getRefundList()
    },
    getDetail (id) {
      this.$http({
        url: this.$http.adornUrl(`/bbOrder/getById`),
        method: 'post',
        data: this.$http.adornData({ id })
      }).then(({ data }) => {
        this.detail = data
      })
    },
    getOrderList (id) {
      this.$http({
        url: this.$http.adornUrl(`/bbOrderGoods/queryListByOrderId`),
        method: 'post',
        data: this.$http.adornData({ id })
      }).then(({ data }) => {
        this.orderList = data
      })
    },
    getGoodsState (key) {
      const strategy = {
        1: '已转卖',
        2: '待提货',
        3: '已提货',
        4: '待发货',
        5: '已发货'
      }
      return strategy[key]
    },
    getRefundList () {
      this.$http({
        url: this.$http.adornUrl(`/bbOrder/queryRefundList`),
        method: 'post',
        data: this.$http.adornData({ orderNumber: this.orderNumber })
      }).then(({ data }) => {
        this.refundList = data.map(it => {
          it.refundTime = dayjs(it.refundTime).format('YYYY-MM-DD HH:mm:ss')
          return it
        })
      })
    },
    refundMoney (type) {
      if (!this.refundForm[type] || +this.refundForm[type] === 0) {
        this.$message({
          message: '请输入退款金额',
          type: 'warning'
        })
        return
      }
      this.$http({
        url: this.$http.adornUrl(`/bbOrder/refund`),
        method: 'post',
        data: this.$http.adornData({
          orderNumber: this.orderNumber,
          [type]: this.refundForm[type]
        })
      }).then(({ data }) => {
        this.refundForm[type] = ''
        this.$message.success('退款成功')
        this.getRefundList()
      })
    }
  }
}
</script>


<style>
.main {
  height: 100%;
  width: 100%;
  font: 14px Arial, "PingFang SC", "Hiragino Sans GB", STHeiti,
    "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  color: #495060;
}
.flex50  {
  flex: 0 0 49%;
}
.mt20 {
  margin-top: 40px;
}
.handlerInput {
  margin: 0 20px 0 0;
}
.content {
  margin: 0 20px;
}

.content .steps {
  margin-top: 50px;
}

.order-number .number-text {
  font-weight: bold;
}

.order-number .text {
  font-size: 14px;
  color: #8a8a8a;
}

.order-state .state-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-left span {
  font-weight: bold;
}

.title-left .text {
  color: red;
}

.state-title .title-mid {
  display: flex;
  align-items: center;
}

.title-mid img {
  width: 18px;
  height: 18px;
}

.title-mid .mid-text {
  color: red;
}

.title-mid .text {
  color: #8a8a8a;
}

.content .order-state {
  position: relative;
  /* margin-top: 50px; */
  border-bottom: 1px solid #e9eaec;
}

.order-state .order-info {
  width: 100%;
  border-top: 1px solid #e9eaec;
  margin: 50px 0;
  display: flex;
}

.order-info img {
  width: 18px !important;
  height: 18px !important;
  margin-right: 15px;
}

.order-info .detail-title {
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
}

.order-info .order-details {
  width: 50%;
  border-right: 1px solid #e9eaec;
}

.order-info .detail-cont {
  position: relative;
}

.detail-cont .detail01 {
  display: flex;
  height: 100%;
  line-height: 25px;
  margin-top: 15px;
}

.detail01 .text-width {
  width: 100%;
}

.detail02 .text-width {
  width: 100%;
}

.detail-cont .revise-addr {
  color: #4395ff;
  position: absolute;
  top: 15px;
  right: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.order-info .detail-cont {
  border-top: 1px dashed #e9eaec;
  margin: 15px 20px 0 0;
}

.order-info .buyers {
  width: 50%;
  margin-left: 20px;
}

.buyers .buyers-info {
  border-top: 1px dashed #e9eaec;
  margin-top: 15px;
  position: relative;
}

.buyers .detail02 {
  display: flex;
  height: 100%;
  line-height: 25px;
  margin-top: 15px;
}

.buyers .revise-remarks {
  color: #4395ff;
  position: absolute;
  top: 15px;
  right: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.order-state .item-info {
  padding-left: 80%;
  margin: 25px 0;
}

.item-info span {
  margin-bottom: 15px;
  line-height: 30px;
}

.item-info .text {
  /* position: absolute;
  right: 0; */
}

.item-info .amount {
  font-size: 18px;
  color: red;
}

.order-log .log-title {
  height: 50px;
  width: 100%;
  line-height: 50px;
  font-weight: bold;
  /* border-bottom: 1px dashed #e9eaec; */
}

.order-log .log-cont {
  /* margin-top: 15px; */
  color: #4395ff;
}

.order-log .log-cont .el-form-item__content {
  line-height: 1.5em;
}

.item-list .prod-con {
  display: flex;
}

.item-list .prod-con .prod-img {
  width: 100px;
  height: 100px;
  margin-right: 8px;
}

</style>



