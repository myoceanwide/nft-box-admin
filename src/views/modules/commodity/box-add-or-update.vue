<script>
import PicUpload from '@/components/pic-upload'
import BoxCard from './components/BoxCard.vue'
import OpenTheBox from './open-the-box.vue'
export default {
  data() {
    return {
      dataForm: {
        boxName: '',
        onePrice: '',
        fivePrice: '',
        boxImg: '',
        cornerMarkImg: '',
        oneProbability: '',
        twoProbability: '',
        threeProbability: '',
        fourProbability: '',
        oneProbabilityOther: '',
        twoProbabilityOther: '',
        threeProbabilityOther: '',
        fourProbabilityOther: '',
      },
      priceReg: /^\d+(\.\d{0,3})?$/,
      probabilitys: [
        { title: '至尊款', class: 'mb20 mt30', type: '1' },
        { title: '稀有款', class: 'mb20', type: '2' },
        { title: '惊喜款', class: 'mb20', type: '3' },
        { title: '超值款', class: '', type: '4' },
      ],
      imgFileListKey: {
        boxImg: [],
        cornerMarkImg: [],
      },
      rule: {
        boxName: [
          { required: true, message: '请输入盲盒名称', trigger: 'blur' },
        ],
        onePrice: [
          { required: true, message: '请输入1次价格', trigger: 'blur' },
        ],
        fivePrice: [
          { required: true, message: '请输入5次价格', trigger: 'blur' },
        ],
        boxImg: [
          { required: true, message: '请上传盲盒图片', trigger: 'blur' },
        ],
        oneProbability: [
          { required: true, message: '请输入至尊款概率', trigger: 'blur' },
        ],
        twoProbability: [
          { required: true, message: '请输入稀有款概率', trigger: 'blur' },
        ],
        threeProbability: [
          { required: true, message: '请输入惊喜款概率', trigger: 'blur' },
        ],
        fourProbability: [
          { required: true, message: '请输入超值款概率', trigger: 'blur' },
        ],
      },
      tableList: [],
      allBoxList: [],
      type: 'add',
      boxId: 0,
      surplus: 100, // 总概率
    }
  },
  components: { PicUpload, BoxCard, OpenTheBox },
  created() {
    this.getAllComList()

    const id = this.$route.query.id // 如果有id，则是编辑
    this.boxId = id
    if (!id) return
    this.getAllBoxList()
    this.type = 'edit'
    this.getBoxDetail(id)
  },
  methods: {
    async confirm() {
      const valid = await this.allValidate()
      // 如果校验没通过，返回
      if (!valid) return
      const { url, datas } = this.getReqParams()
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: this.$http.adornData(datas),
      }).then(({ data }) => {
        this.boxId = data
        if (this.type === 'add') {
          this.resetDataForm()
        }
        this.$message({
          message: '操作成功',
          type: 'success',
        })
      })
    },
    getReqParams() {
      let url, datas
      if (this.type === 'add') {
        url = '/bbBox/add'
        datas = this.dataForm
      } else if (this.type === 'edit') {
        url = '/bbBox/updateById'
        datas = { ...this.dataForm, boxId: this.boxId }
      }
      return { url, datas }
    },
    allValidate() {
      return new Promise((resolve) => {
        this.$refs.dataForm.validate(resolve)
      })
    },
    back() {
      this.$router.back()
    },
    fileChange() {
      this.$refs.dataForm.validateField('boxImg')
    },
    cornerFileChange() {
      this.$refs.dataForm.validateField('cornerMarkImg')
    },
    fileRemove(key) {
      console.log(key)
      this.dataForm[key] = ''
    },
    probabilityBlur() {
      const result =
        100 -
        this.dataForm.oneProbability -
        this.dataForm.twoProbability -
        this.dataForm.threeProbability -
        this.dataForm.fourProbability
      if (+this.surplus === +result) return
      this.surplus = +result.toFixed(3)
    },
    probabilityFocus(key) {
      this.surplus += this.dataForm[key]
    },
    probabilityChange(val, key) {
      if ((!this.priceReg.test(val) && val !== '') || +val > +this.surplus)
        return
      this.dataForm[key] = val
    },
    virtualProbabilityChange(val, key) {
      this.dataForm[key] = val
    },
    getAllComList(params = {}) {
      const { currentPage = 1, pageSize = 99999 } = params
      this.$http({
        url: this.$http.adornUrl('/bbGoods/page'),
        method: 'get',
        params: this.$http.adornParams(
          Object.assign(
            {
              current: currentPage,
              size: pageSize,
            },
            params,
          ),
        ),
      }).then(({ data }) => {
        this.tableList = data.records
      })
    },
    resetDataForm() {
      this.dataForm = {
        boxName: '',
        onePrice: '',
        fivePrice: '',
        boxImg: '',
        oneProbability: '',
        twoProbability: '',
        threeProbability: '',
        fourProbability: '',
      }
    },
    getBoxDetail(id) {
      this.$http({
        url: this.$http.adornUrl('/bbBox/getById'),
        method: 'post',
        data: this.$http.adornData({ id }),
      }).then(({ data }) => {
        for (const key in this.dataForm) {
          this.dataForm[key] = data[key]
        }

        // 复现 上传图片 filelist， 用于删除 filelist的回显
        this.imgFileListKey.boxImg = [new File([], this.dataForm.boxImg)]
        this.imgFileListKey.cornerMarkImg = [
          new File([], this.dataForm.cornerMarkImg),
        ]

        this.probabilityBlur()
      })
    },
    async getAllBoxList() {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/bbBoxGoods/queryListByBoxId'),
        method: 'post',
        data: this.$http.adornData({
          boxId: this.boxId,
        }),
      })
      this.allBoxList = data
    },
    testOpenBox() {
      this.$refs.openBoxRef.init(this.boxId)
    },
    async refresh() {
      await this.$http({
        url: this.$http.adornUrl('/bbBox/refresh'),
        method: 'post',
        data: this.$http.adornData({
          id: this.boxId,
        }),
      })
      this.$message.success('刷新成功')
    },
  },
}
</script>

