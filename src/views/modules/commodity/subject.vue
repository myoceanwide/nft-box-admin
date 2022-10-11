<template>
  <div class="mod-prod">
    <avue-crud ref="crud" :page.sync="page" :search.sync="search" :data="dataList" :table-loading="dataListLoading" :option="tableOption"
      @search-change="searchChange" @selection-change="selectionChange" @on-load="getDataList">
      <template slot="menuLeft">
        <el-button type="primary" icon="el-icon-plus" size="small" v-if="isAuth('admin:topicgoods:add')"
          @click.stop="addOrUpdateHandle()">新增</el-button>
      </template>
      <template slot="status" slot-scope="scope">
        <el-tag :type="scope.row.status === 0 ? 'warning' : ''"> {{ statusName(scope.row.status) }}</el-tag>
      </template>
      <template slot-scope="scope" slot="menu">
        
        <el-button type="primary" icon="el-icon-edit" size="small" v-if="isAuth('admin:topic:updateById')"
          @click="addOrUpdateHandle(scope.row.topicId)">修改</el-button>
        <el-button type="" icon="el-icon-edit" size="small" v-if="isAuth('admin:topic:updateById')">上线</el-button>
        <el-button type="" icon="el-icon-edit" size="small" v-if="isAuth('admin:topic:updateById')">下线</el-button>
        <el-button type="danger" icon="el-icon-edit" size="small" v-if="isAuth('admin:topicgoods:deleteById')">删除</el-button>
      </template>
    </avue-crud>

  </div>
</template>

<script>
import { tableOption } from '@/crud/commodity/subject'
export default {
  data () {
    return {
      dataForm: {
        indexImg: ''
      },
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
  computed: {
    statusName () {
      return (status) => {
        return status === 1 ? '上线中' : '已下线'
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
      this.$http({
        url: this.$http.adornUrl('/bbTopic/page'),
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
      this.$router.push({ name: 'subjectInfo', query: { id } })
    },
    // 条件查询
    searchChange (params) {
      this.getDataList(this.page, params)
    },
    // 多选变化
    selectionChange (val) {
      this.dataListSelections = val
    }
  }
}
</script>
