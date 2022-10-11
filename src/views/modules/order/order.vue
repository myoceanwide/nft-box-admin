<template>
  <div class="mod-prod">
    <avue-crud ref="crud" :page.sync="page" :data="dataList" :search.sync="search" :table-loading="dataListLoading" :option="tableOption"
      @search-change="searchChange" @search-reset="resetChange" @on-load="getDataList">
      <template slot="goodsCategoryId" slot-scope="scope">
        <el-tag> {{categoryName(scope.row.goodsCategoryId)}}</el-tag>
      </template>
      <template slot="goodsCategoryIdSearch">
        <el-select v-model="search.goodsCategoryId">
          <el-option v-for="item of categoryList" :key="item.goodsCategoryId" :label="item.categoryName" :value="item.goodsCategoryId"></el-option>
        </el-select>
      </template>
      <template slot="timeSearch">
        <div class="flex-align">
          <el-date-picker v-model="dateRange" type="datetimerange" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button type="primary" icon="el-icon-edit" size="small" v-if="isAuth('admin:order:getById')"
          @click="addOrUpdateHandle(scope.row.orderId, scope.row.orderNumber)">查看</el-button>
      </template>
    </avue-crud>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './orderInfo'
import { tableOption } from '@/crud/order/order'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      dataList: [],
      search: {},
      dataListLoading: false,
      addOrUpdateVisible: false,
      dateRange: [],
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      // 修改
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    }
  },
  components: {
    AddOrUpdate
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
    // 获取数据列表
    getDataList (page, params = this.search) {
      // 这一部操作是为了解决分页查询时，搜索条件不起作用的问题，avue组件的bug，无语了
      for (const key in params) {
        !params[key] && delete params[key]
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/bbOrder/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize,
              orderType: 1
            },
            params
          )
        )
      }).then(({ data }) => {
        this.dataList = data.records
        this.page.total = data.total
        this.dataListLoading = false
      })
    },

    // 新增 / 修改
    addOrUpdateHandle (id, orderNumber) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, orderNumber)
      })
    },
    // 条件查询
    searchChange (params, done) {
      const data = { ...params, startTime: this.dateRange[0], endTime: this.dateRange[1] }
      this.getDataList(this.page, data)
      done()
    },
    resetChange () {
      this.dateRange = []
    }
  }
}
</script>

<style lang="scss" scoped>
.bridge {
  margin: 0 4px;
}
.w60 {
  width: 100px;
}

::v-deep .avue-crud__right {
  button {
    display: none;
  }
}

</style>
