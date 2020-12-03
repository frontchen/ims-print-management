<template>
  <el-row type="flex" class="submenu" align="middle">
    <el-col :span="12" v-if="breadPath.length">
      {{ breadPath[breadPath.length - 1].name }}
    </el-col>
    <el-col :span="12">
      <el-breadcrumb class="com-main-header-bread" :separator="separator">
        <el-breadcrumb-item
          v-for="(item, index) in breadPath"
          :to="item.path"
          :replace="item.replace"
          :key="index"
        >
          <Icon v-if="item.icon" :iconType="item.icon" />
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
  </el-row>
</template>

<script>
import Icon from '@/components/Icon'
export default {
  components: { Icon },
  name: 'submenu',
  data() {
    return {}
  },
  computed: {
    // 面包屑路径
    breadPath() {
      let breadcrumbList = this.breadList

      return breadcrumbList
    }
  },
  methods: {},
  props: {
    separator: {
      type: String,
      default() {
        return '/'
      }
    },
    breadList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    rootBread(val) {
      if (val) {
        this.rootBread = val
      }
    },
    breadList(val) {
      this.breadList = val
    }
  }
}
</script>

<style lang="less" scoped>
@import './submenu';
</style>
