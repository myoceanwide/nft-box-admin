<script >
import { mapState } from 'vuex'
import { number } from 'yargs'
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
    allBoxList: {
      type: Array,
      default: () => []
    },
    boxId: {
      type: number,
      default: 0
    }
  },
  data () {
    return {
      dataList: [],
      dialogVisible: false,
      startPrice: '',
      endPrice: '',
      selectTableData: [],
      minGoodsPrice: '',
      maxGoodsPrice: '',
      search: {},
      selectIds: [],
      tableOption: {
        menuAlign: 'center',
        align: 'center',
        selection: true,
        selectionFixed: false,
        menu: false,
        searchMenuSpan: 6,
        selectable: (row) => false,
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
  created () {
    this.$set(this.tableOption, 'selectable', row => !this.selectIds.includes(row.goodsId))
    if (!this.boxId) return
    this.getTypeBoxList()
  },
  watch: {
    allBoxList (newVal) {
      this.selectIds = newVal.map(it => it.goodsId)
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
  methods: {
    selectionChange (data) {
      this.selectTableData = data
    },
    resetChange () {
      this.minGoodsPrice = ''
      this.maxGoodsPrice = ''
    },
    confirm () {
      const result = this.selectTableData.map((it, i) => ({
        goodsId: it.goodsId,
        goodsType: this.getGoodsType(),
        sort: i + 1
      }))
      this.$http({
        url: this.$http.adornUrl('/bbBoxGoods/add'),
        method: 'post',
        data: this.$http.adornData({ list: result, boxId: this.boxId })
      }).then(({ data }) => {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.$emit('boxChange')
        this.getTypeBoxList()
      })
      this.dialogVisible = false
    },
    // 条件查询
    searchChange (params, done) {
      const data = { ...params, minGoodsPrice: this.minGoodsPrice, maxGoodsPrice: this.maxGoodsPrice}
      this.$emit('search', data)
      done()
    },
    getGoodsType () {
      switch (this.title) {
        case '至尊款':
          return 1
        case '稀有款':
          return 2
        case '惊喜款':
          return 3
        case '超值款':
          return 4
      }
    },
    async getTypeBoxList () {
      const { data } = await this.getBoxList({
        boxId: this.boxId,
        goodsType: this.getGoodsType()
      })
      this.dataList = data
    },
    getBoxList (param) {
      return this.$http({
        url: this.$http.adornUrl('/bbBoxGoods/queryListByBoxId'),
        method: 'post',
        data: this.$http.adornData(param)
      })
    },
    addBoxGood () {
      this.dialogVisible = true
      // 动态增加选中
      this.$nextTick(() => {
        const arr = []
        this.tableData.forEach((row) => {
          this.$refs.crudRef.toggleRowSelection(row, this.selectIds.includes(row.goodsId))
          if (this.selectIds.includes(row.goodsId)) {
            arr.push(row)
          }
        })
        this.selectTableData = arr
      })
    },
    dataMove ({ boxGoodsId, sort }, type) {
      const findIndex = this.dataList.findIndex(it => it.boxGoodsId === boxGoodsId)
      const assign = type === 'top' ? findIndex - 1 : findIndex + 1
      const conditionVal = type === 'top' ? -1 : 1
      this.dataList[findIndex].sort += conditionVal
      this.dataList[assign].sort += -conditionVal

      this.$http({
        url: this.$http.adornUrl('/bbBoxGoods/move'),
        method: 'post',
        data: this.$http.adornData({
          list: this.dataList.map(it => ({ boxGoodsId: it.boxGoodsId, sort: it.sort }))
        })
      }).then(({ data }) => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.getTypeBoxList()
      })
    },
    removeBoxGood (id) {
      this.$confirm('确定删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/bbBoxGoods/deleteById'),
          method: 'post',
          data: this.$http.adornData({ id })
        }).then(({ data }) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.$emit('boxChange')
          this.getTypeBoxList()
        })
      })
    }
  }
}
</script>

<template>
  <div>
    <el-form class="card" inline ref="boxCard">
      <el-card class="box-card">
        <div class="flex-align content-between title">
          <el-form-item label="盲盒商品">
            <span>{{ title }}</span>
          </el-form-item>

          <el-button type="primary" :disabled="!boxId" size="small" @click="addBoxGood">添加</el-button>
        </div>
        <el-table :data="dataList">
          <el-table-column type="index" label="序号">
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称">
          </el-table-column>
          <el-table-column prop="goodsPrice" label="商品价格">
          </el-table-column>
          <el-table-column prop="stock" label="库存">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button class="elbtn" @click="dataMove(scope.row, 'top')" v-show="scope.$index !== 0" size="mini && isAuth('admin:boxgoods:move')" type="primary">上移</el-button>
              <el-button class="elbtn" @click="dataMove(scope.row, 'down')" v-show="scope.$index !== dataList.length - 1 && isAuth('admin:boxgoods:move')" size="mini" type="primary">下移</el-button>
              <el-button class="elbtn" v-if="isAuth('admin:boxgoods:deleteById')" @click="removeBoxGood(scope.row.boxGoodsId)" size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-form>
    <el-Dialog :visible.sync="dialogVisible" title="添加商品" class="dialog">

      <avue-crud :data="tableData" :option="tableOption" :search.sync="search" @search-change="searchChange" ref="crudRef"
        @search-reset="resetChange" @selection-change="selectionChange">

        <template slot="goodsCategoryIdSearch">
          <el-select v-model="search.goodsCategoryId">
            <el-option v-for="item of categoryList" :key="item.goodsCategoryId" :label="item.categoryName" :value="item.goodsCategoryId"></el-option>
          </el-select>
        </template>
        <template slot="goodsPriceSearch">
          <div class="flex-align">
            <el-input v-model="minGoodsPrice" type="number" class="w100"></el-input> <span class="bridge">-</span>
            <el-input v-model="maxGoodsPrice" type="number" class="w100"></el-input>
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
  padding: 0 40px;
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
.w100 {
  width: 120px;
}
.dialog {
  ::v-deep .el-dialog {
    width: 75%;
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
