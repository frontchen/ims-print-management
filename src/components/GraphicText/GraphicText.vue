<template>
  <div class="graphic-text">
    <div class="graphic-product">
      <div class="product-left" v-if="showImg">

        <img :src="image.path" v-if="!image.render" />
        <Expand v-else :render="image.render"></Expand>
      </div>
      <div class="product-right">
        <div v-for="(item, index) in data" :key="index">
          <div class="product-right-item" v-if="!item.render">
            <div v-if="(item.list || []).length">
              <span v-for="(v, i) in item.list || []" :key="i">{{ v }}<span v-if="v" class="dot"></span></span>
            </div>
          </div>
          <div class="product-right-item" v-else>
            <Expand :row="item.data || {}" :index="index" :render="item.render"></Expand>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Expand from './expand'

export default {
  name: 'graphic-text',
  components: { Expand },
  props: {
    trigger: {
      type: String,
      default: 'hover'
    },
    disabled: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    transfer: {
      type: Boolean,
      default: true
    },
    showImg: {
      type: Boolean,
      default: true
    },
    image: {
      type: Object,
      default: () => {
        return { path: '' }
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
@import './graphic-text';
</style>
