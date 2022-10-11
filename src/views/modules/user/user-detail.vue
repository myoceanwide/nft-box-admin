<script>
export default {
  data () {
    return {
      visible: false,
      refundVisible: false,
      reg: /^\d+(\.\d{1,2})?$/,
      refundMoney: '',
      detail: {},
      address: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 5 // 每页显示多少条
      },
      tableHead: [
        { label: '变动名称', prop: 'itemName' },
        { label: '变动额度', prop: 'amount' },
        { label: '变动时间', prop: 'addTime' }
      ],
      accountTypes: {
        0: '余额',
        1: '星球币'
      },
      flowTypes: {
        0: '购买盒子',
        1: '购买商品',
        2: '转卖',
        3: '运费',
        4: '退货',
        5: '自动过期'
      },
      tableData: [
        // {
        //   date: '2016-05-02',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }
      ]
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.getUserRunWater(id)
      this.getUserAddress(id)
      this.$http({
        url: this.$http.adornUrl('/bbAppUser/getById'),
        method: 'post',
        data: this.$http.adornData({ id: id })
      }).then(({ data }) => {
        this.detail = data
      })
    },
    getUserRunWater (id) {
      this.$http({
        url: this.$http.adornUrl('/bbUserAccountFlow/page'),
        method: 'get',
        params: this.$http.adornParams({ appUserId: id, current: this.page.currentPage, size: this.page.pageSize })
      }).then(({ data }) => {
        this.tableData = data.records
        this.page.total = data.total
      })
    },
    getUserAddress (id) {
      this.$http({
        url: this.$http.adornUrl('/bbUserAddress/queryList'),
        method: 'post',
        data: this.$http.adornData({ id: id })
      }).then(({ data }) => {
        this.address = data
      })
    },
    refundInput (val) {
      if ((!this.reg.test(val) && val !== '') || val > this.detail.accountAmount) return
      this.refundMoney = val
    },
    refund () {
      if (!this.refundMoney) {
        this.$message({
          message: '请输入退款金额',
          type: 'warning'
        })
        return
      }
      this.$confirm(`您即将为用户退款${this.refundMoney}元`, '提示', {
        confirmButtonText: '确认退款',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退款成功!'
        })
        this.refundVisible = false
      })
    },
    pageChange (page) {
      this.page.currentPage = page
      this.getUserRunWater(this.detail.appUserId)
    }
  }
}
</script>

<template>
<div>
  
  <el-dialog title="用户详细信息" :close-on-click-modal="false" :visible.sync="visible">
    <el-form inline label-width="150px">
      <el-form-item label="用户手机号码 ">
        <el-input readonly :value="detail.phoneNumber" class="h30"></el-input>
      </el-form-item>
      <el-form-item label="用户注册时间 " class="">
        <el-input readonly :value="detail.addTime"></el-input>
      </el-form-item>
      <el-form-item label="用户现金余额 " class="">
        <el-input readonly :value="detail.accountAmount"></el-input>
      </el-form-item>
      <el-form-item label="用户福利币余额 " class="">
        <el-input readonly :value="detail.starCoin"></el-input>
      </el-form-item>
      <el-form-item label="用户收货信息" class="">
        <div class="flex flex-col">
          <el-input readonly v-for="(item, i) of address" :key="i" :value="item.address" class="mb10"></el-input>
          <span v-if="!address.length">-</span>
        </div>
      </el-form-item>
      <!-- <el-form-item label="用户实际消费总金额" class="block">
        <div class="flex-align">
          <el-input readonly :value="detail.payAmount"></el-input>
          <el-button v-if="isAuth('admin:user:refund')" type="danger" class="ml20" size="small" @click="refundVisible = true">退款</el-button>
        </div>
      </el-form-item> -->
      <div class="block">
        <div class="wtitle">用户账户变动明细 </div>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="accountType" label="账户类型" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.accountType === 1 ? 'info' : ''">{{accountTypes[scope.row.accountType]}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="flowType" label="账户类型" align="center">
            <template slot-scope="scope">
              <el-tag type="success">{{flowTypes[scope.row.flowType]}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column  align="center" v-for="item of tableHead" :key="item.label" :prop="item.prop" :label="item.label">
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          v-if="page.total > page.pageSize"
          @current-change="pageChange"
          :total="page.total">
        </el-pagination>
      </div>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false" type="primary">取 消</el-button>
    </div>

    
  </el-dialog>

  <el-dialog :visible.sync="refundVisible" title="退款操作" :close-on-click-modal="false" class="childrenDialog">
    <p>您即将为用户进行退款操作，用户账户目前实际余额为{{detail.accountAmount}}元</p>
    <div>您要为用户退款的金额为
      <el-input :value="refundMoney"  @input="refundInput" type="number" placeholder="请输入退款金额" class="w200"></el-input>
    </div>
    <div slot="footer" class="dialog-footer flex-center">
      <el-button @click="refund" type="danger">退 款</el-button>
      <el-button @click="refundVisible = false" type="primary">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<style lang='scss' scoped>
.ml {
  margin-left: 10vw
}

.ml20 {
  margin-left: 20px;
}

.mb10 {
  margin-bottom: 10px
}
.w200 {
  width: 200px;
}
.wtitle {
  width: 150px;
  text-align: right;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
}
span {
  color: #8a8a8a;
  font-size: 14px
}

.block {
  display: block
}
.childrenDialog {
  ::v-deep .el-dialog {
    width: 30%;
  }
}
.pagination {
  margin-top: 20px;
}
</style>
