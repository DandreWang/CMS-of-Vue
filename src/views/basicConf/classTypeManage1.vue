<template>
  <div class="app-full-page">
    <div class="app-search-conatiner">
      <div class="app-search-space">
        <!-- 搜索表单 -->
        <base-form v-bind="formOptions">
          <el-form-item slot="append">
            <z-button @click="searchHandler">本地搜索</z-button>
            <z-button @click="staticResets({opt:'formOptions',cb:setTableData})">重置</z-button>
            <z-button @click="staticResets1()">重置1</z-button>
          </el-form-item>
        </base-form>
      </div>
    </div>
    <div class="app-table-space">
      <div class="app-table-space-padding">
        <!-- 表格 -->
        <table-pagination ref="maintable" v-bind="maintable" @selection-change="handleSelectionChange">
          <!--&lt;!&ndash;          <el-row>&ndash;&gt;-->
          <!--&lt;!&ndash;            <z-button icon="el-icon-refresh" @click="handleData()">开始迁移</z-button>&ndash;&gt;-->
          <!--&lt;!&ndash;          </el-row>&ndash;&gt;-->
        </table-pagination>
        <!--        <el-table-->
        <!--          ref="maintable"-->
        <!--          :data="maintable.data"-->
        <!--          tooltip-effect="dark"-->
        <!--          style="width: 100%"-->
        <!--          @selection-change="handleSelectionChange">-->
        <!--          <el-table-column-->
        <!--            type="selection"-->
        <!--            width="55">-->
        <!--          </el-table-column>-->
        <!--          <el-table-column-->
        <!--            label="日期"-->
        <!--            width="120">-->
        <!--            <template slot-scope="scope">{{ scope.row.date }}</template>-->
        <!--          </el-table-column>-->
        <!--          <el-table-column-->
        <!--            prop="name"-->
        <!--            label="姓名"-->
        <!--            width="120">-->
        <!--          </el-table-column>-->
        <!--          <el-table-column-->
        <!--            prop="address"-->
        <!--            label="地址"-->
        <!--            show-overflow-tooltip>-->
        <!--          </el-table-column>-->
        <!--        </el-table>-->
      </div>
    </div>
  </div>
</template>

<script>
import BaseForm from '@/components/BaseForm'
import TablePagination from '@/components/TablePagination'

// 搜索表单
const formOptions = {
  inline: true,
  ref: 'form',
  forms: []
}

// 表格
const maintable = {
  columns: [
    { type: 'selection', width: 60 },
    { prop: 'name', label: '集群名称', width: 200 },
    { prop: 'clusterType', label: '集群类型', width: 150 },
    { prop: 'bootstraps', label: '启动地址', width: 250 },
    { prop: 'ips', label: '服务地址', width: 280 },
    { prop: 'version', label: '版本' }
  ],
  data: [{
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
    id: 1
  }, {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
    id: 2
  }, {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
    id: 3
  }, {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
    id: 4
  }],
  // loadKey: 'queryClusters'
}

export default {
  name: 'XlusterTransfer',
  components: { BaseForm, TablePagination },
  data() {
    return {
      formOptions,
      maintable,
      selections: []
    }
  },
  mounted() {
    // this.loadTabledata()
  },
  methods: {
    // ...mapActions([
    //   'queryClusters'
    // ]),
    // 加载表格数据
    async loadTabledata(params = {}) {
      const { queryClusters, setTableData } = this
      const { result } = await queryClusters(params)
      this.staticResults = result
      setTableData(result)
    },
    // 查询
    searchHandler() {
      const { handleValidate, formOptions, staticFilter, setTableData } = this
      handleValidate({
        options: formOptions,
        cb(value) {
          const _result = staticFilter(value)
          setTableData(_result)
        }
      })
    },
    // 选中存值
    handleSelectionChange(val) {
      // this.selections = val
    },
    // 设置maintable data
    setTableData(value) {
      this.maintable.data = value
      this.toggleSelection(this.selections)
    },
    toggleSelection(rows) {
      this.$nextTick(() => {
        console.log(this.$refs.maintable.gettable())
        const table = this.$refs.maintable.gettable()
        if (rows.length) {
          // rows.forEach(row => {
          table.toggleRowSelection([maintable.data[0]], true)
          // table.toggleRowSelection(row, true)
          // })
        } else {
          table.clearSelection()
        }
      })
    },
    staticResets() {
      this.toggleSelection([maintable.data[0]])
    },
    toggleSelection1(rows) {
      this.$nextTick(() => {
        if (rows.length) {
          rows.forEach(row => {
            this.$refs.maintable.toggleRowSelection(row, true)
          })
        } else {
          this.$refs.maintable.clearSelection()
        }
      })
    },
    staticResets1() {
      this.toggleSelection1([this.maintable.data[0]])
    }
  }
}
</script>
