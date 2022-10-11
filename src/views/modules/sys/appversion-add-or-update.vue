<template>
  <el-dialog
    :title="'新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="800px"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item
        v-if="key === 0"
        label="versionCode"
        prop="versionCode"
        label-width="120px"
      >
        <el-input
          v-model="dataForm.versionCode"
          placeholder="versionCode"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="key === 1"
        label="versionName"
        prop="versionName"
        label-width="120px"
      >
        <el-input
          v-model="dataForm.versionName"
          placeholder="versionName"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import { Debounce } from '@/utils/debounce'
export default {
  data() {
    return {
      key: 0,
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children',
      },
      dataForm: {
        versionName: '',
        versionCode: '',
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          {
            pattern: /\s\S+|S+\s|\S/,
            message: '请输入正确的角色名称',
            trigger: 'blur',
          },
        ],
        remark: [
          {
            required: false,
            pattern: /\s\S+|S+\s|\S/,
            message: '输入格式有误',
            trigger: 'blur',
          },
        ],
      },
      tempKey: -666666, // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    }
  },
  methods: {
    init(key) {
      this.key = key || 0
      console.log(key, 'www')
      this.visible = true
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      console.log(this.dataForm, 'ddd')
      let data = {
        configKey: this.key,
        type: 0, //新增
      }
      if (this.key) {
        data.configValue = this.dataForm.versionName
      } else {
        data.configValue = this.dataForm.versionCode
      }
      this.$http({
        url: this.$http.adornUrl(`/config/set`),
        method: 'post',
        data,
      }).then(({ data }) => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$emit('refreshDataList')
          },
        })
      })
    }),
  },
}
</script>
