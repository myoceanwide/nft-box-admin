<template>
  <div class="mod-index-img">
    <el-dialog :title="!id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="100px">
        <el-form-item label="所属位置" prop="pagePosition">
          <el-select v-model="dataForm.pagePosition" filterable placeholder="请选择">
            <el-option v-for="item in pagePositionData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="跳转类型" prop="jumpType">
          <el-select v-model="dataForm.jumpType">
            <el-option v-for="item of jumpTypeData" :key="item.label" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转协议" prop="jumpContent">
          <el-input v-model="dataForm.jumpContent"></el-input>
        </el-form-item>
        <el-form-item label="轮播图片" prop="imgUrl">
          <pic-upload v-model="dataForm.imgUrl" @fileChange="fileChange"></pic-upload>
        </el-form-item>
        <el-form-item label="所属位置" prop="pagePosition">
          <el-select v-model="dataForm.position" filterable placeholder="请选择">
            <el-option v-for="item in positionData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上下线" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio v-for="item of topBottomLineData" :key="item.label" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上下线时间" prop="date">
          <el-date-picker v-model="dataForm.date" type="datetimerange" range-separator="至" value-format="timestamp"
            start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer flex-center">
        <el-button type="primary" @click="dataFormSubmit()">保 存</el-button>
        <el-button @click="visible = false" >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PicUpload from '@/components/pic-upload'
import { Debounce } from '@/utils/debounce'
import { topBottomLineData, jumpTypeData } from '../shop/staticData'
export default {
  data () {
    return {
      dataForm: {
        position: 4,
        name: '',
        jumpType: 1,
        pagePosition: 1,
        status: 1,
        imgUrl: '',
        jumpContent: '',
        date: '',
        sort: 1
      },
      id: '',
      type: 'add',
      jumpTypeData,
      pagePositionData: [
        { label: '首页', value: 1 }
      ],
      positionData: [
        { label: '大宫格', value: 4 },
        { label: '小宫格1', value: 5 },
        { label: '小宫格2', value: 6 }
      ],
      topBottomLineData,
      dataRule: {
        imgUrl: [
          { required: true, message: '轮播图片不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        jumpType: [
          { required: true, message: '跳转类型不能为空', trigger: 'change' }
        ],
        jumpContent: [
          { required: true, message: '跳转协议不能为空', trigger: 'blur' }
        ],
        pagePosition: [
          { required: true, message: '所属位置不能为空', trigger: 'change' }
        ],
        status: [
          { required: true, message: '上下线不能为空', trigger: 'change' }
        ],
        date: [
          { required: true, message: '上下线时间不能为空', trigger: 'change' }
        ]
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      visible: false
    }
  },
  components: {
    PicUpload
  },
  methods: {
    // 获取分类数据
    init (id) {
      this.visible = true
      this.id = id
      this.type = 'add'
      if (id) {
        this.type = 'edit'
        // 获取产品数据
        this.$http({
          url: this.$http.adornUrl(`/bbBanner/getById`),
          method: 'post',
          data: this.$http.adornData({ id })
        }).then(({ data }) => {
          for (const key in this.dataForm) {
            if (key === 'date') {
              this.dataForm.date = [new Date(data.startTime).getTime(), new Date(data.endTime).getTime()]
            } else {
              this.dataForm[key] = data[key]
            }
          }
        })
      } else {
        this.$nextTick(() => {
          this.$refs.dataForm.clearValidate()
          this.$refs['dataForm'].resetFields()
          this.dataForm.imgUrl = ''
        })
      }
    },
    fileChange () {
      this.$refs.dataForm.validateField('imgUrl')
    },
    getReqParams () {
      let url, datas
      const { date, ...other } = this.dataForm
      datas = {
        ...other,
        startTime: date[0],
        endTime: date[1]
      }
      if (this.type === 'add') {
        url = '/bbBanner/add'
      } else if (this.type === 'edit') {
        url = '/bbBanner/updateById'
        datas = { ...datas, bannerId: this.id }
      }
      return { url, datas }
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        const { url, datas } = this.getReqParams()

        this.$http({
          url: this.$http.adornUrl(url),
          method: 'post',
          data: this.$http.adornData(datas)
        }).then(({ data }) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.visible = false
          this.$emit('refreshDataList', this.page)
        })
      })
    })
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-select {
  width: 100%;
}

//card样式
.card-prod-bottom {
  position: relative;
  text-align: left;

  .card-prod-name {
    margin: auto;
    padding: 0 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 118px;
    display: inline-block;
  }

  .card-prod-name-button {
    position: absolute;
    top: 24px;
    right: 10px;
  }
}
</style>
