const message = {
  default: {
    top: 360,
    duration: 3
  },
  success: options => {
    if (!options.vm) return false
    let config = {}
    Object.assign(config, message.default, {
      content: options.content || '操作完成'
    })
    options.vm.$Message.destroy()
    options.vm.$Message.success(config)
  },
  warning: options => {
    if (!options.vm) return false
    let config = {}
    Object.assign(config, message.default, {
      content: options.content
    })
    options.vm.$Message.destroy()
    options.vm.$Message.warning(config)
  },
  error: options => {
    if (!options.vm) return false
    let config = {}
    Object.assign(config, message.default, {
      content: options.content
    })
    options.vm.$Message.destroy()
    options.vm.$Message.error(config)
  }
}

export default message
