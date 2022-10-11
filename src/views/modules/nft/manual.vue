<template>
  <div class="manual">
    <el-form ref="form" :model="dataForm" label-width="100px">
      <el-col :span="5">
        <el-form-item label="项目名称">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="合约地址">
          <el-input v-model="dataForm.smartContract"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="录入方式">
          <el-select
            v-model="dataForm.manual"
            placeholder="请选择录入方式"
            @change="handleSearch"
            ne
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="自动录入" :value="0"></el-option>
            <el-option label="人工录入" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="是否上架">
          <el-select
            v-model="dataForm.online"
            placeholder="请选择上下架"
            @change="handleSearch"
            ne
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="下架" :value="0"></el-option>
            <el-option label="上架" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="排序字段名">
          <el-select
            v-model="dataForm.column"
            placeholder="请选择排序字段名"
            @change="handleSearch"
            ne
          >
            <el-option label="fomo" value="fomo"></el-option>
            <el-option label="mint_num" value="mint_num"></el-option>
            <el-option label="whale_num" value="whale_num"></el-option>
            <el-option label="issue_price" value="issue_price"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="排序规则">
          <el-select
            v-model="dataForm.sortSize"
            placeholder="请选择排序字段名"
            @change="handleSearch"
            ne
          >
            <el-option label="正序" value="ASC"></el-option>
            <el-option label="倒序" value="DESC"></el-option>
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
        prop="name"
        header-align="center"
        align="center"
        label="项目名称"
      ></el-table-column>
      <el-table-column
        prop="manual"
        header-align="center"
        align="center"
        label="录入方式"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.manual ? '人工录入' : '自动录入' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTimeM"
        header-align="center"
        align="center"
        label="创建时间"
      ></el-table-column>
      <el-table-column prop="txUrl" header-align="center" label="官网地址">
        <template slot-scope="scope">
          <el-link :href="scope.row.contractUrl" target="_blank">{{
            scope.row.contractUrl
          }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="online"
        width="100"
        header-align="center"
        align="center"
        label="是否上架"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.online ? '上架' : '下架' }}</div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            style="margin-right: 10px;"
            @click="handleUpdata(scope.row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            placement="top"
            :title="`是否${scope.row.online ? '下架' : '上架'}`"
            @confirm="handlePutOrSold(scope.row)"
          >
            <el-button
              type="primary"
              size="small"
              style="margin-right: 10px;"
              slot="reference"
              >{{ scope.row.online ? '下架' : '上架' }}</el-button
            >
          </el-popconfirm>
          <el-popconfirm
            placement="top"
            :title="`是否${scope.row.stick ? '取消置顶' : '置顶'}`"
            @confirm="handleStick(scope.row)"
          >
            <el-button
              type="primary"
              size="small"
              style="margin-right: 10px;"
              slot="reference"
              >{{ scope.row.stick ? '取消置顶' : '置顶' }}</el-button
            >
          </el-popconfirm>
          <el-button
            type="primary"
            size="small"
            @click="handleMetaMask(scope.row)"
            >Mint</el-button
          >
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
    <add-or-updateNFT-data
      ref="updateNFT"
      :row="curRow"
      @success="handleSearch"
      @close="clearCurRow"
    ></add-or-updateNFT-data>
  </div>
</template>

<script>
import nftHttp from '@/utils/nftHttp';
import AddOrUpdateNFTData from './manual-add-or-update.vue';
import moment from 'moment';
import NftProvider from '@/utils/nftInit';

export default {
  data() {
    return {
      dataForm: {
        name: '',
        smartContract: '',
        manual: '',
        online: '',
        column: 'fomo',
        sortSize: 'ASC',
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
  components: {
    AddOrUpdateNFTData,
  },
  async mounted() {
    this.getlist();
    this.nftProvider = new NftProvider();
  },
  destoryed() {
    this.nftProvider.removeLister();
  },
  methods: {
    getlist() {
      this.loading = true;

      let data = {
        column: this.dataForm.column,
        sortSize: this.dataForm.sortSize,
        page: this.page.num,
        size: this.page.size,
        isAdmin: 'MO!~JORBET!@@3',
      };

      this.dataForm.name ? (data.name = this.dataForm.name) : null;
      this.dataForm.smartContract
        ? (data.smartContract = this.dataForm.smartContract)
        : null;
      this.dataForm.online ? (data.online = this.dataForm.online) : null;
      this.dataForm.manual ? (data.manual = this.dataForm.manual) : null;

      nftHttp({
        url: '/nftapi/nft/mint/mintRank',
        method: 'post',
        data,
      }).then(({ data }) => {
        this.loading = false;
        if (data.success) {
          this.page.total = data.data.total;

          data.data.rows.forEach((item) => {
            item.createTimeM = item.createTime
              ? moment(item.createTime).format('YYYY/MM/DD hh:mm:ss')
              : '无';
          });

          this.dataList = data.data.rows;
        } else {
          console.log(data, 'mintRank error');
        }
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
      this.$refs.updateNFT.showVisible();
    },
    handleUpdata(row) {
      this.curRow = row;
      this.$refs.updateNFT.showVisible();
    },
    clearCurRow() {
      this.curRow = {};
    },
    handlePutOrSold(row) {
      this.loading = true;

      let data = {
        id: row.id,
        contract: row.contract,
        contractName: row.contractName,
        online: !row.online,
        manual: row.manual,
        stick: row.stick,
      };
      nftHttp({
        url: '/nftapi/nft/mint/updateOrInsertMintData',
        method: 'post',
        data,
      }).then(({ data }) => {
        if (data.success) {
          this.$message({
            message: `${row.online ? '下架' : '上架'}成功`,
            type: 'success',
            duration: 1000,
          });
          this.getlist();
        } else {
          console.log(data, 'updateOrInsertMintData error');
        }
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
      nftHttp({
        url: '/nftapi/nft/mint/updateOrInsertMintData',
        method: 'post',
        data,
      }).then(({ data }) => {
        if (data.success) {
          this.$message({
            message: `${row.stick ? '取消置顶' : '置顶'}成功`,
            type: 'success',
            duration: 1000,
          });
          this.getlist();
        } else {
          console.log(data, 'updateOrInsertMintData error');
        }
      });
    },
    async handleMetaMask(row) {
      this.nftProvider.connect();
      this.nftProvider.sendTransaction({ to: row.contract });
    },
  },
};
</script>
<style lang="scss" scoped>
.s-input {
  width: 300px;
}
</style>
