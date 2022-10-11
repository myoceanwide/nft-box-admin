<script>
import { tableOption } from '@/crud/logistics/logistics'
import LogisticsUpdate from './logistics-update.vue'
export default {
  data () {
    return {
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10 // 每页显示多少条
      },
      search: {},
      tableOption: tableOption,
      dataList: []
    }
  },
  components: { LogisticsUpdate },
  methods: {
    // 获取数据列表
    getDataList (page, params = this.search) {
      // 这一部操作是为了解决分页查询时，搜索条件不起作用的问题，avue组件的bug，无语了
      for (const key in params) {
        !params[key] && delete params[key]
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/bbTakeDelivery/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize
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
    // 条件查询
    searchChange (params, done) {
      this.getDataList(this.page, params)
      done()
    },
        // 多选变化
    selectionChange (val) {
      console.log(val)
    },
    updateHandler (row) {
      this.$nextTick(() => {
        this.$refs.updateRef.init(row)
      })
    },
    async updateChange () {
      this.getDataList()
    }
  }
}
</script>

<template>
  <div> 
    <avue-crud ref="crud" :page.sync="page" :search.sync="search" :data="dataList" :option="tableOption" @search-change="searchChange"
    @selection-change="selectionChange" @on-load="getDataList">

      <template slot-scope="scope" slot="takeStatus">
        <el-tag :type="scope.row.takeStatus === 3 ? 'warning' : '' ">{{ scope.row.takeStatus === 3 ? '待发货' : '已发货' }}</el-tag>
      </template>

      <template slot-scope="scope" slot="status">
        <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
        <el-tag v-else size="small">正常</el-tag>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button type="primary" icon="el-icon-edit" size="small" v-if="isAuth('admin:takedelivery:updateById')"
          @click.stop="updateHandler(scope.row)">修改</el-button>
      </template>
      
    </avue-crud>
    <LogisticsUpdate ref="updateRef" @updateChange="updateChange"></LogisticsUpdate>
  </div>
  

</template>

<style lang="scss" scoped>
::v-deep .avue-crud__right {
  button {
    display: none;
  }
}
</style>

