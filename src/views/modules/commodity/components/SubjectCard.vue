<script >
import { mapState } from 'vuex'
export default {
  props: {
    title: {
      type: String,
      default: '至尊款'
    },
    tableData: {
      type: Array,
      default: () => []
    },
    goodsList: {
      type: Array,
      default: () => []
    },
    boxId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      search: {},
      selectIds: [],
      minGoodsPrice: '',
      maxGoodsPrice: '',
      dialogVisible: false,
      startPrice: '',
      endPrice: '',
      selectTableData: [],
      tableOption: {
        menuAlign: 'center',
        align: 'center',
        selection: true,
        selectionFixed: false,
        menu: false,
        searchMenuSpan: 6,
        column: [
          { label: '商品名', prop: 'goodsName', search: true },
          { label: '商品价格', prop: 'goodsPrice', search: true },
          { label: '商品库存', prop: 'stock' },
          { label: '商品分类',
            prop: 'goodsCategoryId',
            search: true,
            type: 'select'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState('globalData', ['categoryList']),
    categoryName () {
      return (id) => {
        const result = this.categoryList.find(it => it.goodsCategoryId === id)
        if (!result) return ''
        return result.categoryName
      }
    }
  },
  created () {
    // 增加选择禁用的
    this.$set(this.tableOption, 'selectable', row => !this.selectIds.includes(row.goodsId))
  },
  watch: {
    goodsList (newVal) {
      this.selectIds = newVal.map(it => it.goodsId)
    }
  },
  methods: {
    // 条件查询
    searchChange (params, done) {
      const data = { ...params, minGoodsPrice: this.minGoodsPrice, maxGoodsPrice: this.maxGoodsPrice}
      this.$emit('search', data)
      done()
    },
    addBoxGood () {
      this.dialogVisible = true
      this.$nextTick(() => {
        const arr = []
        console.log(this.selectIds)
        this.tableData.forEach((row) => {
          this.$refs.crudRef.toggleRowSelection(row, this.selectIds.includes(row.goodsId))
          if (this.selectIds.includes(row.goodsId)) {
            arr.push(row)
          }
        })
        this.selectTableData = arr
      })
    },
    selectionChange (data) {
      this.selectTableData = data
    },
    resetChange () {
      this.minGoodsPrice = ''
      this.maxGoodsPrice = ''
    },
    removeBoxGood (id) {
      this.$confirm('确定删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/bbTopicGoods/deleteById'),
          method: 'post',
          data: this.$http.adornData({ id })
        }).then(({ data }) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.$emit('boxChange')
        })
      })
    },
    confirm () {
      const result = this.selectTableData.map((it, index) => ({
        goodsId: it.goodsId,
        sort: index + 1
      }))
      this.$http({
        url: this.$http.adornUrl('/bbTopicGoods/add'),
        method: 'post',
        data: this.$http.adornData({ list: result, topicId: this.boxId})
      }).then(({ data }) => {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.$emit('boxChange')
      })
      this.dialogVisible = false
    },
    dataMove ({ topicGoodsId, sort }, type) {
      const findIndex = this.goodsList.findIndex(it => it.topicGoodsId === topicGoodsId)
      const assign = type === 'top' ? findIndex - 1 : findIndex + 1
      const conditionVal = type === 'top' ? -1 : 1
      this.goodsList[findIndex].sort += conditionVal
      this.goodsList[assign].sort += -conditionVal

      this.$http({
        url: this.$http.adornUrl('/bbTopicGoods/move'),
        method: 'post',
        data: this.$http.adornData({
          list: this.goodsList.map(it => ({ topicGoodsId: it.topicGoodsId, sort: it.sort }))
        })
      }).then(({ data }) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.$emit('boxChange')
      })
    }
  }
}
</script>

<template>
  <div>
    
    <el-card class="box-card card">
      <div class="flex-align content-between title">
        <el-button type="primary" size="small" :disabled="!boxId" @click="addBoxGood">添加</el-button>
      </div>
      <el-table :data="goodsList" align="center">
        <el-table-column prop="goodsName" label="商品前端展示名称">
        </el-table-column>
        <el-table-column prop="goodsPrice" label="商品价格">
        </el-table-column>
        <el-table-column prop="stock" label="商品库存"></el-table-column>
        <el-table-column prop="goodsCategoryId" label="商品品类">
          <template slot-scope="scope">
            {{ categoryName(scope.row.goodsCategoryId) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" class="elbtn" @click="dataMove(scope.row, 'top')" v-show="scope.$index !== 0" type="primary">上移</el-button>
            <el-button size="mini" class="elbtn" @click="dataMove(scope.row, 'down')" v-show="scope.$index !== goodsList.length - 1" type="primary">下移</el-button>
            <el-button size="mini" class="elbtn" @click="removeBoxGood(scope.row.topicGoodsId)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-Dialog :visible.sync="dialogVisible" title="添加商品" class="dialog">

      <avue-crud :data="tableData" :option="tableOption" :search.sync="search" ref="crudRef" @search-change="searchChange"
        @search-reset="resetChange" @selection-change="selectionChange">
        <template slot="goodsCategoryIdSearch">
          <el-select v-model="search.goodsCategoryId">
            <el-option v-for="item of categoryList" :key="item.goodsCategoryId" :label="item.categoryName" :value="item.goodsCategoryId"></el-option>
          </el-select>
        </template>
        <template slot="goodsPriceSearch">
          <div class="flex-align">
            <el-input v-model="minGoodsPrice" type="number" class="w80"></el-input> <span class="bridge">-</span>
            <el-input v-model="maxGoodsPrice" type="number" class="w80"></el-input>
          </div>
        </template>
        <template slot="goodsCategoryId" slot-scope="scope">
          <el-tag> {{categoryName(scope.row.goodsCategoryId)}}</el-tag>
        </template>
      </avue-crud>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-Dialog>
  </div>

</template>

<style lang='scss' scoped>
.card {
  margin: 0 40px;
}
::v-deep .avue-crud__menu {
  display: none;
}
::v-deep .el-form-item {
  margin-bottom: 0;
}
.bridge {
  margin: 0 4px;
}
.title {
  margin-bottom: 20px;
}
.w80 {
  width: 80px;
}
.dialog {
  ::v-deep .el-dialog {
    width: 60%;
  }
  ::v-deep .el-table__body-wrapper {
    height: 500px;
    overflow-y: scroll;
  }
}
.elbtn {
  margin-left: 0 !important;
  margin-right: 10px;
}
</style>
