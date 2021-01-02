<template>
  <div class="ims-com-search-bar" :style="searchBgColor">
    <div class="search-bar-container">
      <div class="leftWrapper">
        <slot name="left">
          <el-button
            v-if="showSearchBtn"
            :class="searchBtnCls"
            @click="search"
            >{{ title }}</el-button
          >
          <div
            :class="rowCls(item.className)"
            v-for="(item, index) in searchList"
            :key="index"
          >
            <!-- label -->
            <label
              v-if="
                item.label && item.type !== 'button' && item.type !== 'text'
              "
              >{{ item.label }}</label
            >
            <!-- input -->
            <el-input
              :style="conWidthStyles(item.width)"
              v-if="item.type === 'input'"
              v-model="item.value"
              :type="item.attr.type"
              :placeholder="item.attr.placeholder"
              :clearable="item.attr.clearable"
              :disabled="item.attr.disabled"
              :readonly="item.attr.readonly"
              :minlength="item.attr.minlength"
              :maxlength="item.attr.maxlength"
              :autocomplete="item.attr.autocomplete"
              :min="item.attr.min"
              :max="item.attr.max"
              :show-password="item.attr.showPassword"
              :size="item.attr.size"
              :prefix-icon="item.attr.prefixIcon"
              :suffix-icon="item.attr.suffixIcon"
              :rows="item.attr.rows"
              :autosize="item.attr.autosize"
              :step="item.attr.step"
              :resize="item.attr.resize"
              :autofocus="item.attr.autofocus"
              :label="item.attr.label"
              :tabindex="item.attr.tabindex"
              @change="onQueryChange(item.name, $event)"
            />
            <!-- select -->
            <el-select
              :style="conWidthStyles(item.width)"
              v-if="item.type === 'select'"
              v-model="item.value"
              :placeholder="item.attr.placeholder"
              :multiple="item.attr.multiple"
              :disabled="item.attr.disabled"
              :clearable="item.attr.clearable"
              :filterable="item.attr.filterable"
              :remote="item.attr.remote"
              :remote-method="item.attr.remoteMethod"
              :filter-method="item.attr.filterMethod"
              :loading="item.attr.loading"
              :loading-text="item.attr.loadingText"
              :label="item.attr.label"
              :no-match-text="item.attr.notFoundText"
              :label-in-value="item.attr.labelInValue"
              :reserve-keyword="item.attr.reserveKeyWord"
              :no-data-text="item.attr.noDataText"
              :popper-class="item.attr.popperClass"
              :size="item.attr.size"
              @change="onChange(item.name, $event)"
              v-loadmore="item.attr.loadMore"
            >
              <el-option
                v-for="(option, oi) in item.attr.options"
                :label="option.label"
                :value="option.value"
                :disabled="option.disabled"
                :key="oi"
                >{{ option.label }}</el-option
              >
            </el-select>
            <!-- cascader -->
            <el-cascader
              :style="conWidthStyles(item.width)"
              v-if="item.type === 'cascader'"
              :options="item.attr.options"
              v-model="item.value"
              :props="getCascaderProps(item)"
              @change="onCascaderChange(index, arguments)"
              v-loadmore="item.attr.loadMore"
            ></el-cascader>
            <!-- datepicker -->
            <el-date-picker
              :style="conWidthStyles(item.width)"
              class="ims-date-picker"
              v-if="item.type === 'datepicker'"
              v-model="item.value"
              :type="item.attr.type"
              :format="item.attr.format"
              :placeholder="item.attr.placeholder"
              :picker-options="item.attr.options"
              :start-date="item.attr.startDate"
              :confirm="item.attr.confirm"
              :disabled="item.attr.disabled"
              :clearable="item.attr.clearable"
              :readonly="item.attr.readonly"
              :editable="item.attr.editable"
              :size="item.attr.size"
              :start-placeholder="item.attr.startPlaceholder"
              :end-placeholder="item.attr.endPlaceholder"
              :align="item.attr.align"
              :popper-class="item.attr.popperClass"
              :range-separator="item.attr.rangeSeparator"
              :default-value="item.attr.defaultValue"
              :default-time="item.attr.defaultTime"
              :value-format="item.attr.valueFormat"
              :unlink-panels="item.attr.unlinkPanels"
              :prefix-icon="item.attr.prefixIcon"
              :clear-icon="item.attr.clearIcon"
            >
            </el-date-picker>
            <!-- button -->
            <el-button
              v-if="item.type === 'button'"
              :size="item.attr.size"
              :type="item.attr.buttonType"
              :plain="item.attr.plain"
              :round="item.attr.round"
              :circle="item.attr.circle"
              :loading="item.attr.loading"
              :disabled="item.attr.disabled"
              :icon="item.attr.icon"
              @click="openModal(item.attr)"
              >{{ item.label }}</el-button
            >

            <!-- text -->
            <div
              :style="conWidthStyles(item.width)"
              class="text"
              v-if="item.type === 'text'"
            >
              {{ `${item.label}` }} <span>{{ `${item.value}` }}</span>
            </div>
          </div>
        </slot>
      </div>
      <div class="rightWrapper">
        <slot name="right">
          <div class="row" v-for="(item, index) in rightList" :key="index">
            <!-- label -->
            <label
              v-if="
                item.label && item.type !== 'button' && item.type !== 'text'
              "
              >{{ item.label }}</label
            >
            <!-- input -->
            <el-input
              :style="conWidthStyles(item.width)"
              v-if="item.type === 'input'"
              v-model="item.value"
              :type="item.attr.type"
              :placeholder="item.attr.placeholder"
              :clearable="item.attr.clearable"
              :disabled="item.attr.disabled"
              :readonly="item.attr.readonly"
              :minlength="item.attr.minlength"
              :maxlength="item.attr.maxlength"
              :autocomplete="item.attr.autocomplete"
              :min="item.attr.min"
              :max="item.attr.max"
              :show-password="item.attr.showPassword"
              :size="item.attr.size"
              :prefix-icon="item.attr.prefixIcon"
              :suffix-icon="item.attr.suffixIcon"
              :rows="item.attr.rows"
              :autosize="item.attr.autosize"
              :step="item.attr.step"
              :resize="item.attr.resize"
              :autofocus="item.attr.autofocus"
              :label="item.attr.label"
              :tabindex="item.attr.tabindex"
              @change="onQueryChange(item.name, $event)"
            />
            <!-- select -->
            <el-select
              :style="conWidthStyles(item.width)"
              v-if="item.type === 'select'"
              v-model="item.value"
              :placeholder="item.attr.placeholder"
              :multiple="item.attr.multiple"
              :disabled="item.attr.disabled"
              :clearable="item.attr.clearable"
              :filterable="item.attr.filterable"
              :remote="item.attr.remote"
              :remote-method="item.attr.remoteMethod"
              :filter-method="item.attr.filterMethod"
              :loading="item.attr.loading"
              :loading-text="item.attr.loadingText"
              :label="item.attr.label"
              :no-match-text="item.attr.notFoundText"
              :label-in-value="item.attr.labelInValue"
              :reserve-keyword="item.attr.reserveKeyWord"
              :no-data-text="item.attr.noDataText"
              :popper-class="item.attr.popperClass"
              @change="onRightChange(item.name, $event)"
              v-loadmore="item.attr.loadMore"
            >
              <el-option
                v-for="(option, oi) in item.attr.options"
                :label="option.label"
                :value="option.value"
                :disabled="option.disabled"
                :key="oi"
                >{{ option.label }}</el-option
              >
            </el-select>
            <!-- date -->
            <el-date-picker
              :style="conWidthStyles(item.width)"
              class="ims-date-picker"
              v-if="item.type === 'datepicker'"
              v-model="item.value"
              :type="item.attr.type"
              :format="item.attr.format"
              :placeholder="item.attr.placeholder"
              :picker-options="item.attr.options"
              :start-date="item.attr.startDate"
              :confirm="item.attr.confirm"
              :disabled="item.attr.disabled"
              :clearable="item.attr.clearable"
              :readonly="item.attr.readonly"
              :editable="item.attr.editable"
              :size="item.attr.size"
              :start-placeholder="item.attr.startPlaceholder"
              :end-placeholder="item.attr.endPlaceholder"
              :align="item.attr.align"
              :popper-class="item.attr.popperClass"
              :range-separator="item.attr.rangeSeparator"
              :default-value="item.attr.defaultValue"
              :default-time="item.attr.defaultTime"
              :value-format="item.attr.valueFormat"
              :unlink-panels="item.attr.unlinkPanels"
              :prefix-icon="item.attr.prefixIcon"
              :clear-icon="item.attr.clearIcon"
            >
            </el-date-picker>
            <!-- text -->
            <div
              :style="conWidthStyles(item.width)"
              class="text"
              v-if="item.type === 'text'"
            >
              {{ `${item.label}` }}<span>{{ `${item.value}` }}</span>
            </div>
            <!-- button -->
            <el-button
              v-if="item.type === 'button'"
              :size="item.attr.size"
              :type="item.attr.type"
              :plain="item.attr.plain"
              :round="item.attr.round"
              :circle="item.attr.circle"
              :loading="item.attr.loading"
              :disabled="item.attr.disabled"
              :icon="item.attr.icon"
              :autofocus="item.attr.autofocus"
              @click="item.attr.onClick"
              >{{ item.label }}</el-button
            >

            <!-- cascader -->
            <el-cascader
              :style="conWidthStyles(item.width)"
              v-if="item.type === 'cascader'"
              :options="item.attr.options"
              v-model="item.value"
              :props="getCascaderProps(item)"
              @change="onCascaderChange(index, arguments)"
              v-loadmore="item.attr.loadMore"
            ></el-cascader>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
