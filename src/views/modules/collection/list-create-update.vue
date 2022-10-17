<template>
  <el-dialog
    :title="isNew ? '新增数藏' : '编辑数藏'"
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
        <el-form-item label="数藏名称" prop="goodsName" required>
          <el-input v-model="form.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="发行数量" prop="numberIssues" required>
          <el-input v-model="form.numberIssues"></el-input>
        </el-form-item>
        <el-form-item label="发行价格" prop="priceIssues" required>
          <el-input v-model="form.priceIssues"></el-input>
        </el-form-item>
        <el-form-item label="发行方" prop="userIssues" required>
          <el-input v-model="form.userIssues"></el-input>
        </el-form-item>
        <el-form-item label="发行方简介" prop="userIssuesMsg" required>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.userIssuesMsg"
          />
        </el-form-item>
        <el-form-item label="数藏属性" prop="assetCate" required>
          <el-radio-group v-model="form.assetCate">
            <el-radio :label="1">艺术品</el-radio>
            <el-radio :label="2">收藏品</el-radio>
            <el-radio :label="3">门票</el-radio>
            <el-radio :label="4">酒店</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发行时间" prop="dateOfIssue" required>
          <el-date-picker
            v-model="time"
            type="datetime"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="数藏头图" prop="goodsImg" required>
          <upload-single
            :value="form.goodsImg"
            @change="fileChange('goodsImg')"
            @input="setUploadPic($event, 'goodsImg')"
            @remove="setUploadPic('', 'goodsImg')"
          ></upload-single>
        </el-form-item>
        <el-form-item label="数藏头图背景" prop="goodsImgBackground">
          <upload-single
            :value="form.goodsImgBackground"
            @change="fileChange('goodsImgBackground')"
            @input="setUploadPic($event, 'goodsImgBackground')"
            @remove="setUploadPic('', 'goodsImgBackground')"
          ></upload-single>
        </el-form-item>
        <el-form-item label="商品展示图" prop="showImg" required>
          <upload-single
            :value="form.showImg"
            @change="fileChange('showImg')"
            @input="setUploadPic($event, 'showImg')"
            @remove="setUploadPic('', 'showImg')"
          ></upload-single>
        </el-form-item>
        <el-form-item label="数藏详情图" prop="detailImgList" required>
          <!-- <el-input v-model="form.detailImgList"></el-input> -->
          <MulPicUpload
            v-model="form.detailImgList"
            :defaultImgList="defaultImgList"
            @closed="closed"
            @fileChange="fileChange('detailImgList')"
          ></MulPicUpload>
          <!-- <upload-many
            :list="manyImgList"
            @success="setManyPic"
            @remove="setManyPic"
          ></upload-many> -->
        </el-form-item>
        <el-form-item label="左上角角标图" prop="goodsImgCorn">
          <upload-single
            :value="form.goodsImgCorn"
            @input="setUploadPic($event, 'goodsImgCorn')"
            @remove="setUploadPic('', 'goodsImgCorn')"
          ></upload-single>
        </el-form-item>
        <el-form-item label="发行方头像" prop="imgIssues" required>
          <upload-single
            :value="form.imgIssues"
            @change="fileChange('imgIssues')"
            @input="setUploadPic($event, 'imgIssues')"
            @remove="setUploadPic('', 'imgIssues')"
          ></upload-single>
        </el-form-item>
        <el-form-item label="数藏属性" prop="airdrop" required>
          <el-radio-group v-model="form.airdrop">
            <el-radio :label="0">普通数藏</el-radio>
            <el-radio :label="1">空投数藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="confirm('form')">确认</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { omit, assign } from 'lodash';
import moment from 'moment';
import nftHttp from '@/utils/nftHttp';
import UploadSingle from '@/components/pic-upload/single-pic.vue';
// import UploadMany from '@/components/pic-upload/many-pic.vue';
import MulPicUpload from '@/components/mul-pic-upload';

