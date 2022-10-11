<template>
  <el-dialog
    :title="isNew ? '新增NFT数据' : '修改NFT数据'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="handleClosed"
    width="50%"
  >
    <div class="manual-dialog" v-loading="dislogLoad">
      <el-form
        ref="form"
        :model="form"
        :rules="isNew ? rules : {}"
        label-width="120px"
      >
        <el-form-item label="项目名称" prop="name" :required="isNew">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="项目简介" prop="introduction">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.introduction"
          />
        </el-form-item>
        <el-form-item label="官网地址" prop="txUrl">
          <el-input v-model="form.txUrl"></el-input>
        </el-form-item>
        <el-form-item label="以太坊浏览地址" prop="contractUrl">
          <el-input v-model="form.contractUrl"></el-input>
        </el-form-item>
        <el-form-item label="合约名称" prop="contractName" :required="isNew">
          <el-input v-model="form.contractName"></el-input>
        </el-form-item>
        <el-form-item label="合约地址" prop="contract">
          <el-input v-model="form.contract"></el-input>
        </el-form-item>
        <el-form-item label="发行量" prop="circulation">
          <el-input v-model="form.circulation"></el-input>
        </el-form-item>
        <el-form-item label="发行价" prop="issuePrice">
          <el-input v-model="form.issuePrice"></el-input>
        </el-form-item>
        <el-form-item label="地板价" prop="floorPrice">
          <el-input v-model="form.floorPrice"></el-input>
        </el-form-item>
        <el-form-item label="持有者" prop="holdersNum">
          <el-input v-model="form.holdersNum"></el-input>
        </el-form-item>
        <el-form-item label="NFT作品数" prop="openseaItems">
          <el-input v-model="form.openseaItems"></el-input>
        </el-form-item>
        <el-form-item label="拥有者" prop="openseaOwners">
          <el-input v-model="form.openseaOwners"></el-input>
        </el-form-item>
        <el-form-item label="交易量(总价值)" prop="openseaTotalValues">
          <el-input v-model="form.openseaTotalValues"></el-input>
        </el-form-item>
        <el-form-item label="铸造百分比" prop="mintVolumePercent">
          <el-input v-model="form.mintVolumePercent"></el-input>
        </el-form-item>
        <el-form-item label="巨鲸数" prop="whaleNum">
          <el-input v-model="form.whaleNum"></el-input>
        </el-form-item>
        <el-form-item label="FOMO" prop="fomo">
          <el-select v-model="form.fomo">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推特粉丝数" prop="twitterFansNum">
          <el-input v-model="form.twitterFansNum"></el-input>
        </el-form-item>
        <el-form-item label="DC粉丝数" prop="discordFansNum">
          <el-input v-model="form.discordFansNum"></el-input>
        </el-form-item>
        <el-form-item label="项目图标" prop="picUrl">
          <el-input v-model="form.picUrl"></el-input>
          <!-- <nft-upload
            :value="form.picUrl"
            @input="setUploadPic"
            @remove="setUploadPic('')"
          ></nft-upload> -->
        </el-form-item>
        <el-form-item label="背景图" prop="bannerUrl">
          <el-input v-model="form.bannerUrl"></el-input>
          <!-- <nft-upload
            :value="form.bannerUrl"
            @input="setUploadBanner"
            @remove="setUploadBanner('')"
          ></nft-upload> -->
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="confirm">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { omit, assign } from 'lodash';
import nftHttp from '@/utils/nftHttp';
import NftUpload from '@/components/pic-upload/nftupload.vue';
export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  components: { NftUpload },
  watch: {
    row(newval, oldval) {
      if (Object.keys(newval).length) {
        this.form = {
          name: newval.name,
          circulation: newval.circulation,
          contractName: newval.contractName,
          introduction: newval.introduction,
          twitterFansNum: newval.twitterFansNum,
          discordFansNum: newval.discordFansNum,
          bannerUrl: newval.bannerUrl,
          picUrl: newval.picUrl,
          txUrl: newval.txUrl,
          contractUrl: newval.contractUrl,
          contract: newval.contract,
          issuePrice: newval.issuePrice,
          floorPrice: newval.floorPrice,
          holdersNum: newval.holdersNum,
          openseaItems: newval.openseaItems,
          openseaTotalValues: newval.openseaTotalValues,
          openseaOwners: newval.openseaOwners,
          whaleNum: newval.whaleNum,
          fomo: newval.fomo,
          openseaTotalValues: newval.openseaTotalValues,
          manual: newval.manual,
          stick: newval.stick,
          online: newval.online,
          mintVolumePercent: newval.mintVolumePercent,
        };
        this.isNew = false;
      } else {
        this.isNew = true;
      }
      // console.log(newval, this.form, this.isNew, 'watch row');
    },
  },
  data() {
    var validateContractName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入合约名称'));
      } else if (value !== this.form.name) {
        callback(new Error('项目名称与合约名称必须保持一致!'));
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入项目名称'));
      } else {
        if (this.form.contractName !== '') {
          this.$refs['form'].validateField('validateContractName');
        }
        callback();
      }
    };
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL_NFT,
      isNew: false,
      dislogLoad: false,
      visible: false,
      form: {
        name: '',
        circulation: '',
        contractName: '',
        introduction: '',
        twitterFansNum: '',
        discordFansNum: '',
        bannerUrl: '',
        picUrl: '',
        txUrl: '',
        contractUrl: '',
        contract: '',
        issuePrice: '',
        floorPrice: '',
        openseaOwners: '',
        whaleNum: '',
        fomo: '',
        holdersNum: '',
        openseaItems: '',
        openseaTotalValues: '',
        openseaTotalValues: '',
        mintVolumePercent: '',
      },
      rules: {
        name: [
          // { required: true, message: '请输入项目名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' },
        ],
        contract: [
          { required: true, message: '请输入合约地址', trigger: 'blur' },
        ],
        contractName: [
          // { required: true, message: '请输入合约名称', trigger: 'blur' },
          { validator: validateContractName, trigger: 'blur' },
        ],
        fomo: [{ required: true, message: '请输入FOMO值', trigger: 'blur' }],
        txUrl: [{ required: true, message: '请输入官网地址', trigger: 'blur' }],
        contractUrl: [
          { required: true, message: '请输入Etherscan地址', trigger: 'blur' },
        ],
        issuePrice: [
          { required: true, message: '请输入发行价', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    showVisible() {
      this.visible = true;
      this.$nextTick(() => {
        this.resetForm('form');
      });
    },
    create(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dislogLoad = true;
          nftHttp({
            url: '/nftapi/nft/mint/updateOrInsertMintData',
            method: 'post',
            data: this.form,
          }).then(({ data }) => {
            this.dislogLoad = false;
            if (data.success) {
              this.visible = false;
              this.$message({
                message: '新增成功',
                type: 'success',
                duration: 1000,
              });
              this.$emit('success');
            } else {
              this.$message({
                message: `新增失败: ${data.errMsg}`,
                type: 'error',
                duration: 2000,
              });
              console.log(data, 'updateOrInsertMintData error');
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    edit() {
      this.dislogLoad = true;
      let data = assign(
        { id: this.row.id, contract: this.row.contract },
        this.form
      );
      nftHttp({
        url: '/nftapi/nft/mint/updateOrInsertMintData',
        method: 'post',
        data,
      }).then(({ data }) => {
        this.dislogLoad = false;
        if (data.success) {
          this.visible = false;
          this.$message({
            message: '编辑成功',
            type: 'success',
            duration: 1000,
          });
          this.$emit('success');
        } else {
          console.log(data, 'updateOrInsertMintData error');
        }
      });
    },
    confirm() {
      this.isNew ? this.create('form') : this.edit();
    },
    cancel() {
      this.visible = false;
    },
    resetForm(formName) {
      if (this.isNew) {
        this.form = {
          name: '',
          circulation: '',
          contractName: '',
          introduction: '',
          twitterFansNum: '',
          discordFansNum: '',
          bannerUrl: '',
          picUrl: '',
          txUrl: '',
          contractUrl: '',
          contract: '',
          issuePrice: '',
          floorPrice: '',
          openseaOwners: '',
          whaleNum: '',
          fomo: '',
          holdersNum: '',
          openseaItems: '',
          openseaTotalValues: '',
          openseaTotalValues: '',
          mintVolumePercent: '',
        };
        this.$refs[formName].resetFields();
      } else {
        this.$refs[formName].clearValidate();
      }
    },
    handleClosed() {
      this.$emit('close');
    },
    setUploadPic(res) {
      this.form.picUrl = res ? this.resourcesUrl + res : '';
    },
    setUploadBanner(res) {
      this.form.bannerUrl = res ? this.resourcesUrl + res : '';
    },
  },
};
</script>

<style></style>
