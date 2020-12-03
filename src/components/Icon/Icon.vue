<template>
  <i :class="{[type]:true,pos_font:true}"></i>
</template>

<script>
export default {
  props: {
    iconType: {
      type: String,
      default() {
        return ''
      }
    }
  },
  computed: {
    type() {
      return this.iconType
    }
  },
  watch: {
    iconType(val) {
      this.type = val
    }
  },
}
</script>

<style lang="scss" scoped>
.pos_font {
  font-size: 14px;
}
</style>