<template>
  <div class="mod-user">
    <avue-crud ref="crud" :page.sync="page" :search.sync="search" :data="dataList" :option="tableOption" @search-change="searchChange"
      @selection-change="selectionChange" @on-load="getDataList">

      <template slot-scope="scope" slot="status">
        <el-tag v-if="scope.row.status === 0" size="small" type="danger">禁用</el-tag>
        <el-tag v-else size="small">正常</el-tag>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button type="primary" icon="el-icon-edit" size="small" v-if="isAuth('admin:appuser:getById')"
          @click.stop="detailHandlder(scope.row.appUserId)">查看</el-button>
      </template>
    </avue-crud>

    <!-- 弹窗, 新增 / 修改 -->
    <UserDetail v-if="detailVisible" ref="detailRef"></UserDetail>
  </div>
</template>

<script>
import { tableOption } from '@/crud/user/user'
import AddOrUpdate from './user-add-or-update'
import UserDetail from './user-detail'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      detailVisible: false,
      search: {},
      tableOption: tableOption,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    }
  },
  components: {
    AddOrUpdate, UserDetail
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
        url: this.$http.adornUrl('/bbAppUser/page'),
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 条件查询
    searchChange (params, done) {
      this.getDataList(this.page, params)
      done()
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    detailHandlder (id) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detailRef.init(id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .avue-crud__right {
  button {
    display: none;
  }
}
</style>
