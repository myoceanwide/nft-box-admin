<template>
  <div class="mod-index-img">
    <el-dialog
      :title="!dataForm.imgId ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @closed="closed"
    >
      <el-form
        :model="dataForm"
        ref="dataForm"
        :rules="dataRule"
        inline
        label-width="120px"
      >
        <el-form-item label="前端展示名称" prop="goodsName" class="block">
          <el-input v-model="dataForm.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品副标题" prop="goodsTitleName" class="block">
          <el-input v-model="dataForm.goodsTitleName"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="costPrice">
          <el-input v-model="dataForm.costPrice" type="number"></el-input>
        </el-form-item>
        <el-form-item label="前端展示价格" prop="goodsPrice">
          <el-input v-model="dataForm.goodsPrice" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="stock" class="block">
          <el-input v-model="dataForm.stock"></el-input>
        </el-form-item>
        <el-form-item label="商品品类" prop="goodsCategoryId" class="block">
          <el-select v-model="dataForm.goodsCategoryId">
            <el-option
              v-for="item of categoryList"
              :key="item.goodsCategoryId"
              :label="item.categoryName"
              :value="item.goodsCategoryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品评分" prop="score" class="block">
          <el-input v-model="dataForm.score" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品购买数量" prop="salesVolume" class="block">
          <el-input v-model="dataForm.salesVolume" type="number"></el-input>
        </el-form-item>
        <el-form-item label="下单地址" prop="buyUrl" class="block">
          <el-input v-model="dataForm.buyUrl" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="商品头图" prop="goodsImg" class="block">
          <PicUpload
            v-model="dataForm.goodsImg"
            @fileChange="fileChange('goodsImg')"
          ></PicUpload>
        </el-form-item>
        <el-form-item label="商品详情图" prop="detailImgList" class="block">
          <MulPicUpload
            v-model="dataForm.detailImgList"
            :defaultImgList="defaultImgList"
            @closed="closed"
            @fileChange="fileChange('detailImgList')"
          ></MulPicUpload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer flex-center">
        <el-button @click="dataFormSubmit()" type="primary">保 存</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MulPicUpload from '@/components/mul-pic-upload'
import { Debounce } from '@/utils/debounce'
import PicUpload from '@/components/pic-upload/index.vue'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      dataForm: {
        goodsName: '',
        goodsTitleName: '',
        costPrice: '',
        goodsPrice: '',
        stock: '',
        goodsCategoryId: '',
        buyUrl: '',
        goodsImg: '',
        detailImgList: '',
        score: '',
        salesVolume: '',
      },
      defaultImgList: [],
      dataRule: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goodsTitleName: [
          { required: true, message: '请输入商品副标题', trigger: 'blur' },
        ],
        costPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goodsPrice: [
          { required: true, message: '请输入前端展示价格', trigger: 'blur' },
        ],
        stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
        goodsCategoryId: [
          { required: true, message: '请选择商品品类', trigger: 'change' },
        ],
        buyUrl: [
          { required: true, message: '请输入下单地址', trigger: 'blur' },
        ],
        goodsImg: [
          { required: true, message: '请上传商品头图', trigger: 'change' },
        ],
        detailImgList: [
          { required: true, message: '请上传商品详情图', trigger: 'change' },
        ],
        score: [
          { required: true, message: '请输入商品评分', trigger: 'change' },
        ],
        salesVolume: [
          { required: true, message: '请输入商品购买数量', trigger: 'change' },
        ],
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
      },
      type: 'add',
      id: '', // 当前的id
      visible: false,
    }
  },
  components: {
    MulPicUpload,
    PicUpload,
  },
  computed: {
    ...mapState('globalData', ['categoryList']),
  },
  methods: {
    // 获取分类数据
    init(id) {
      this.id = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (!id) {
        this.type = 'add'
        this.resetData()
        return
      }
      this.type = 'edit'
      // 获取产品数据
      this.$http({
        url: this.$http.adornUrl(`/bbGoods/getById`),
        method: 'post',
        data: this.$http.adornData({
          id,
        }),
      }).then(({ data }) => {
        this.defaultImgList = data.goodsImageList
          .map((it) => it.goodsImg)
          .join(',')
        this.dataForm = data
      })
    },
    resetData() {
      this.dataForm = {
        goodsName: '',
        goodsTitleName: '',
        costPrice: '',
        goodsPrice: '',
        stock: '',
        goodsCategoryId: '',
        buyUrl: '',
        goodsImg: '',
        detailImgList: '',
        score: '',
        salesVolume: '',
      }
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return
        }
        const { url, datas } = this.getRequestStatus()
        this.$http({
          url: this.$http.adornUrl(url),
          method: 'post',
          data: this.$http.adornData(datas),
        }).then(({ data }) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList', this.page)
            },
          })
        })
      })
    }),
    getRequestStatus() {
      let url, datas
      if (this.type === 'add') {
        // 新增
        url = '/bbGoods/add'
        datas = {
          ...this.dataForm,
          detailImgList: this.dataForm.detailImgList.split(','),
        }
      } else if (this.type === 'edit') {
        // 修改
        url = '/bbGoods/updateById'
        const { goodsImageList, ...other } = this.dataForm
        datas = {
          ...other,
          detailImgList: this.dataForm.detailImgList.split(','),
          goodsId: this.id,
        }
      }

      return {
        url,
        datas,
      }
    },
    closed() {
      this.defaultImgList = []
      this.dataForm.detailImgList = ''
    },
    fileChange(type) {
      this.$refs.dataForm.validateField(type)
    },
  },
}
</script>
<style lang="scss" scoped>
.block {
  display: block !important;
}

::v-deep .el-input,
.el-textarea {
  width: 300px;
}
</style>
