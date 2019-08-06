<template>
  <div :class="autoheight?'autoheight tablewrap':'tablewrap'">
    <div class="table-header" v-if="menurow">
      <div class="table-header-padding clearboth">
        <slot />
      </div>
    </div>
    <div class="table-body">
      <div class="table-body-padding">
        <el-table
          ref="table"
          :data="tableData"
          :border="border"
          :size="size"
          :stripe="stripe"
          :height="height"
          :max-height="maxHeight"
          :fit="fit"
          :show-header="showHeader"
          :highlight-current-row="highlightCurrentRow"
          :current-row-key="currentRowKey"
          :row-class-name="rowClassName"
          :row-style="rowStyle"
          :row-key="rowKey"
          :empty-text="emptyText"
          :default-expand-all="defaultExpandAll"
          :expand-row-keys="expandRowKeys"
          :default-sort="defaultSort"
          :tooltip-effect="tooltipEffect"
          :show-summary="showSummary"
          :sum-text="sumText"
          :summary-method="summaryMethod"
          :style="tableStyle"
          @select="(selection, row) => emitEventHandler('select', selection, row)"
          @select-all="selection => emitEventHandler('select-all', selection,ref)"
          @selection-change="selection => emitEventHandler('selection-change', selection)"
          @cell-mouse-enter="(row, column, cell, event) => emitEventHandler('cell-mouse-enter', row, column, cell, event)"
          @cell-mouse-leave="(row, column, cell, event) => emitEventHandler('cell-mouse-leave', row, column, cell, event)"
          @cell-click="(row, column, cell, event) => emitEventHandler('cell-click', row, column, cell, event)"
          @cell-dblclick="(row, column, cell, event) => emitEventHandler('cell-dblclick', row, column, cell, event)"
          @row-click="(row, event, column) => emitEventHandler('row-click', row, event, column)"
          @row-dblclick="(row, event) => emitEventHandler('row-dblclick', row, event)"
          @row-contextmenu="(row, event) => emitEventHandler('row-contextmenu', row, event)"
          @header-click="(column, event) => emitEventHandler('header-click', column, event)"
          @sort-change="args => emitEventHandler('sort-change', args)"
          @filter-change="filters => emitEventHandler('filter-change', filters)"
          @current-change="(currentRow, oldCurrentRow) => emitEventHandler('current-change', currentRow, oldCurrentRow)"
          @header-dragend="(newWidth, oldWidth, column, event) => emitEventHandler('header-dragend', newWidth, oldWidth, column, event)"
          @expand-change="(row, expanded) => emitEventHandler('expand-change', row, expanded)" >

            <slot name="prepend" />
            <template v-for="(column, columnIndex) in columns">
              <slot name="insert"  v-if="columnIndex===insertNum"/>
              <slot name="insert2"  v-if="columnIndex===insertNum2"/>
              <el-table-column v-bind="column" :key="columnIndex" align="center" />
            </template>
            <slot name="append" />
        </el-table>
      </div>
    </div>
     <div class="table-footer">
        <div class="table-footer-padding clearboth">
          <div v-if="isPagination" >
            <el-pagination
              :current-page="pagination.pageIndex"
              :page-sizes="pageSizes"
              :page-size="pagination.pageSize"
              :layout="paginationLayout"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"/>
          </div>
        </div>
    </div>
    <slot name="bottom" />
  </div>


</template>
<script>
import Vue from 'vue'
import props from './props'
import { mapGetters } from 'vuex'

export default {
  name: 'TablePagination',
  props,
  data() {
    const _this = this
    return {
      Vue,
      pagination: {
        pageIndex: 1,
        pageSize: (() => {
          const { pageSizes } = _this
          return pageSizes.length > 0 ? pageSizes[0] : 20
        })()
      },
      total: 0,
      tableData: [],
      cacheLocalData: []
    }
  },
  computed: {
    ...mapGetters(['getLoading'])
  },
  watch: {
    data: function(value) {
      this.loadLocalData(value)
    }
  },
  mounted() {
    this.$refs['table'].$on('expand', (row, expanded) => this.emitEventHandler('expand', row, expanded))
    const { data } = this
    this.loadLocalData(data)
  },
  methods: {
    // 页数据改变
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.dataFilterHandler()
    },
    // 改变当前页面
    handleCurrentChange(pageIndex) {
      this.pagination.pageIndex = pageIndex
      this.dataFilterHandler()
    },
    dataFilterHandler(formParams) {
      const { cacheLocalData } = this
      this.total = cacheLocalData.length
      this.tableData = this.dataFilter(cacheLocalData)
    },
    dataFilter(data) {
      const { isPagination, pagination: { pageIndex, pageSize }} = this
      if (!isPagination) return data
      return data.filter((v, i) => {
        return i >= (pageIndex - 1) * pageSize && i < pageIndex * pageSize
      })
    },
    emitEventHandler(event) {
      this.$emit(event, ...Array.from(arguments).slice(1))
      // debugger
    },
    loadLocalData(data) {
      if (!data) {
        throw new Error(`you must set attribute 'data' and 'data' must be a array.`)
      }
      const cacheData = JSON.parse(JSON.stringify(data))
      if (this.dataHandler && cacheData) {
        this.cacheLocalData = cacheData.map(this.dataHandler)
      }
      this.cacheLocalData = cacheData
      this.tableData = this.dataFilter(cacheData)
      this.total = cacheData.length
    },
    toggleSelection(rows) {
      this.$nextTick(() => {
        if (rows.length) {
          rows.forEach(row => {
            // this.tableData.forEach(tr => {
            //   if(tr) {
            //     this.$refs.table.toggleRowSelection(tr, true)
            this.$refs.table.toggleRowSelection(row, true)
            //   }
            // })
          })
        } else {
          this.$refs.table.clearSelection()
        }
      })
    },
    gettable() {
      return this.$refs.table
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .tablewrap{
    height:100%
  }
 .autoheight{
   height:auto;
    .el-table__body-wrapper{
      height:auto!important;
    }
    .app-table-space-padding{
      overflow: auto!important;
    }
  }
</style>