<template>
  <div class="mod-prod-info">
    <div class="flex-align mb20 btn">
      <div>
        <el-button
          type="warning"
          @click="testOpenBox"
          v-if="isAuth('admin:box:testOpen')"
        >
          测试开盒
        </el-button>
        <el-button
          type="danger"
          @click="refresh"
          v-if="isAuth('admin:box:refresh')"
        >
          刷新盲盒
        </el-button>
      </div>
      <div>
        <el-button type="primary" @click="confirm">确认</el-button>
        <el-button type="" @click="back">返回</el-button>
      </div>
    </div>
    <el-form
      :model="dataForm"
      :rules="rule"
      ref="dataForm"
      inline
      label-width="140px"
    >
      <el-form-item label="盲盒名称" class="block" prop="boxName">
        <el-input
          v-model="dataForm.boxName"
          placeholder="请输入盲盒名称"
          class="w400"
        ></el-input>
      </el-form-item>
      <el-form-item label="盲盒抽1次价格" prop="onePrice">
        <el-input
          v-model="dataForm.onePrice"
          type="number"
          placeholder="请输入1次价格"
          class="w400"
        ></el-input>
      </el-form-item>
      <el-form-item label="盲盒抽5次价格" prop="fivePrice">
        <el-input
          v-model="dataForm.fivePrice"
          type="number"
          placeholder="请输入5次价格"
          class="w400"
        ></el-input>
      </el-form-item>
      <el-form-item label="盲盒首图" class="block" prop="boxImg">
        <PicUpload
          v-model="dataForm.boxImg"
          :isShowList="true"
          :valueList="imgFileListKey.boxImg"
          @fileChange="fileChange"
          @remove="fileRemove('boxImg')"
        />
      </el-form-item>
      <el-form-item label="盲盒角标" class="block" prop="cornerMarkImg">
        <PicUpload
          v-model="dataForm.cornerMarkImg"
          :isShowList="true"
          :valueList="imgFileListKey.cornerMarkImg"
          @fileChange="cornerFileChange"
          @remove="fileRemove('cornerMarkImg')"
        />
      </el-form-item>
      <div class="block">
        <el-form-item label="至尊款概率" prop="oneProbability">
          <el-input
            :value="dataForm.oneProbability"
            type="number"
            @focus="probabilityFocus('oneProbability')"
            @input="probabilityChange($event, 'oneProbability')"
            @blur="probabilityBlur"
            placeholder="请输入至尊款概率"
            class="w400"
          ></el-input>
        </el-form-item>
        <el-form-item label="稀有款概率" prop="twoProbability">
          <el-input
            :value="dataForm.twoProbability"
            type="number"
            @focus="probabilityFocus('twoProbability')"
            @input="probabilityChange($event, 'twoProbability')"
            @blur="probabilityBlur"
            placeholder="请输入稀有款概率"
            class="w400"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="惊喜款概率" prop="threeProbability">
        <el-input
          :value="dataForm.threeProbability"
          type="number"
          @focus="probabilityFocus('threeProbability')"
          @input="probabilityChange($event, 'threeProbability')"
          @blur="probabilityBlur"
          placeholder="请输入惊喜款概率"
          class="w400"
        ></el-input>
      </el-form-item>
      <el-form-item label="超值款概率" prop="fourProbability">
        <el-input
          :value="dataForm.fourProbability"
          type="number"
          @focus="probabilityFocus('fourProbability')"
          @input="probabilityChange($event, 'fourProbability')"
          @blur="probabilityBlur"
          placeholder="请输入超值款概率"
          class="w400"
        ></el-input>
      </el-form-item>
      <div class="flex-align tips mb20">剩余：{{ surplus }}</div>
      <div class="block">
        <el-form-item label="至尊款虚拟概率" prop="oneProbabilityOther">
          <el-input
            :value="dataForm.oneProbabilityOther"
            type="number"
            @input="virtualProbabilityChange($event, 'oneProbabilityOther')"
            placeholder="请输入至尊款概率"
            class="w400"
          ></el-input>
        </el-form-item>
        <el-form-item label="稀有款虚拟概率" prop="twoProbabilityOther">
          <el-input
            :value="dataForm.twoProbabilityOther"
            type="number"
            @input="virtualProbabilityChange($event, 'twoProbabilityOther')"
            placeholder="请输入稀有款概率"
            class="w400"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="惊喜款虚拟概率" prop="threeProbabilityOther">
        <el-input
          :value="dataForm.threeProbabilityOther"
          type="number"
          @input="virtualProbabilityChange($event, 'threeProbabilityOther')"
          placeholder="请输入惊喜款概率"
          class="w400"
        ></el-input>
      </el-form-item>
      <el-form-item label="超值款虚拟概率" prop="fourProbabilityOther">
        <el-input
          :value="dataForm.fourProbabilityOther"
          type="number"
          @input="virtualProbabilityChange($event, 'fourProbabilityOther')"
          placeholder="请输入超值款概率"
          class="w400"
        ></el-input>
      </el-form-item>
    </el-form>
    <BoxCard
      class="mb20 mt30"
      ref="boxCard"
      :allBoxList="allBoxList"
      :boxId="boxId"
      :tableData="tableList"
      v-for="item of probabilitys"
      :title="item.title"
      :key="item.title"
      @boxChange="getAllBoxList"
      @search="getAllComList"
    />

    <OpenTheBox ref="openBoxRef" />
  </div>
</template>

<style lang="scss" scoped>
.block {
  display: block !important;
}
.w60 {
  width: 60px;
}
.w400 {
  width: 400px;
}
.w100 {
  width: 100%;
}
.mb20 {
  margin-bottom: 20px;
}
.mt30 {
  margin-top: 30px;
}
.btn {
  margin: 20px 0;
  justify-content: space-between;
}
.tips {
  margin-left: 140px;
  color: rgb(156, 152, 152);
}
</style>
