export const tableOption = {
  border: true,
  selection: false,
  stripe: true,
  menuAlign: 'center',
  menuWidth: 350,
  align: 'center',
  refreshBtn: true,
  searchSize: 'mini',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  searchMenuSpan: 6,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [
    {
      label: '商品编号',
      prop: 'goodsId'
    },
    {
      label: '商品品类',
      prop: 'goodsCategoryId',
      slot: true,
      search: true,
      type: 'select',
      column: []
    },
    {
      label: '商品名称',
      prop: 'goodsName',
      search: true
    },
    {
      label: '商品库存',
      prop: 'stock'
    },
    {
      label: '商品价格',
      prop: 'price',
      search: true,
      hide: true
    },
    {
      label: '前端展示价格',
      prop: 'goodsPrice'
    }]
}