// 递归级联数据
function getCascaderData(valuesList, dataList, res) {
  for (let i = 0; i < valuesList.length; i++) {
    let index = dataList.findIndex(val => {
      return val.value === valuesList[i]
    })
    if (index >= 0) {
      res.push({
        label: dataList[index].label,
        value: dataList[index].value
      })
      valuesList.splice(i, 1)
      dataList = dataList[index].children
      if (dataList && dataList.length > 0) {
        getCascaderData(valuesList, dataList, res)
      }
      return false
    }
  }
}
export default {
  name: 'ims-com-search-bar',
  props: {
    title: {
      type: String,
      default: '查询'
    },
    showSearchBtn: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    values: {
      type: Object,
      default() {
        return {}
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    right: {
      type: Object,
      default() {
        return {
          values: [],
          data: []
        }
      }
    },
    backgroundColor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: ''
    }
  },
  computed: {
    rowCls() {
      return className => {
        return [
          {
            row: true,
            [className]: className ? true : false
          }
        ]
      }
    },
    conWidthStyles() {
      return width => {
        // let vm = this
        if (!width) return ''
        let conWidth = ''
        // let conWidth = `${vm.conWidth}px`
        if (width && typeof width === 'number') {
          conWidth = `${width}px`
        }
        let style = {
          width: conWidth
        }
        return style
      }
    },
    searchBtnCls() {
      return [
        'search-button',
        {
          ['search-button-disabled']: this.disabled
        }
      ]
    },
    searchList: {
      get() {
        let vm = this
        // 过滤隐藏项
        let list = vm.data.filter(val => {
          return val.disabled === true
        })
        // 绑定默认值
        if (vm.values) {
          list.forEach(v => {
            Object.keys(vm.values).forEach(val => {
              if (v.name === val) {
                v.value = vm.values[val] || ''
              }
            })
          })
        }
        return list
      },
      set(val) {
        return val
      }
    },
    rightList: {
      get() {
        let vm = this
        // 过滤隐藏项
        let list = vm.right.data.filter(val => {
          return val.disabled === true
        })
        // 绑定默认值
        let values = vm.right.values
        if (values) {
          list.forEach(v => {
            Object.keys(values).forEach(val => {
              if (v.name === val) {
                v.value = values[val] !== null ? values[val] : ''
              }
            })
          })
        }
        return list
      },
      set(val) {
        return val
      }
    },
    searchBgColor() {
      if (!this.backgroundColor) {
        return {}
      }
      return {
        backgroundColor: this.backgroundColor
      }
    },
    classes() {
      return iconName => {
        return `search-icon imsfont ${iconName || ''}`
      }
    },
    dateTitle() {
      return item => {
        let title = ''
        let format = 'YYYY-MM-DD'
        const type = item.attr.type || 'date'
        if (type === 'datetimerange' || type === 'datetime') {
          format = 'YYYY-MM-DD HH:mm:ss'
        }
        if (type.indexOf('range') !== -1) {
          // 区间
          if (item.value.length && item.value[0]) {
            title = `${this.$ims.filters.formatDate(item.value[0], {
              format: format
            })} - ${this.$ims.filters.formatDate(item.value[1], {
              format: format
            })}`
          }
        } else {
          title = this.$ims.filters.formatDate(item.value || '', {
            format: format
          })
        }
        return title
      }
    },
    dateIconCls() {
      return item => {
        let icon = ''
        const type = item.attr.type || 'date'
        if (type.indexOf('range') !== -1) {
          // 区间
          icon =
            item.value.length && item.value[0]
              ? 'icon-calendar-checked'
              : 'icon-calendar'
        } else {
          // 日期
          icon = item.value ? 'icon-calendar-checked' : 'icon-calendar'
        }
        return `search-icon imsfont ${icon}`
      }
    }
  },
  methods: {
    hanldeClickDatePicker(index, item) {
      let vm = this
      let open = !item.attr.open
      vm.$set(vm.searchList[index].attr, 'open', open)
      vm.$set(vm.searchList[index].attr, 'confirm', true)
    },
    handleChangeDatePicker(index, date) {
      let vm = this
      vm.$set(vm.searchList[index], 'value', date)
    },
    handleCloseDatePicker(index) {
      let vm = this
      vm.$set(vm.searchList[index].attr, 'open', false)
    },
    getCascaderProps(item) {
      return {
        size: item.attr.size,
        placeholder: item.attr.placeholder,
        disabled: item.attr.disabled,
        clearable: item.attr.clearable,
        showAllLevels: item.attr.showAllLevels,
        collapseTags: item.attr.collapseTags,
        separator: item.attr.separator,
        filterable: item.attr.filterable,
        filterMethod: item.attr.filterMethod,
        debounce: item.attr.debounce,
        beforeFilter: item.attr.beforeFilter,
        expandTrigger: item.attr.expandTrigger,
        multiple: item.attr.multiple,
        checkStrictly: item.attr.checkStrictly,
        emitPath: item.attr.emitPath,
        lazy: item.attr.lazy,
        lazyLoad: item.attr.lazyLoad,
        value: item.attr.value,
        label: item.attr.label,
        children: item.attr.children
      }
    },
    search() {
      let vm = this
      if (vm.disabled) return false
      let values = {}
      let typeNonList = ['text', 'button']
      vm.searchList.forEach(v => {
        if (v.name && typeNonList.indexOf(v.type) === -1) {
          values[v.name] = v.value || ''
          if (v.attr.labelInValue && v.type === 'cascader') {
            let cascaderVal = []
            let value = _.cloneDeep(v.value)
            getCascaderData(value, v.attr.data, cascaderVal)
            values[v.name] = cascaderVal
          }
        }
      })
      vm.$emit('on-search', values)
    },
    openModal(attr) {
      if (attr.disabled) {
        return false
      }
      this.$emit('on-button', attr.type)
    },
    getLabelValue(index, value) {
      let vm = this
      let item = vm.searchList[index]
      if (item.attr.labelInValue) {
        item.values = value
      }
      vm.searchList[index] = item
    },
    // 隐藏搜索项
    disableSearch(ls) {
      let vm = this
      let disabledList = ls
      if (!disabledList) {
        disabledList = []
      }
      // 设置隐藏项
      vm.data.forEach(v => {
        v.disabled = true
        disabledList.forEach(val => {
          if (v.name === val) {
            v.disabled = false
          }
        })
      })
      // 过滤隐藏项
      let list = vm.data.filter(val => {
        return val.disabled === true
      })
      // 绑定默认值
      if (vm.values) {
        list.forEach(v => {
          Object.keys(vm.values).forEach(val => {
            if (v.name === val) {
              v.value = vm.values[val] || ''
            }
          })
        })
      }
      vm.searchList = list
    },
    // 隐藏右侧菜单
    disableSearchRight(ls) {
      let vm = this
      let disabledList = ls
      if (!disabledList) {
        disabledList = []
      }
      // 设置隐藏项
      vm.right.data.forEach(v => {
        v.disabled = true
        disabledList.forEach(val => {
          if (v.name === val) {
            v.disabled = false
          }
        })
      })
      // 过滤隐藏项
      let list = vm.right.data.filter(val => {
        return val.disabled === true
      })
      // 绑定默认值
      if (vm.values) {
        list.forEach(v => {
          Object.keys(vm.right.values).forEach(val => {
            if (v.name === val) {
              v.value = vm.right.values[val] || ''
            }
          })
        })
      }
      vm.rightList = list
    },
    onChange(name, val) {
      this.$emit('on-change', {
        name,
        value: val
      })
    },
    onQueryChange(name, query) {
      this.$emit('on-query-change', {
        name,
        value: query
      })
    },
    onClear(name) {
      this.$emit('on-clear', {
        name
      })
    },
    onRightChange(name, val) {
      let vm = this
      vm.$emit('on-right-change', {
        name,
        value: val
      })
    },
    onRightQueryChange(name, query) {
      let vm = this
      vm.$emit('on-right-query-change', {
        name,
        value: query
      })
    },
    onCascaderChange(index, args) {
      // args [value, selectData]
      let vm = this
      // vm.getLabelValue(index, args[1])
      let val = args[0]
      let item = vm.searchList[index]
      let name = item.name || 'key'
      if (item.attr.labelInValue) {
        val = args[1]
        item.values = args[1]
      }
      vm.searchList[index] = item
      vm.$emit('on-change', {
        name,
        value: val
      })
    },
    onRightCascaderChange(index, args) {
      let vm = this
      let val = args[0]
      let item = vm.rightList[index]
      if (item.attr.labelInValue) {
        // item.values = args[1]
        val = args[1]
      }
      // vm.rightList[index] = item
      vm.$emit('on-right-change', {
        name: item.name,
        value: val
      })
    },
    onScrollBottom(name, val) {
      let item = ''
      if (val) {
        item = val
      }
      this.$emit('on-scroll-bottom', {
        name,
        data: item
      })
    },
    onRightScrollBottom(name, val) {
      let item = ''
      if (val) {
        item = val
      }
      this.$emit('on-right-scroll-bottom', {
        name,
        data: item
      })
    }
  },
  watch: {
    title(newProp) {
      this.title = newProp
    },
    disabled(newProp) {
      this.disabled = newProp
    },
    values(val) {
      this.values = val
    },
    data(val) {
      this.searchList = val
    },
    'right.data'(val) {
      this.rightList = val
    },
    'right.values'(val) {
      this.rightData = val
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/main.less';
@import '../styles/components/search';
</style>
