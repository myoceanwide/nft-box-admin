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
  searchMenuSpan: 4,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [
    {
      label: '用户手机',
      prop: 'phoneNumber',
      searchSpan: 5,
      search: true
    },
    {
      label: '订单编号',
      prop: 'orderNumber',
      searchSpan: 5,
      search: true
    },
    {
      label: '订单名称',
      prop: 'itemName'
    },
    {
      label: '订单时间',
      prop: 'time',
      search: true,
      searchSpan: 8,
      hide: true
    },
    {
      label: '订单实付金额',
      prop: 'payAmount'
    }, {
      label: '支付账户金额',
      prop: 'payAccountAmount'
    },
    {
      label: '退款支付金额',
      prop: 'refundAmount'
    },
    {
      label: '退款账户金额',
      prop: 'refundAccountAmount'
    },
    {
      label: '下单时间',
      prop: 'addTime'
    }
  ]
}
