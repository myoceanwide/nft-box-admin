<template>
  <div class="mod-role">
    <avue-crud
      ref="crud"
      :page="page"
      :data="dataObj.versionCode"
      :option="tableOptionCode"
      @search-change="searchChange"
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          v-if="isAuth('sys:role:save')"
          @click.stop="addOrUpdateHandle(0)"
        >
          新增
        </el-button>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          v-if="isAuth('sys:role:delete')"
          @click.stop="deleteHandle(0, scope.row.versionCode)"
        >
          删除
        </el-button>
      </template>
    </avue-crud>
    <avue-crud
      ref="crud"
      :page="page"
      :data="dataObj.versionName"
      :option="tableOptionName"
      @search-change="searchChange"
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          v-if="isAuth('sys:role:save')"
          @click.stop="addOrUpdateHandle(1)"
        >
          新增
        </el-button>
      </template>

      <template slot-scope="scope" slot="menu">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="small"
          v-if="isAuth('sys:role:delete')"
          @click.stop="deleteHandle(1, scope.row.versionName)"
        >
          删除
        </el-button>
      </template>
    </avue-crud>
    <!-- 弹窗, 新增 / 修改 -->
    <app-version-conf
      v-if="AppVersionConfVisible"
      ref="appVersionConf"
      @refreshDataList="getDataList"
    ></app-version-conf>
  </div>
</template>

<script>
import { tableOptionCode, tableOptionName } from '@/crud/sys/app-version'
import AppVersionConf from './appversion-add-or-update'

export default {
  data() {
    return {
      dataObj: {
        versionCode: [],
        versionName: [],
      },
      dataListLoading: false,
      AppVersionConfVisible: false,
      tableOptionCode: tableOptionCode,
      tableOptionName: tableOptionName,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
    }
  },
  components: {
    AppVersionConf,
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/config/list'),
        method: 'post',
      }).then(({ data }) => {
        this.dataObj.versionCode = []
        this.dataObj.versionName = []
        data.versionCode.forEach((t) => {
          this.dataObj.versionCode.push({ versionCode: t })
        })
        data.versionName.forEach((t) => {
          this.dataObj.versionName.push({ versionName: t })
        })
        this.dataListLoading = false
      })
    },
    // 条件查询
    searchChange(params) {
      this.getDataList(this.page, params)
    },

    // 新增
    addOrUpdateHandle(key) {
      this.AppVersionConfVisible = true
      this.$nextTick(() => {
        console.log(this.$refs.appVersionConf)
        this.$refs.appVersionConf.init(key)
      })
    },
    // 删除
    deleteHandle(key, value) {
      let data = {
        configKey: key,
        configValue: value,
        type: 1,
      }
      this.$confirm(`确定进行[${value}]删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/config/set'),
            method: 'post',
            data,
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              },
            })
          })
        })
        .catch(() => {})
    },
  },
}
</script>
