export default {
  namespaced: true,
  state: {
    categoryList: [] // 商品品类列表
  },
  mutations: {
    setCategoryList (state, list) {
      state.categoryList = list
    }
  }
}
