export const tableOption = {
  border: true,
  selection: false,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 350,
  align: 'center',
  refreshBtn: false,
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
  column: [
    {
      label: '名称',
      prop: 'name',
      search: true,
      searchSpan: 4
    },
    {
      label: '展示位置',
      prop: 'position',
      type: 'select',
      search: true,
      searchSpan: 4,
      dicData: [
        { label: '顶部banner', value: 2 },
        { label: '中部banner', value: 7 }
      ],
      slot: true
    },
    {
      label: '图片',
      prop: 'imgUrl',
      type: 'upload',
      slot: true,
      listType: 'picture-img'
    },
    {
      label: '上线时间',
      prop: 'startTime',
      searchSpan: 7,
      search: true
    },
    {
      label: '下线时间',
      prop: 'endTime',
      slot: true
    },
    {
      width: 150,
      label: '状态',
      prop: 'status',
      search: true,
      slot: true,
      searchSpan: 4,
      type: 'select',
      dicData: [
        {
          label: '上线',
          value: 1
        }, {
          label: '下线',
          value: 0
        }
      ]
    }]
}
