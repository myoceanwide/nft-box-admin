<template>
  <el-dialog
    :title="messageId ? '新增推送' : '编辑推送'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="handleClosed"
    width="40%"
  >
    <div class="manual-dialog" v-loading="dislogLoad">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input type="textarea" v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="sendContent">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.sendContent"
          />
        </el-form-item>
        <el-form-item label="图片" prop="imgUrl">
          <nft-upload
            :value="form.imgUrl"
            @input="setUploadImg"
            @remove="setUploadImg('')"
          ></nft-upload>
        </el-form-item>
        <el-form-item label="发送时间" prop="sendTime">
          <el-date-picker
            v-model="tempSendTime"
            type="datetime"
            placeholder="选择日期时间"
            @change="handleSendTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发送目标人群" prop="sendTarget">
          <el-checkbox-group
            v-model="tempSendTarget"
            @change="sendTargetChange"
          >
            <el-checkbox :label="0" key="全量发送">全量发送</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="落地页跳转地址" prop="jumpUrl">
          <el-input v-model="form.jumpUrl"></el-input>
        </el-form-item>
        <el-form-item label-width="0" style="text-align: center;">
          <el-button type="primary" @click="confirm('form')">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { omit, assign } from 'lodash';
import nftHttp from '@/utils/nftHttp';
import NftUpload from '@/components/pic-upload/nftupload.vue';
import moment from 'moment';
export default {
  props: {
    messageId: {
      type: 'string',
      default: () => '',
    },
  },
  components: { NftUpload },
  data() {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL_NFT,
      dislogLoad: false,
      visible: false,
      tempSendTime: '',
      tempSendTarget: false,
      form: {
        title: '',
        sendContent: '',
        imgUrl: '',
        jumpUrl: '',
        sendTarget: 0,
        sendTime: '',
      },
      rules: {
        title: [
          // { required: true, message: '请输入项目名称', trigger: 'blur' },
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        sendContent: [
          { required: true, message: '请输入发送内容', trigger: 'blur' },
        ],
        imgUrl: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        jumpUrl: [
          { required: true, message: '请输入跳转地址', trigger: 'blur' },
        ],
        sendTime: [
          { required: true, message: '请选择发送时间', trigger: 'blur' },
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
    create() {
      this.dislogLoad = true;
      this.$http({
        url: this.$http.adornUrl('/nftMessage/add'),
        method: 'post',
        data: this.form,
      })
        .then((res) => {
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
          this.dislogLoad = false;
        });
    },
    edit() {
      this.dislogLoad = true;
      let data = assign({ messageId: this.messageId }, this.form);
      this.$http({
        url: this.$http.adornUrl('/nftMessage/updateById'),
        method: 'post',
        data,
      })
        .then((res) => {
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
          this.dislogLoad = false;
        });
      // nftHttp({
      //   url: '/nftapi/nft/mint/updateOrInsertMintData',
      //   method: 'post',
      //   data,
      // }).then(({ data }) => {
      //   this.dislogLoad = false;
      //   if (data.success) {
      //     this.visible = false;
      //     this.$message({
      //       message: '编辑成功',
      //       type: 'success',
      //       duration: 1000,
      //     });
      //     this.$emit('success');
      //   } else {
      //     console.log(data, 'updateOrInsertMintData error');
      //   }
      // });
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.messageId ? this.edit() : this.create();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancel() {
      this.visible = false;
    },
    resetForm(formName) {
      if (this.messageId) {
        this.$http({
          url: this.$http.adornUrl('/nftMessage/getById'),
          method: 'post',
          data: {
            id: this.messageId,
          },
        }).then((res) => {
          if (res.status === 200) {
            console.log(res.data, omit(res.data, ['addTime', 'updateTime']));
            this.form = omit(res.data, ['addTime', 'updateTime']);
            this.tempSendTarget = res.data.sendTarget ? true : false;
            this.tempSendTime = moment(res.data.sendTime);
            this.$refs[formName].clearValidate();
          }
          console.log(res, this.form);
        });
      } else {
        this.form = {
          title: '',
          sendContent: '',
          imgUrl: '',
          jumpUrl: '',
          sendTarget: 0,
          sendTime: '',
        };
        this.tempSendTime = '';
        this.tempSendTarget = false;
        this.$refs[formName].resetFields();
      }
    },
    handleSendTime(time) {
      console.log(time);
      this.form.sendTime = moment(time).valueOf();
    },
    sendTargetChange(option) {
      this.form.sendTarget = option ? 1 : 0;
    },
    handleClosed() {
      this.$emit('close');
    },
    setUploadImg(res) {
      this.form.imgUrl = res ? this.resourcesUrl + res : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.f-input {
  width: 400px;
}
</style>
