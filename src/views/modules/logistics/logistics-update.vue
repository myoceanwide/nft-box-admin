<script>
export default {
  data () {
    return {
      visible: false,
      id: 0,
      radio: '1',
      userPhone: '',
      goodsList: [],
      address: {},
      dataForm: {
        logisticsCompany: '',
        logisticsNumber: '',
        takeStatus: 4,
        takeRemarks: ''
      },
      dataRule: {
        logisticsCompany: [
          { required: true, message: '请输入物流公司', trigger: 'blur' }
        ],
        logisticsNumber: [
          { required: true, message: '请输入物流单号', trigger: 'blur' }
        ]
      },
      tableHead: [
        { label: '商品名称', prop: 'goodsName' },
        { label: '关联订单号码', prop: 'orderNumber' },
        { label: '购买建议地址', prop: 'buyUrl' }
        // { label: '1688订单号', prop: 'outOrderNumber' },
        // { label: '1688订单备注', prop: 'orderRemarks' }
      ]
    }
  },
  computed: {
    addressName () {
      return `${this.address.province} ${this.address.city} ${this.address.area} ${this.address.address}`
    }
  },
  methods: {
    init ({ takeDeliveryId, phoneNumber, userAddressId, appUserId, ...other }) {
      this.visible = true
      this.userPhone = phoneNumber
      this.id = takeDeliveryId

      for (const key in this.dataForm) {
        this.dataForm[key] = other[key]
      }

      this.getDetail(takeDeliveryId)
      this.getAddress(appUserId, userAddressId)
    },
    getDetail (id) {
      this.$http({
        url: this.$http.adornUrl('/bbTakeDeliveryDetail/queryListByTakeDeliveryId'),
        method: 'post',
        data: this.$http.adornData({ id })
      }).then(({ data }) => {
        this.goodsList = data
      })
    },
    getAddress (id, targetId) {
      this.$http({
        url: this.$http.adornUrl('/bbUserAddress/queryList'),
        method: 'post',
        data: this.$http.adornData({ id })
      }).then(({ data }) => {
        this.address = data.find(it => it.userAddressId === targetId)
      })
    },
    confirm () {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return
        this.updateLogistics()
        this.updateGoodsInfo()
      })
    },
    updateLogistics () {
      this.$http({
        url: this.$http.adornUrl('/bbTakeDelivery/updateById'),
        method: 'post',
        data: this.$http.adornData({ ...this.dataForm, takeDeliveryId: this.id })
      }).then(({ data }) => {
        this.$emit('updateChange')
        this.$message({
          type: 'success',
          message: '更新成功!'
        })
        this.visible = false
      })
    },
    updateGoodsInfo () {
      this.goodsList.forEach(item => {
        this.$http({
          url: this.$http.adornUrl('/bbTakeDeliveryDetail/updateById'),
          method: 'post',
          data: this.$http.adornData({ takeDeliveryDetailId: item.takeDeliveryDetailId, outOrderNumber: item.outOrderNumber, orderRemarks: item.orderRemarks })
        })
      })
    }
  }
}
</script>

<template>
  <div>

    <el-dialog title="修改物流信息" :close-on-click-modal="false" :visible.sync="visible">
      <el-form inline label-width="150px" ref="formRef" :model="dataForm" :rules="dataRule">
        <el-form-item label="用户手机号码:" class="block">
          <el-input :value="userPhone" class="h30"></el-input>
        </el-form-item>
        <el-form-item label="地址信息:" class="block">
          <div class="flex flex-col">
            <el-input :value="addressName" class="mb10"></el-input>
            <el-input :value="address.receiver" class="mb10"></el-input>
            <el-input :value="address.mobile" class="mb10"></el-input>
          </div>
        </el-form-item>
        <div class="block table">
          <el-table :data="goodsList">
            <el-table-column v-for="item of tableHead" :key="item.prop" :label="item.label" :prop="item.prop" width="180" show-overflow-tooltip align="center">
            </el-table-column>
            <el-table-column label="1688订单号" align="center">
              <template slot-scope="scope">
                <el-input class="wauto" v-model="scope.row.outOrderNumber" ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="1688订单备注" align="center">
              <template slot-scope="scope">
                <el-input class="wauto" v-model="scope.row.orderRemarks"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="物流公司:" class="block" prop="logisticsCompany">
          <el-input v-model="dataForm.logisticsCompany" placeholder="请输入物流公司" class="h30"></el-input>
        </el-form-item>
        <el-form-item label="物流编号:" class="block" prop="logisticsNumber">
          <el-input v-model="dataForm.logisticsNumber" placeholder="请输入物流编号" class="h30"></el-input>
        </el-form-item>
        <el-form-item label="备注:" class="block" prop="takeRemarks">
          <el-input v-model="dataForm.takeRemarks" placeholder="请输入备注" class="h30"></el-input>
        </el-form-item>
        <el-form-item label="物流状态:" class="block">
          <el-radio-group v-model="dataForm.takeStatus">
            <el-radio :label="4">已发货</el-radio>
            <el-radio :label="3">待发货</el-radio>
          </el-radio-group>

        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer flex-center">
        <el-button @click="confirm" type="primary">保 存</el-button>
        <el-button @click="visible = false">取 消</el-button>
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
.wauto {
  width: auto !important;
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

::v-deep .el-input {
  width: 24vw;
}

.table {
  width: 100%;
  margin-bottom: 20px;
}
</style>
