<template>
  <div>
    <el-upload
      :action="$http.adornUrl('/admin/file/upload/element')"
      :multiple="true"
      :headers="{ Authorization: $cookie.get('Authorization') }"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-change="fileChange"
      ref="uploadRef"
      :file-list="imageList"
      :http-request="uploadFile"
      :before-upload="beforeAvatarUpload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import Axios from 'axios';

export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      vals: '',
      imageList: [],
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
    };
  },
  props: {
    value: {
      default: '',
      type: String,
    },
    defaultImgList: {
      default: '',
      type: String,
    },
  },
  watch: {
    defaultImgList: {
      handler(newVal) {
        console.log(newVal, 'defaultImgList');
        if (!newVal || !newVal.length) {
          this.imageList = [];
          return;
        }
        this.imageList = newVal.split(',').map((it) => ({
          url: this.resourcesUrl + it,
          response: it,
        }));
        this.$emit('input', this.imageList.map((it) => it.response).join(','));
      },
      immediate: true,
    },
  },
  methods: {
    async delay(delay) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, delay);
      });
    },
    // 图片上传
    handleSuccess(response, file, fileList) {
      console.log(fileList);
      this.imageList = fileList;
      let pics = fileList
        .map((file) => {
          return file.response;
        })
        .join(',');
      this.$emit('input', pics);
    },
    // 限制图片上传大小
    async beforeAvatarUpload(file) {
      this.uploadParams = { rtc: Date.now() };
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif' ||
        file.type === 'image/jpg';
      if (!isJPG) {
        this.$message.error('上传图片只能是jpeg/jpg/png/gif 格式!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      await this.delay(1000);
      return isLt2M && isJPG;
    },
    handleRemove(file, fileList) {
      console.log(fileList);
      let pics = fileList
        .map((file) => {
          return file.response;
        })
        .join(',');
      this.$emit('input', pics);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadFile(item) {
      return new Promise(async (resolve, reject) => {
        if (!(await this.beforeAvatarUpload(item.file))) return;
        const fd = new FormData();
        fd.append('file', item.file);
        setTimeout(async () => {
          const { data } = await Axios.post(item.action, fd, {
            headers: { ...item.headers, 'Content-Type': 'multipart/form-data' },
          });
          resolve(data);
        }, 50);
      });
    },
    fileChange() {
      this.$emit('fileChange');
    },
  },
};
</script>

<style lang="scss"></style>
