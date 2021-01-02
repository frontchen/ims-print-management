<template>
  <el-dialog
    :title="title"
    :width="width"
    :visible="isOpen"
    :close-on-click-modal="maskClosable"
    :show-close="closable"
    :modal="true"
    :custom-class="modalCls"
    @open="modalVisibleChange"
    @close="close"
  >
    <div>
      <slot>
        <el-form
          :label-width="labelWidth"
          :label-position="labelPosition"
          :model="formValidate"
          :inline="inline"
          :rules="ruleValidate"
          ref="form"
        >
          <el-row
            v-for="(row, index) in modalList"
            type="flex"
            align="middle"
            :key="index"
          >
            <el-col
              :class="rowCls(item)"
              v-for="(item, i) in row"
              :key="i"
              :span="colSpan"
            >
              <el-form-item :label="item.label" :prop="item.name">
                <!-- input -->
                <el-input
                  :style="conWidthStyles(item.width)"
                  v-if="item.type === 'input'"
                  v-model.trim="item.value"
                  :type="item.attr.type"
                  :placeholder="item.attr.placeholder"
                  :clearable="item.attr.clearable"
                  :disabled="item.attr.disabled"
                  :readonly="item.attr.readonly"
                  :autosize="item.attr.autosize"
                  :maxlength="item.attr.maxlength"
                  :minlength="item.attr.minlength"
                  :show-password="item.attr.showPassword"
                  :size="item.attr.size || 'mini'"
                  :prefix-icon="item.attr.prefixIcon"
                  :suffix-icon="item.attr.suffixIcon"
                  :rows="item.attr.rows"
                  :autocomplete="item.attr.autocomplete"
                  :name="item.attr.name"
                  :max="item.attr.max"
                  :min="item.attr.min"
                  :step="item.attr.step"
                  :resize="item.attr.resize"
                  :autofocus="item.attr.autofocus"
                  :form="item.attr.form"
                  :label="item.attr.label"
                  :tabindex="item.attr.tabindex"
                  :validate-event="item.attr.validateEvent"
                  @on-change="selectOnChange(index, i, $event)"
                >
                  <span v-if="item.attr.prefix" slot="prefix">{{
                    item.attr.prefix
                  }}</span>
                  <span v-if="item.attr.suffix" slot="suffix">{{
                    item.attr.suffix
                  }}</span>
                  <span
                    v-if="item.attr.append && !item.attr.appendName"
                    slot="append"
                    >{{ item.attr.append }}</span
                  >
                  <el-select
                    v-if="item.attr.append && item.attr.appendName"
                    v-model="item.attr.appendValue"
                    :disabled="item.attr.disabled"
                    slot="append"
                    :style="`width:${item.attr.appendWidth || 60}px`"
                  >
                    <el-option
                      v-for="(appItem, ai) in item.attr.appendOptions"
                      :key="ai"
                      :value="appItem.value"
                      :label="appItem.label"
                    ></el-option>
                  </el-select>
                </el-input>
                <span class="textarea-num" v-if="item.attr.isNumber">{{
                  `${item.attr.txtVal || 0}/${item.attr.maxlength}`
                }}</span>
                <!-- select -->
                <el-select
                  :style="conWidthStyles(item.width)"
                  v-if="item.type === 'select'"
                  v-model="item.value"
                  :inputable="item.attr.inputable"
                  :poptip="item.attr.poptip"
                  :placeholder="item.attr.placeholder"
                  :multiple="item.attr.multiple"
                  :disabled="item.attr.disabled"
                  :clearable="item.attr.clearable"
                  :filterable="item.attr.filterable"
                  :remote="item.attr.remote"
                  :remote-method="item.attr.remoteMethod"
                  :loading="item.attr.loading"
                  :loading-text="item.attr.loadingText"
                  :label="item.attr.label"
                  :no-match-text="item.attr.notFoundText"
                  :no-data-text="item.attr.notDataText"
                  :label-in-value="item.attr.labelInValue"
                  :reserve-keyword="item.attr.reserveKeyword"
                  :value-key="item.attr.valueKey"
                  :size="item.attr.size || 'mini'"
                  :collapse-tags="item.attr.collapseTags"
                  :multiple-limit="item.attr.multipleLimit"
                  :name="item.attr.name"
                  :autocomplete="item.attr.autocomplete"
                  :allow-create="item.attr.allowCreate"
                  :filter-method="item.attr.filterMethod"
                  :popper-class="item.attr.popperClass"
                  :default-first-option="item.attr.defaultFirstOption"
                  :popper-append-to-body="item.attr.popperAppendToBody"
                  :automatic-dropdown="item.attr.automaticDropdown"
                  @change="selectOnChange(index, i, $event)"
                  @on-query-change="selectOnQueryChange(item.name, $event)"
                  v-loadmore="item.attr.loadMore"
                  :ref="`select${index}${i}`"
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
                  :ref="item.name"
                  :options="item.attr.data"
                  v-model="item.value"
                  :poptip="item.attr.poptip"
                  :render-format="item.attr.renderFormat"
                  :disabled="item.attr.disabled"
                  :clearable="item.attr.clearable"
                  :placeholder="item.attr.placeholder"
                  :show-all-levels="item.attr.showAllLevels"
                  :load-data="item.attr.loadData"
                  :filterable="item.attr.filterable"
                  :not-found-text="item.attr.notFoundText"
                  :props="item.attr.props"
                  :collapse-tags="item.attr.collapseTags"
                  :separator="item.attr.separator"
                  :filter-method="item.attr.filterMethod"
                  :size="item.attr.size || 'mini'"
                  :debounce="item.attr.debounce"
                  :before-filter="item.attr.beforeFilter"
                  :popper-class="item.attr.popperClass"
                  @change="cascaderOnChange(arguments, index, i)"
                  v-loadmore="item.attr.loadMore"
                ></el-cascader>
                <!-- date -->
                <el-date-picker
                  :style="conWidthStyles(item.width)"
                  v-if="item.type === 'date'"
                  v-model="item.value"
                  :type="item.attr.type"
                  :format="item.attr.format"
                  :placeholder="item.attr.placeholder"
                  :options="item.attr.options"
                  :multiple="item.attr.multiple"
                  :start-date="item.attr.startDate"
                  :size="item.attr.size || 'mini'"
                  :confirm="item.attr.confirm"
                  :disabled="item.attr.disabled"
                  :clearable="item.attr.clearable"
                ></el-date-picker>
                <!-- time -->
                <el-date-picker
                  :style="conWidthStyles(item.width)"
                  v-if="item.type === 'datetime'"
                  v-model="item.value"
                  :less-than="item.attr.lessThan"
                  :type="item.attr.type"
                  :format="item.attr.format"
                  :size="item.attr.size || 'mini'"
                  :placeholder="item.attr.placeholder"
                  :confirm="item.attr.confirm"
                  :disabled="item.attr.disabled"
                  :clearable="item.attr.clearable"
                ></el-date-picker>
                <!-- text -->
                <div
                  :style="conWidthStyles(item.width)"
                  class="text"
                  v-if="item.type === 'text'"
                >
                  <span v-if="item.value">{{ item.value }}</span>
                  <span v-else class="text-placeholder">{{
                    item.attr.placeholder
                  }}</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </slot>
    </div>
    <div slot="footer">
      <slot name="footer">
        <el-button type="text" size="large" @click="modalCancel"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          @click="modalOk"
          >{{ loading ? loadingText : '确定' }}</el-button
        >
      </slot>
    </div>
  </el-dialog>
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
  name: 'pos-com-modal',
  props: {
    maskClosable: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: true
    },
    className: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    col: {
      type: Number,
      default: 0
    },
    labelPosition: {
      type: String,
      default: 'left'
    },
    labelWidth: {
      type: String,
      default: '80'
    },
    ruleValidate: {
      type: Object,
      default() {
        return {}
      }
    },
    conWidth: {
      type: Number,
      default: 140
    },
    draggable: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '520'
    },
    height: {
      type: [Number, String],
      default: 0
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    values: {
      type: Object,
      default() {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '正在提交'
    },
    scale: {
      type: Number,
      default: 1 // 1. 16:9  2. 4:3
    }
  },
  data() {
    return {
      isOpen: this.value,
      isChangeValue: false
    }
  },
  computed: {
    modalCls() {
      let mcls = 'ims-modal'
      if (this.isOpen) {
        if (this.className) {
          mcls += ` ${this.className}`
        }
      }
      return mcls
    },
    rowCls() {
      return item => {
        return [
          {
            [`${item.className}`]: item.className ? true : false,
            ['modal-item-disabled']: item.attr.disabled ? true : false
          }
        ]
      }
    },
    conWidthStyles() {
      return width => {
        let vm = this
        let conWidth = `${vm.conWidth}px`
        if (width && typeof width === 'number') {
          conWidth = `${width}px`
        }
        let style = {
          width: conWidth
        }
        return style
      }
    },
    bodyStyles() {
      let vm = this
      // header 33 footer 83  body padding 16
      let minHeight = `${Math.trunc((vm.width * 9) / 16 - 33 - 83 - 16 * 2)}px`
      if (vm.scale === 2) {
        minHeight = `${Math.trunc((vm.width * 3) / 4 - 33 - 83 - 16 * 2)}px`
      }
      // custom height
      if (vm.height > 0) {
        minHeight = `${vm.height}px`
      }
      let style = {
        minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%'
      }
      return style
    },
    colSpan() {
      let vm = this
      return Math.trunc(24 / vm.col)
    },
    formValidate() {
      let vm = this
      let form = {}
      // 格式化数据
      vm.data.forEach(v => {
        form[v.name] = v.value
      })
      return form
    },
    modalList() {
      let vm = this
      // 绑定默认值
      let dataList = vm.data
      dataList.forEach(v => {
        const item = Object.keys(vm.values).find(val => val === v.name)
        if (item) {
          if (!vm.isChangeValue) {
            v.value = vm.values[item] || ''
          }
          if (v.type === 'input') {
            if (v.attr.append && typeof v.attr.append === 'boolean') {
              if (v.attr.appendName === item) {
                v.attr.appendValue = vm.values[item] || ''
              }
            }
            if (v.attr.isNumber && v.value) {
              v.attr.txtVal = v.value.length
            }
          }
        }
      })
      vm.isChangeValue = true
      let list = _.chain(dataList)
        .chunk(vm.col)
        .value()
      return list
    }
  },

  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    modalVisibleChange() {
      this.$nextTick(() => {
        this.isOpen = true
        this.$emit('input', this.isOpen)
      })
    },
    // 获取所需数据的键值
    getLabelVaule(item) {
      let val = item.value || ''
      // 普通数据直接返回
      if (!item.attr.labelInValue) {
        return val
      }
      // select cascader 选中数据
      if (item.values) {
        return item.values
      }
      // select 默认数据返回
      if (item.type === 'select') {
        // 多选
        if (item.multiple) {
          let values = []
          item.value.forEach(v => {
            item.attr.options.forEach(value => {
              if (value.value === v) {
                values.push(value)
              }
            })
          })
          val = values
        } else {
          // 单选
          let si = item.attr.options.findIndex(option => {
            return option.value === item.value
          })
          val = item.attr.options[si] || ''
        }
      }
      if (item.type === 'cascader') {
        let values = []
        getCascaderData(item.value, item.attr.data, values)
        val = values
      }
      return val
    },

    modalOk() {
      let vm = this
      let values = {}
      // 解构数据
      let dataList = _.chain(vm.modalList)
        .flatten()
        .value()
      // 获取数据结果
      dataList.forEach(v => {
        if (v.name) {
          values[v.name] = vm.getLabelVaule(v)
          if (
            v.type === 'input' &&
            v.attr.append &&
            typeof v.attr.append === 'boolean'
          ) {
            let appendOptions = v.attr.appendOptions.find(option => {
              return option.value === v.attr.appendValue
            })
            let val = appendOptions || ''
            values[v.attr.appendName] = val
          }
        }
      })
      vm.$emit('on-ok', values)
      // 手动关闭
      // this.isOpen = false
    },
    modalCancel() {
      this.$nextTick(() => {
        this.isOpen = false
        this.$emit('input', this.isOpen)
      })
    },
    close() {
      this.$nextTick(() => {
        this.isOpen = false
        this.$emit('input', this.isOpen)
      })
    },
    getLabelValue(index, subIndex, value) {
      let vm = this
      let item = vm.modalList[index][subIndex]
      if (item.attr.labelInValue) {
        item.values = value
        // if (item.type === 'cascader') {
        // 	let values = []
        // 	getCascaderData(item.value, item.attr.data, values)
        // 	item.values = values
        // }
      }
      vm.modalList[index][subIndex] = item
    },
    selectOnChange(index, subIndex, value) {
      let vm = this
      this.getLabelValue(index, subIndex, value)
      let iv = vm.modalList[index][subIndex]
      let name = iv.name || 'key'

      if (iv.attr.isNumber) {
        vm.modalList[index][subIndex].attr.txtVal = iv.value.length
      }
      vm.$emit('on-change', { name, value })
    },
    selectOnQueryChange(name, query) {
      let vm = this
      vm.$emit('on-query-change', { name, value: query })
    },
    cascaderOnChange(args, index, subIndex) {
      // args [value, selectData]
      let vm = this
      let val = args[0]
      let item = vm.modalList[index][subIndex]
      let name = item.name || 'key'
      if (item.attr.labelInValue) {
        val = args[1]
      }
      if (item.attr.props && item.attr.props.checkStrictly) {
        vm.$refs[name].dropDownVisible = false
      }
      vm.$emit('on-change', { name, value: val })
    },
    onScrollBottom(name, val) {
      let item = ''
      if (val) {
        item = val
      }
      this.$emit('on-scroll-bottom', { name, data: item })
    },
    // 表单验证 - 验证
    validate(callback) {
      return this.$refs.form.validate(callback)
    },
    // 表单验证 - 部分验证
    validateField(callback) {
      this.$refs.form.validateField(callback)
    },
    // 表单验证 - 重置
    resetFields() {
      const vm = this
      const col = vm.col

      vm.data.forEach((v, i) => {
        v.value = vm.formValidate[v.label]
        // 清除可输可选项
        if (v.attr.inputable && v.attr.clearable) {
          let refSelect = `select${Math.ceil((i + 1) / col) - 1}${col -
            ((i + 1) % col) -
            1}`
          vm.$refs[refSelect][0].clearSingleSelect()
        }
        // 清除文本域数据统计
        if (v.attr.isNumber && v.attr.txtVal) {
          v.attr.txtVal = 0
        }
      })
      vm.isChangeValue = true
      vm.$refs.form.resetFields()
    },
    initCascader() {
      //点击文本就让它自动点击前面的input就可以触发选择。但是因组件阻止了冒泡，暂时想不到好方法来触发。
      //这种比较耗性能，暂时想不到其他的，能实现效果了。
      this.timer = setInterval(function() {
        document.querySelectorAll('.el-cascader-node__label').forEach(el => {
          el.onclick = function() {
            if (this.previousElementSibling) this.previousElementSibling.click()
          }
        })
      }, 1000)
    }
  },
  watch: {
    value(val) {
      this.isOpen = val
      if (!val) {
        this.timer && clearInterval(this.timer)
        this.timer = null
      } else {
        this.initCascader()
      }
    },
    values() {
      this.isChangeValue = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/components/modal.less';
/deep/.el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 !important;
  transform: translate(-50%, -50%);
  max-height: calc(100%-30px);
  max-width: calc(100%-30px);
  display: flex;
  flex-direction: column;
  .el-dialog__body {
    overflow: auto;
    color: #666666;
  }
}
</style>
