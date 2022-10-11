<template>
  <div class="mod-prod">
    <avue-crud ref="crud" :page.sync="page" :search.sync="search" :data="dataList" :table-loading="dataListLoading" :option="tableOption"
      @search-change="searchChange" @search-reset="resetChange" @selection-change="selectionChange" @on-load="getDataList">
      <template slot="menuLeft">
        <el-button type="primary" icon="el-icon-plus" size="small" v-if="isAuth('admin:banner:add')"
          @click.stop="addOrUpdateHandle()">新增</el-button>
      </template>
      <template slot="startTimeSearch">
        <el-date-picker v-model="dateTime" type="datetimerange" range-separator="至" value-format="timestamp"
          start-placeholder="开始日期" end-placeholder="结束日期" align="right">
        </el-date-picker>
      </template>

      <template slot-scope="scope" slot="imgUrl">
        <img :src="resourcesUrl + scope.row.imgUrl" width="100" height="100" />
      </template>
      <template slot-scope="scope" slot="position">
        <el-tag>{{positionName(scope.row.position)}}</el-tag>
      </template>
      <template slot-scope="scope" slot="startTime">
        {{timeTransformDate(scope.row.startTime)}}
      </template>
      <template slot-scope="scope" slot="endTime">
        {{timeTransformDate(scope.row.endTime)}}
      </template>
      <template slot-scope="scope" slot="status">
        <el-tag :type="scope.row.status === 0 ? 'danger' : ''">{{statusName(scope.row.status)}}</el-tag>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="primary" icon="el-icon-edit" size="small" v-if="isAuth('admin:banner:updateById')"
          @click="addOrUpdateHandle(scope.row.bannerId)">修改</el-button>

      </template>
    </avue-crud>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './grid-add-or-update'
import { tableOption } from '@/crud/admin/indexImg'
import dayjs from 'dayjs'
import { topBottomLineData, positionData } from '../shop/staticData'
export default {
  data () {
    return {
      dataForm: {
        indexImg: ''
      },
      dateTime: [],
      dataList: [],
      search: {},
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
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
  methods: {
    // 获取数据列表
    getDataList (page, params = this.search) {
      // 这一部操作是为了解决分页查询时，搜索条件不起作用的问题，avue组件的bug，无语了
      for (const key in params) {
        !params[key] && delete params[key]
      }
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/bbBanner/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize,
              positionList: '4,5,6'
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
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.imgId
      })
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/indexImg'),
          method: 'delete',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      })
    },
    // 条件查询
    searchChange (params, done) {
      this.getDataList(this.page, { ...params, startTime: this.dateTime[0], endTime: this.dateTime[1] })
      done()
    },
    resetChange () {
      this.dateTime = []
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    },
    positionName (val) {
      return positionData.find(item => item.value === val).label
    },
    timeTransformDate (time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    statusName (val) {
      return topBottomLineData.find(item => item.value === val).label
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
