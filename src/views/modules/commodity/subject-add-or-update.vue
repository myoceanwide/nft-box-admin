<script >
import SubjectCard from './components/SubjectCard.vue'
export default {
  data () {
    return {
      dataForm: {
        topicName: '',
        sort: '',
        status: 1
      },
      rules: {
        topicName: [
          { required: true, message: '请输入专题名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      },
      tableList: [],
      goodsList: [],
      type: 'add',
      boxId: 0
    }
  },
  created () {
    this.getAllComList()
    const id = this.$route.query.id
    this.boxId = +id
    if (!id) return
    this.type = 'edit'
    this.getBoxDetail()
    this.getSelectGoodsList()
  },
  methods: {
    back () {
      this.$router.back()
    },
    getReqParams () {
      let url, datas
      if (this.type === 'add') {
        url = '/bbTopic/add'
        datas = this.dataForm
      } else if (this.type === 'edit') {
        url = '/bbTopic/updateById'
        datas = { ...this.dataForm, topicId: this.boxId }
      }
      return { url, datas }
    },
    confirm () {
      this.$refs.dataForm.validate(valid => {
        if (!valid) return
        const { url, datas } = this.getReqParams()
        this.$http({
          url: this.$http.adornUrl(url),
          method: 'post',
          data: this.$http.adornData(datas)
        }).then(({ data }) => {
          if (this.type === 'add') {
            this.boxId = data
            this.resetDataForm()
          }
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    getAllComList (params = {}) {
      const { currentPage = 1, pageSize = 99999 } = params
      this.$http({
        url: this.$http.adornUrl('/bbGoods/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: currentPage,
              size: pageSize
            },
            params
          )
        )
      }).then(({ data }) => {
        this.tableList = data.records
      })
    },
    getSelectGoodsList () {
      this.$http({
        url: this.$http.adornUrl('/bbTopicGoods/page'),
        method: 'get',
        params: this.$http.adornParams({
          topicId: this.boxId,
          size: 9999
        })
      }).then(({ data }) => {
        this.goodsList = data.records
      })
    },
    getBoxDetail () {
      this.$http({
        url: this.$http.adornUrl('/bbTopic/getById'),
        method: 'post',
        data: this.$http.adornData({
          id: this.boxId
        })
      }).then(({ data }) => {
        for (const key in this.dataForm) {
          this.dataForm[key] = data[key]
        }
      })
    },
    resetDataForm () {
      this.dataForm = {
        topicName: '',
        sort: '',
        status: 1
      }
    }
  },
  components: { SubjectCard }
}
</script>

<template>
  <div class="mod-prod-info">
    <div class="flex-center btn">
      <el-button type="primary" @click="confirm"> 确认 </el-button>
      <el-button type="" @click="back"> 取消 </el-button>
    </div>
    <el-form :model="dataForm" :rules="rules" ref="dataForm" inline label-width="140px">
      <el-form-item label="专题名称" class="block" prop="topicName">
        <el-input v-model="dataForm.topicName" placeholder="请输入专题名称" class="w400"></el-input>
      </el-form-item>
      <el-form-item label="专题排序" prop="sort">
        <el-input v-model="dataForm.sort" type="number" placeholder="请输入专题排序" class="w400"></el-input>
      </el-form-item>
    </el-form>
    <SubjectCard class="mb20 mt30" :tableData="tableList" :boxId="boxId" :goodsList="goodsList" @search="getAllComList" @boxChange="getSelectGoodsList"  />
  </div>
</template>

<style lang='scss' scoped>
.block {
  display: block !important;
}
.w60 {
  width: 60px;
}
.w400 {
  width: 400px;
}

.mb20 {
  margin-bottom: 20px;
}
.mt30 {
  margin-top: 30px;
}
.btn {
  margin: 20px 0 0;
  justify-content: flex-end;
}

</style>
