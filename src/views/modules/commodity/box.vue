<template>
  <div class="mod-prod">
    <avue-crud
      ref="crud"
      :page.sync="page"
      :search.sync="search"
      :data="dataList"
      :table-loading="dataListLoading"
      :option="tableOption"
      @search-change="searchChange"
      @selection-change="selectionChange"
      @on-load="getDataList"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          v-if="isAuth('admin:box:add')"
          @click.stop="addOrUpdateHandle()"
          >新增</el-button
        >
      </template>

      <template slot="status" slot-scope="scope">
        <el-tag :type="scope.row.status === 0 ? 'warning' : ''">
          {{ statusName(scope.row.status) }}</el-tag
        >
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="small"
          v-if="isAuth('admin:box:updateById')"
          @click="addOrUpdateHandle(scope.row.boxId)"
          >编辑</el-button
        >
        <el-button
          icon="el-icon-edit"
          size="small"
          @click="topAndBotLine(scope.row.boxId, 1)"
          v-if="isAuth('admin:box:upOrDown')"
          >上线</el-button
        >
        <el-button
          icon="el-icon-edit"
          size="small"
          @click="topAndBotLine(scope.row.boxId, 0)"
          v-if="isAuth('admin:box:upOrDown')"
          >下线</el-button
        >
      </template>
    </avue-crud>
  </div>
</template>

<script>
import AddOrUpdate from './library-add-or-update';
import { tableOption } from '@/crud/commodity/box';
export default {
  data() {
    return {
      dataForm: {
        indexImg: '',
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
        pageSize: 10, // 每页显示多少条
      },
    };
  },
  components: {
    AddOrUpdate,
  },
  computed: {
    statusName() {
      return (status) => {
        return status === 1 ? '上线中' : '已下线';
      };
    },
  },
  methods: {
    // 获取数据列表
    getDataList(page, params = this.search) {
      // 这一部操作是为了解决分页查询时，搜索条件不起作用的问题，avue组件的bug，无语了
      for (const key in params) {
        !params[key] && delete params[key];
      }
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl('/bbBox/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: page == null ? this.page.currentPage : page.currentPage,
              size: page == null ? this.page.pageSize : page.pageSize,
            },
            params
          )
        ),
      }).then(({ data }) => {
        this.dataList = data.records;
        this.page.total = data.total;
        this.dataListLoading = false;
      });
    },

    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.$router.push({ name: 'boxInfo', query: { id } });
    },
    async topAndBotLine(id, status) {
      try {
        await this.$http({
          url: this.$http.adornUrl('/bbBox/upOrDown'),
          method: 'post',
          data: this.$http.adornData({
            boxId: id,
            status: status,
          }),
        });
        this.$message.success('修改成功');
        this.getDataList();
      } catch (err) {
        this.$message.error('修改失败');
      }
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.imgId;
          });
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/admin/indexImg'),
          method: 'delete',
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList();
            },
          });
        });
      });
    },
    // 条件查询
    searchChange(params, done) {
      this.getDataList(this.page, params);
      done();
    },
    // 多选变化
    selectionChange(val) {
      this.dataListSelections = val;
    },
  },
};
</script>
