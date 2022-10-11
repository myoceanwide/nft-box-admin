export const tableOption = {
  border: true,
  // selection: true,
  index: false,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 350,
  align: 'center',
  refreshBtn: true,
  searchSize: 'mini',
  searchMenuSpan: 4,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [{
    label: '手机号码',
    prop: 'phoneNumber',
    search: true
  },
  {
    label: '账户金额',
    prop: 'accountAmount'
  },
  {
    label: '用户消费总额',
    prop: 'payAmount'
  },
  {
    label: '总退款金额',
    prop: 'refundAmount'
  },
  {
    label: '注册时间',
    prop: 'addTime'
  }]
}
