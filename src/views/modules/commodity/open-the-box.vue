<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        comboType: 1,
        openGroup: 1
      },
      detail: {},
      boxId: 0,
      dataRule: {
        comboType: [
          { required: true, message: '请选择开盒类型', trigger: 'change' }
        ],
        openGroup: [
          { required: true, message: '请输入开盒', trigger: 'change' }
        ]
      },
      comboTypes: [
        { label: '一连击', value: 1 },
        { label: '五连击', value: 5 }
      ],
      openDatas: [],
      types: {
        1: '至尊款',
        2: '稀有款',
        3: '惊喜款',
        4: '超值款'
      },
      tableHead: [
        { prop: 'goodsName', label: '商品名称' },
        { prop: 'goodsPrice', label: '商品价格' },
        { prop: 'stock', label: '库存' }
      ]
    }
  },
  methods: {
    init (id) {
      this.boxId = id
      this.visible = true
    },
    confirm () {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return
        const { data } = await this.$http({
          url: this.$http.adornUrl('/bbBox/testOpen'),
          method: 'post',
          data: this.$http.adornData({ ...this.dataForm, boxId: this.boxId })
        })
        this.$message.success('开盒成功')
        const { bbBoxGoodsInfoList, ...other } = data
        this.openDatas = bbBoxGoodsInfoList
        this.detail = other
      })
    }
  }
}
</script>

<template>
  <el-dialog title="测试开盒" :close-on-click-modal="false" :visible.sync="visible" >
    <el-form :model="dataForm" :rules="dataRule" ref="formRef" inline>
      <div class="block">
        <el-form-item prop="comboType" label="开盒类型" class="w50">
          <el-radio-group v-model="dataForm.comboType">
            <el-radio v-for="item of comboTypes" :label="item.value" :key="item.prop">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="openGroup" label="开盒组数" class="w50">
          <el-input v-model="dataForm.openGroup" type="number" class="wauto"></el-input>
        </el-form-item>
      </div>
      <div v-if="openDatas.length">
        <el-form-item label="开盒总数" class="w25">
          <span>{{detail.openCount}}</span>
        </el-form-item>
        <el-form-item label="至尊款数量" class="w25">
          <span>{{detail.oneCount}}</span>
        </el-form-item>
        <el-form-item label="稀有款数量" class="w25">
          <span>{{detail.twoCount}}</span>
        </el-form-item>
        <el-form-item label="惊喜款数量" class="w25">
          <span>{{detail.threeCount}}</span>
        </el-form-item>
        <el-form-item label="超值款数量" class="w25">
          <span>{{detail.fourCount}}</span>
        </el-form-item>
      </div>
      
      <el-table :data="openDatas" max-height="500" :class="[dataForm.comboType === 1 ? 'single' : 'many']">
        <el-table-column prop="goodsType" label="商品类型" align="center">
          <template slot-scope="scope">
            <el-tag>{{ types[scope.row.goodsType] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-for="item of tableHead" :prop="item.prop" :label="item.label" align="center"></el-table-column>
      </el-table>
    </el-form>
    <span slot="footer" class="flex-center">
      <el-button type="primary" @click="confirm">开 盒</el-button>
    </span>
  </el-dialog>
</template>

<style lang='scss' scoped>
.wauto {
  width: auto;
}
.w50 {
  width: 46%;
}
.w25 {
  width: 16%;
  margin: 8px;
}
::v-deep {
  table {
    border-collapse: collapse;
  }
  .el-table {
    
    &.many {
      .el-table__row:nth-of-type(5n) {
        border-bottom: 2px solid #02a0e95b;
      }
    }
    &.single {
      .el-table__row {
        border-bottom: 2px solid #02a0e924;
      }
    }
  }
  
}

.block {
  display: block !important;
}
</style>
