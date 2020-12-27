import moment from 'moment'
const filters = {
  // 格式化序号
  serialNumber: (num, options = { bits: 3, identifier: '0' }) => {
    num = num * 1
    if (isNaN(num)) {
      return ''
    }
    let value = (options.identifier || '0').repeat(options.bits || 3) + num
    return value.slice(-options.bits || 3)
  },
  currency: (val, options = { prefix: '¥', fixed: 2, format: false }) => {
    let money = val * 1
    if (isNaN(money)) {
      if (typeof val === 'string') {
        return val
      }
      // money = 0
      return ''
    }
    const fixed = options.fixed || 2
    money = money.toFixed(fixed)
    const ph = new Array(fixed + 1).join('0')
    const moneyArr = money.split('.')
    let cents = (moneyArr[1] || '') + ph
    cents = cents.substring(0, fixed)
    let moneyInt = moneyArr[0]
    if (options.format) {
      moneyInt = (moneyArr[0] * 1).toLocaleString('en-US')
    }
    money = `${moneyInt}.${cents}`
    let prefix = options.prefix
    if (prefix === undefined) prefix = '¥'
    return `${prefix}${money}`
  },
  // 格式化日期
  formatDate: (val, options = { format: 'YYYY-MM-DD', isDate: false }) => {
    if (!val) {
      return ''
    }
    let date = moment(val).format(options.format)
    if (options.isDate) {
      return moment(date)
    }
    return date
  }
}
export default filters
