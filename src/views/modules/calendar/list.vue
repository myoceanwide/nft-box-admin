<template>
  <div>
    <el-form>
      <el-form-item>
        <el-button>新增活动</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border style="width: 100%;" v-loading="loading">
      <el-table-column type="index" label="编号"> </el-table-column>
      <el-table-column
        prop="dateTime"
        header-align="center"
        align="center"
        label="日历时间"
      ></el-table-column>
      <el-table-column
        prop="dateTime"
        header-align="center"
        align="center"
        label="是否有藏品发布"
      >
        <template slot-scope="scope">
          {{ scope.row.dd }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        width="350px"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            style="margin-right: 10px;"
            @click="handleUpdate(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: [],
      loading: false,
    };
  },
  methods: {
    handleUpdate(row) {},
  },
};
</script>
