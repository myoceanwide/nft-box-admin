<template>
  <div class="manual">
    <el-form ref="form" :model="dataForm" label-width="120px">
      <el-col :span="5">
        <el-form-item label="标题">
          <el-input v-model="dataForm.title"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item label="发送时间">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleTime"
          >
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleCreate">新增</el-button>
      </el-col>
    </el-form>
    <el-table
      :data="dataList"
      border
      row-key="categoryId"
      style="width: 100%;"
      v-loading="loading"
    >
      <el-table-column
        type="index"
        width="50"
        label="编号"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="sendTime"
        header-align="center"
        align="center"
        label="发送时间"
      ></el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="标题"
      >
      </el-table-column>
      <el-table-column
        prop="sendContent"
        header-align="center"
        align="center"
        label="内容"
      ></el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">待发送</span>
          <span v-else-if="scope.row.status === 2">已发送</span>
          <span v-else-if="scope.row.status === 3">已暂停</span>
          <span v-else-if="scope.row.status === 4">发送失败</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-popconfirm
            v-if="scope.row.status === 1"
            placement="top"
            :title="`是否暂停`"
            @confirm="handlePauseOrSend(scope.row, 'pause')"
          >
            <el-button
              type="primary"
              size="small"
              style="margin: 0 10px;"
              slot="reference"
              >暂停</el-button
            >
          </el-popconfirm>
          <el-popconfirm
            v-if="scope.row.status === 3"
            placement="top"
            :title="`是否待发送`"
            @confirm="handlePauseOrSend(scope.row, 'send')"
          >
            <el-button
              type="primary"
              size="small"
              style="margin: 0 10px;"
              slot="reference"
              >待发送</el-button
            >
          </el-popconfirm>
          <el-button
            type="primary"
            size="small"
            @click="handleUpdate(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleNumChange"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update-msg-data
      ref="updateNFT"
      :messageId="curRow.messageId"
      @success="handleSearch"
      @close="clearCurRow"
    ></add-or-update-msg-data>
  </div>
</template>

<script>
import { omit } from 'lodash';
import AddOrUpdateMsgData from './msg-add-or-update.vue';
import moment from 'moment';

export default {
  data() {
    return {
      coding: false,
      dataForm: {
        title: '',
        endTime: '',
        startTime: '',
      },
      time: '',
      dataList: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
      loading: false,
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      curRow: {},
    };
  },
  components: {
    AddOrUpdateMsgData,
  },
  mounted() {
    this.getlist();
    console.log(this.$refs.updateNFT);
  },
  methods: {
    getlist(page, params = this.dataForm) {
      this.loading = true;
      this.$http({
        url: this.$http.adornUrl('/nftMessage/page'),
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
        this.loading = false;
      });
    },
    handleSearch() {
      this.page.currentPage = 1;
      this.getlist();
    },
    handleNumChange(num) {
      this.pageChange(num);
    },
    handleSizeChange(size) {
      this.pageChange(null, size);
    },
    pageChange(num, size) {
      this.page.currentPage = num ? num : this.page.currentPage;
      this.page.pageSize = size ? size : this.page.pageSize;
      this.getlist();
    },
    handleCreate() {
      this.curRow = {};
      this.$refs.updateNFT.showVisible();
    },
    handleUpdate(row) {
      this.curRow = row;
      this.$refs.updateNFT.showVisible();
    },
    handleTime(time) {
      this.dataForm.startTime = time ? moment(time[0]).valueOf() : '';
      this.dataForm.endTime = time ? moment(time[1]).valueOf() : '';
    },
    clearCurRow() {
      this.curRow = {};
    },
    handlePauseOrSend(row, status) {
      // 深拷贝
      let data = Object.assign({}, row);
      data.status = status === 'pause' ? 3 : 1;
      this.loading = true;
      this.$http({
        url: this.$http.adornUrl('/nftMessage/updateById'),
        method: 'post',
        data,
      })
        .then((res) => {
          this.loading = false;
          this.handleSearch();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    handleStick(row) {
      this.loading = true;
      let data = {
        id: row.id,
        contract: row.contract,
        contractName: row.contractName,
        stick: !row.stick,
        online: row.online,
        manual: row.manual,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.s-input {
  width: 300px;
}
</style>
