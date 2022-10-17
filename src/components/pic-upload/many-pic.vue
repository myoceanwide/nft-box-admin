<template>
  <div>
    <!-- <el-upload
      class="pic-uploader-component new"
      ref="file"
      :action="$http.adornUrl('/admin/file/upload/nftElement')"
      :headers="{ Authorization: $cookie.get('Authorization') }"
      :show-file-list="isShowList"
      :on-success="handleUploadSuccess"
      :on-change="fileChange"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      :fileList="valueList"
    >
      <img v-if="value" :src="resourcesUrl + value" class="pic" />
      <i v-else class="el-icon-plus pic-uploader-icon"></i>
    </el-upload> -->
    <el-upload
      :action="$http.adornUrl('/admin/file/upload/element')"
      :headers="{ Authorization: $cookie.get('Authorization') }"
      list-type="picture-card"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview"
      :on-success="handleUploadSuccess"
      :on-remove="handleRemove"
      :file-list="fileList"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>

    <!-- <el-upload
      class="upload-demo"
      ref="file"
      :action="$http.adornUrl('/admin/file/upload/element')"
      :headers="{ Authorization: $cookie.get('Authorization') }"
      :on-preview="handlePreview"
      :on-success="handleUploadSuccess"
      :on-remove="handleRemove"
      :on-change="fileChange"
      :file-list="fileList"
      list-type="picture"
    >
      <el-button size="small" type="primary" v-if="!fileList.length"
        >点击上传</el-button
      >
      <div slot="tip" class="el-upload__tip" v-if="!fileList.length">
        只能上传jpg/png文件，且不超过2Mb
      </div>
    </el-upload> -->
  </div>
</template>

<script>
import { boolean } from 'yargs';

export default {
  data() {
    return {
      resourcesUrl: process.env.VUE_APP_RESOURCES_URL,
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
    };
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    isShowList: {
      default: false,
      type: boolean,
    },
  },
  computed: {
    curFileList() {
      if (this.list.length) {
        console.log('load', this.list);
        let m = [];
        this.list.forEach((url) => {
          m.push({
            name: url.split('/')[url.split('/').length - 1],
            url: url,
          });
        });
        return m;
      }
      return [];
    },
  },
  watch: {
    list(val) {
      console.log(val, 'listwatch');
      this.fileList = this.curFileList;
    },
  },
  methods: {
    // 图片上传
    handleUploadSuccess(response, file, fileList) {
      this.fileList = fileList;
      this.$emit('success', this.fileList);
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      this.$emit('remove', this.fileList);
    },
    beforeRemove() {},
    handlePreview() {},
    fileChange(file, fileList) {
      this.fileList = fileList;
      this.$emit('fileChange');
    },
    // 限制图片上传大小
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif' ||
        file.type === 'image/jpg';
      if (!isJPG) {
        this.$message.error('上传图片只能是jpeg/jpg/png/gif 格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isLt10M && isJPG;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss">
.pic-uploader-component .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  .pic-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .pic {
    width: 178px;
    height: 178px;
    display: block;
  }
}
.pic-uploader-component .el-upload:hover {
  border-color: #409eff;
}
</style>