export default {
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  components: { UploadSingle, MulPicUpload },
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
    var validateImg = (rule, value, callback) => {
      console.log(validateImg, 'www');
      if (value === '') {
        callback(new Error('请输入项目名称'));
      } else {
        callback();
      }
    };
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      isNew: false,
      dislogLoad: false,
      visible: false,
      form: {
        airdrop: 0,
        assetCate: 1,
        dateOfIssue: '',
        detailImgList: '',
        showImg: '',
        goodsImg: '',
        goodsImgBackground: '',
        goodsImgCorn: '',
        goodsName: '',
        imgIssues: '',
        numberIssues: '',
        priceIssues: '',
        userIssues: '',
        userIssuesMsg: '',
      },
      rules: {
        dateOfIssue: [
          {
            required: true,
            message: '请输入发行时间',
            trigger: ['change', 'blur'],
          },
        ],
        detailImgList: [
          {
            required: true,
            message: '请添加数藏详情图',
            trigger: 'blur',
          },
        ],
        showImg: [
          {
            required: true,
            message: '请添加商品展示图',
            trigger: 'blur',
          },
        ],
        goodsImg: [
          {
            required: true,
            message: '请添加数藏头图',
            trigger: 'blur',
          },
        ],
        goodsName: [
          { required: true, message: '请输入数藏名称', trigger: 'blur' },
        ],
        imgIssues: [
          {
            required: true,
            message: '请添加发行方头像',
            trigger: 'blur',
          },
        ],
        numberIssues: [
          { required: true, message: '请输入发行数量', trigger: 'blur' },
        ],
        priceIssues: [
          { required: true, message: '请输入发行价格', trigger: 'blur' },
        ],
        userIssues: [
          { required: true, message: '请输入发行方', trigger: 'blur' },
        ],
        userIssuesMsg: [
          { required: true, message: '请输入发行方简介', trigger: 'blur' },
        ],
      },
      time: '',
      defaultImgList: '',
    };
  },
  methods: {
    async init(row) {
      this.show();
      this.isNew = Object.keys(row).length === 0 ? true : false;
      if (!this.isNew) {
        // 在此使用接口，主要为了接口权限限制
        let res = await this.$http({
          url: this.$http.adornUrl('/npGoods/getById'),
          method: 'post',
          data: { id: row.goodsId },
        });
        // 重组图片链接
        Object.keys(res.data).forEach((key) => {
          let inKey = [
            'showImg',
            'goodsImg',
            'goodsImgBackground',
            'goodsImgCorn',
            'imgIssues',
          ].includes(key);
          if (inKey) {
            res.data[key] = this.getSinglePic(res.data[key]);
          }
        });
        // 根据sort 重新排序
        let sortList = res.data.goodsImageList.sort((a, b) => {
          return a.sort - b.sort;
        });
        this.defaultImgList = sortList.map((it) => it.goodsImg).join(',');
        this.time = res.data.dateOfIssue;
        this.form = res.data;
      }
    },
    show() {
      this.visible = true;
      this.$nextTick(() => {
        this.defaultImgList = '';
        this.resetForm('form');
      });
    },
    create(data) {
      console.log(data, 'ww');
      this.dislogLoad = true;
      this.$http({
        url: this.$http.adornUrl('/npGoods/add'),
        method: 'post',
        data,
      })
        .then(({ data }) => {
          this.dislogLoad = false;
          this.visible = false;
          this.$message({
            message: '新增成功',
            type: 'success',
            duration: 1000,
          });
          this.$emit('success');
        })
        .catch((err) => {
          console.log(err, 'ww');
          this.$message({
            message: `新增失败: ${err}`,
            type: 'error',
            duration: 2000,
          });
        });
    },
    edit(data) {
      console.log(this.form, 'ww');
      this.dislogLoad = true;
      this.$http({
        url: this.$http.adornUrl('/npGoods/updateById'),
        method: 'post',
        data,
      })
        .then((res) => {
          console.log(res);
          this.dislogLoad = false;
          this.visible = false;
          this.$message({
            message: '编辑成功',
            type: 'success',
            duration: 1000,
          });
          this.$emit('success');
        })
        .catch((err) => {
          console.log(err, 'ww');
          this.$message({
            message: `编辑失败: ${err}`,
            type: 'error',
            duration: 2000,
          });
        });
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            ...this.form,
            detailImgList: this.form.detailImgList.split(','),
          };
          Object.keys(data).forEach((key) => {
            let inKey = [
              'showImg',
              'goodsImg',
              'goodsImgBackground',
              'goodsImgCorn',
              'imgIssues',
            ].includes(key);
            if (inKey) {
              data[key] = this.returnSinglePic(data[key]);
            }
          });
          this.isNew ? this.create(data) : this.edit(data);
        } else {
          console.log('error submit!!', this.form);
          return false;
        }
      });
    },
    closed() {
      this.defaultImgList = [];
      this.form.detailImgList = '';
    },
    cancel() {
      this.visible = false;
      this.defaultImgList = '';
      this.resetForm('form');
    },
    resetForm(formName) {
      if (this.isNew) {
        this.form = {
          airdrop: 0,
          assetCate: 1,
          dateOfIssue: '',
          detailImgList: '',
          goodsImg: '',
          goodsImgBackground: '',
          goodsImgCorn: '',
          goodsName: '',
          imgIssues: '',
          numberIssues: '',
          priceIssues: '',
          userIssues: '',
          userIssuesMsg: '',
          showImg: '',
        };
        this.$refs[formName].resetFields();
      } else {
        this.$refs[formName].clearValidate();
      }
    },
    handleClosed() {
      this.$emit('close');
    },
    getSinglePic(pic) {
      return pic ? this.resourcesUrl + pic : '';
    },
    returnSinglePic(pic) {
      return pic.split(this.resourcesUrl)[1];
    },
    setUploadPic(res, key) {
      console.log(res, key);
      this.form[key] = res ? this.resourcesUrl + res : '';
      // this.$refs.form.validateField(key);
      this.$refs.form.validateField(key);
    },
    handleTime(t) {
      this.form.dateOfIssue = t ? moment(t).valueOf() : t;
      console.log(this.form.dateOfIssue, 'ww');
    },
    fileChange(type) {
      this.$refs.form.validateField(type);
    },
  },
};
</script>

<style></style>
