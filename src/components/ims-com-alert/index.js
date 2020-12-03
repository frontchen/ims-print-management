import Vue from 'vue'
import { Button, Icon, Dialog } from 'element-ui'

const prefixCls = 'ims-com-alert'

const Alert = (_props = {}) => {
  let newProps = {}
  Object.keys(_props).forEach(v => {
    if (typeof _props[v] !== 'function' || v === 'render') {
      newProps[v] = _props[v]
    }
  })

  const Instance = new Vue({
    data: Object.assign(
      {},
      {
        visibale: false,
        title: '',
        content: '',
        width: 388,
        height: 200,
        okText: '确认',
        cancelText: '取消',
        showCancel: true,
        showClose: true,
        loading: false,
        scrollable: false,
        closable: false,
        render: undefined
      },
      newProps
    ),
    render(h) {
      let closeRender
      if (this.showClose) {
        closeRender = h(
          'a',
          {
            attrs: { class: `${prefixCls}-close` },
            on: {
              click: this.close
            }
          },
          [h(Icon, { props: { type: 'ios-close' } })]
        )
      }
      let headRender
      if (this.title) {
        headRender = h(
          'div',
          {
            attrs: { class: `${prefixCls}-head` }
          },
          [
            h('div', {
              attrs: { class: `${prefixCls}-head-title` },
              domProps: { innerHTML: this.title }
            })
          ]
        )
      }

      let bodyRender
      if (this.render) {
        bodyRender = h(
          'div',
          {
            attrs: { class: `${prefixCls}-body ${prefixCls}-body-render` }
          },
          [this.render(h)]
        )
      } else {
        bodyRender = h(
          'div',
          {
            attrs: { class: `${prefixCls}-body` }
          },
          [h('div', { domProps: { innerHTML: this.content } })]
        )
      }

      let footerRender = []

      if (this.showCancel) {
        footerRender.push(
          h(
            Button,
            {
              on: {
                click: this.cancel
              }
            },
            this.cancelText
          )
        )
      }
      footerRender.push(
        h(
          Button,
          {
            on: {
              click: this.ok
            }
          },
          this.okText
        )
      )

      return h(
        Dialog,
        {
          props: Object.assign({}, _props, {
            title: '',
            lockScroll: this.scrollable,
            showClose: this.closable,
            maskClosable: false,
            footerHide: true,
            customClass: `${prefixCls}`,
            width: this.width,
            styles: {
              height: `${this.height}px`
            }
          }),
          domProps: {
            value: this.visibale
          },
          on: {
            input: status => {
              this.visibale = status
            }
          }
        },
        [
          h(
            'div',
            {
              style: {
                height: `${this.height}px`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
              }
            },
            [closeRender, headRender, bodyRender]
          ),
          h('div', { attrs: { class: `${prefixCls}-footer` } }, footerRender)
        ]
      )
    },
    methods: {
      close() {
        this.$children[0].visible = false
        this.remove()
      },
      cancel() {
        this.close()
        this.onCancel()
      },
      ok() {
        this.close()
        this.onOk()
      },
      remove() {
        setTimeout(() => {
          this.destroy()
        }, 300)
      },
      destroy() {
        this.$destroy()
        document.body.removeChild(this.$el)
        this.onRemove()
      },
      onOk() {},
      onCancel() {},
      onRemove() {}
    }
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)
  const modal = Instance.$children[0]

  if ('width' in _props) {
    modal.$parent.width = _props.width
  }
  if ('closable' in _props) {
    modal.$parent.closable = _props.closable
  }
  if ('loading' in _props) {
    modal.$parent.loading = _props.loading
  }
  if ('scrollable' in _props) {
    modal.$parent.scrollable = _props.scrollable
  }
  if ('onCancel' in _props) {
    modal.$parent.onCancel = _props.onCancel
  }
  if ('onOk' in _props) {
    modal.$parent.onOk = _props.onOk
  }
  if ('showClose' in _props) {
    modal.$parent.showClose = _props.showClose
  }
  if ('showCancel' in _props) {
    modal.$parent.showCancel = _props.showCancel
  }

  modal.visible = true
}

export default Alert
