<template>
  <div class="manual">
    <el-form ref="form" :model="dataForm" label-width="100px">
      <el-col :span="5">
        <el-form-item label="数藏名称">
          <el-input v-model="dataForm.goodsName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="是否上架">
          <el-select
            v-model="dataForm.isDelete"
            placeholder="请选择上下架"
            @change="handleSearch"
            ne
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="下架" :value="1"></el-option>
            <el-option label="上架" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="是否置顶">
          <el-select
            v-model="dataForm.topping"
            placeholder="请选择置顶"
            @change="handleSearch"
            ne
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未置顶" :value="0"></el-option>
            <el-option label="置顶" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5" style="margin-left: 20px;">
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
        prop="goodsName"
        header-align="center"
        align="center"
        label="数藏名称"
      ></el-table-column>
      <el-table-column
        prop="priceIssues"
        header-align="center"
        align="center"
        label="数藏价格"
      ></el-table-column>
      <el-table-column
        prop="assetId"
        header-align="center"
        align="center"
        label="资产ID"
        width="200px"
      >
        <template slot-scope="scope">
          {{ scope.row.assetId ? scope.row.assetId : '未发行' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="markOnChain"
        header-align="center"
        align="center"
        label="链上标识"
        width="600px"
      >
        <template slot-scope="scope">
          {{ scope.row.markOnChain ? scope.row.markOnChain : '未成功发行' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="isDelete"
        header-align="center"
        align="center"
        label="是否上架"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.isDelete ? '下架' : '上架' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="topping"
        header-align="center"
        align="center"
        label="是否置顶"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.topping ? '是' : '否' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="airdrop"
        header-align="center"
        align="center"
        label="藏品属性"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.airdrop === 0 ? '普通' : '空投' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="dateOfIssueM"
        header-align="center"
        align="center"
        label="发行时间"
        width="300px"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        width="350px"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-popconfirm
            placement="top"
            :title="`是否${scope.row.isDelete ? '上架' : '下架'}`"
            @confirm="updateIsDeleteOrTopping(scope.row, 'isDelete')"
          >
            <el-button
              type="primary"
              size="small"
              style="margin-right: 10px;"
              slot="reference"
              >{{ scope.row.isDelete ? '上架' : '下架' }}</el-button
            >
          </el-popconfirm>
          <el-popconfirm
            placement="top"
            :title="`是否${scope.row.topping ? '取消置顶' : '置顶'}`"
            @confirm="updateIsDeleteOrTopping(scope.row, 'topping')"
          >
            <el-button
              type="primary"
              size="small"
              style="margin-right: 10px;"
              slot="reference"
              >{{ scope.row.topping ? '取消置顶' : '置顶' }}</el-button
            >
          </el-popconfirm>
          <el-button
            type="primary"
            size="small"
            style="margin-right: 10px;"
            @click="handleUpdate(scope.row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            placement="top"
            :title="`是否发行该数字资产`"
            @confirm="handlePublish(scope.row.goodsId)"
          >
            <el-button
              type="primary"
              size="small"
              style="margin-right: 10px;"
              slot="reference"
              >发行</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleNumChange"
      :current-page="page.num"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
    >
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <!-- <add-or-updateNFT-data
      ref="updateNFT"
      :row="curRow"
      @success="handleSearch"
      @close="clearCurRow"
    ></add-or-updateNFT-data> -->
    <list-create-update ref="updateList" :row="curRow"></list-create-update>
  </div>
</template>

<script>
import moment from 'moment';
import ListCreateUpdate from './list-create-update.vue';
export default {
  data() {
    return {
      dataForm: {
        goodsName: '',
        isDelete: '',
        topping: '',
      },
      dataList: [],
      page: {
        num: 1,
        size: 10,
        total: 0,
      },
      loading: false,
      addOrUpdateVisible: false,
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      curRow: {},
      nftProvider: null,
    };
  },
  components: { ListCreateUpdate },
  async mounted() {
    this.getlist();
  },
  destoryed() {},
  methods: {
    getlist() {
      this.loading = true;

      let params = {
        current: this.page.num,
        size: this.page.size,
      };

      this.dataForm.goodsName
        ? (params.goodsName = this.dataForm.goodsName)
        : null;
      this.dataForm.isDelete
        ? (params.isDelete = this.dataForm.isDelete)
        : null;
      this.dataForm.topping ? (params.topping = this.dataForm.topping) : null;

      this.$http({
        url: this.$http.adornUrl('/npGoods/page'),
        method: 'get',
        params: this.$http.adornParams(params),
      }).then(({ data }) => {
        this.loading = false;
        this.page.total = data.total;
        data.records.forEach((item) => {
          item.dateOfIssueM = item.dateOfIssue
            ? moment(item.dateOfIssue).format('YYYY年MM月DD日 hh时mm分ss秒')
            : '无';
        });
        this.dataList = data.records;
      });
    },
    handleSearch() {
      this.page.num = 1;
      this.getlist();
    },
    handleNumChange(num) {
      this.pageChange(num);
    },
    handleSizeChange(size) {
      this.pageChange(null, size);
    },
    pageChange(num, size) {
      this.page.num = num ? num : this.page.num;
      this.page.size = size ? size : this.page.size;
      this.getlist();
    },
    handleCreate() {
      this.curRow = {};
      this.$refs.updateList.init(this.curRow);
    },
    async handleUpdate(row) {
      this.$refs.updateList.init(row);
    },
    clearCurRow() {
      this.curRow = {};
    },
    updateIsDeleteOrTopping(row, type) {
      this.loading = true;

      let data = {
        goodsId: row.goodsId,
        isDelete: row.isDelete,
        topping: row.topping,
      };

      if (type === 'topping') {
        data.topping = row.topping ? 0 : 1;
      }
      if (type === 'isDelete') {
        data.isDelete = row.isDelete ? 0 : 1;
      }
      this.$http({
        url: this.$http.adornUrl('/npGoods/updateTopping'),
        method: 'post',
        data,
      })
        .then(({ data }) => {
          this.loading = false;
          if (type === 'topping') {
            this.$message({
              message: `${row.topping ? '置顶' : '取消置顶'}成功`,
              type: 'success',
              duration: 1000,
            });
          }
          if (type === 'isDelete') {
            this.$message({
              message: `${row.isDelete ? '下架' : '上架'}成功`,
              type: 'success',
              duration: 1000,
            });
          }
          this.getlist();
        })
        .catch((err) => {
          this.$message({
            message: `修改状态失败: ${err}`,
            type: 'error',
            duration: 1000,
          });
        });
    },
    handlePublish(id) {
      this.$http({
        url: this.$http.adornUrl('/npGoods/publishAsset'),
        method: 'post',
        data: { id },
      })
        .then((res) => {
          console.log(res, 'www');
          // 1：初始 3：发行中 4：发行成功 5:冻结中 6:已冻结 7：封禁中 8:已封禁
          let stausText = '';
          switch (res.data.status) {
            case 3:
              stausText = '发行中';
              break;
            case 4:
              stausText = '发行成功';
              break;
            default:
              break;
          }
          this.$message({
            message: `操作发行数字资产成功,当前资产状态：${stausText}`,
            type: 'success',
            duration: 1000,
          });
          this.getlist();
        })
        .catch((err) => {
          this.$message({
            message: `操作发行数字资产失败: ${err}, 请重试`,
            type: 'error',
            duration: 1000,
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.s-input {
  width: 300px;
}
</style>
