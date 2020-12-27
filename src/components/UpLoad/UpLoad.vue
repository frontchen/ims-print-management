<template>
  <div class="wistar-upload">
    <el-upload
      :class="{ avatar_uploader: true, avatar_disabled: disabled }"
      :action="action"
      :disabled="disabled"
      :list-type="listType"
      :file-list="formatList(imgList)"
      :http-request="upLoad"
      :on-preview="handlePictureCardPreview"
      :on-success="onSuccess"
      :on-remove="removeImg"
      :on-change="upLoadChange"
      :limit="limit"
      :with-credentials="withCredentials"
      :show-file-list="showFileList"
      :drag="drag"
      :accept="formatAccept"
      :on-exceed="onExceed"
    >
      <i class="el-icon-plus avatar_uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl || ''" alt />
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import store from '@/store/index'
export default {
  data() {
    return {
      ossToken: '',
      dialogVisible: false,
      dialogImageUrl: '',
      upLoadApi: `${process.env.VUE_APP_API}:${process.env.VUE_APP_API_PORT}/api/upload`
    }
  },
  props: {
    accept: {
      type: String,
      default: ''
    },
    avatar_disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    fileType: {
      type: String,
      default: 'image'
    },
    action: {
      type: String,
      default: () => {
        return `${process.env.VUE_APP_API}:${process.env.VUE_APP_API_PORT}/upload`
      }
    },
    headers: {
      type: Object,
      default: () => {
        return {}
      }
    },
    name: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    multiple: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    withCredentials: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    showFileList: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    drag: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    listType: {
      type: String,
      default: () => {
        return 'picture-card'
      }
    },
    onSuccess: {
      type: Function
    },
    onChange: {
      type: Function
    },
    onRemove: {
      type: Function
    },
    onExceed: {
      type: Function
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    limit: {
      type: Number,
      default: () => {
        return 4
      }
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    formatAccept() {
      let vm = this
      let suffix = ''
      let image = '.png,.jpg,.jpeg,.gif,.bmp'
      let media = '.mp4,.mpeg,.mpg,.avi,.mov,.wmv,.mkv,.flv,.mp3,.wave,.wma'
      let file = '.pdf,.pptx,.docx,.xlsx,.ppt,.doc,.xls,.txt,.zip,.rar'
      let all = `${image},${media},${file}`
      switch (vm.fileType) {
        case 'image':
          suffix = image
          break
        case 'media':
          suffix = media
          break
        case 'file':
          suffix = file
          break
        case 'all':
          suffix = all
          break
      }
      return suffix
    },
    imgList() {
      let list = []
      if (this.fileList.length) {
        list = this.fileList
      }
      return list
    }
  },
  methods: {
    formatList(list) {
      return list.map(item => {
        let url = item.url
        if (url && url.substring(0, 4) !== 'http') {
          item.url = `${process.env.VUE_APP_API}${item.url}`
        }

        return item
      })
    },
    upLoad(file) {
      const vm = this

      let files = file.file
      //file.file上传文件的内容
      let token = store.state.account.token || ''
      let headers = {
        'Content-Type': 'multipart/form-data',
        token
      }
      let instance = axios.create({
        timeout: 60 * 1000, // 请求超时时间设置 15s
        withCredentials: false //  带cookie请求
      })
      let params = new FormData()
      params.append('file', files)
      params.append('fileType', vm.fileType)
      instance.post(vm.upLoadApi, params, { headers }).then(
        res => {
          console.log(['data', res])
          if (res.status === 200) {
            let data = res.data
            if (data.code * 1 === 200) {
              let result = data.data
              //下面是如果对返回结果再进行处理，根据项目需要
              vm.dialogImageUrl = result.url
              vm.imgList.push({
                ...files,
                url: result.url
              })

              vm.$emit('onSuccess', vm.imgList)
              vm.$message({
                message: '上传成功',
                type: 'success'
              })
            } else {
              vm.$message.error(data.msg)
            }
          } else {
            vm.$message.error(res.statusText)
          }
        },
        err => {
          vm.$message.error(err.msg || '网络请求超时')
        }
      )
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      console.log(['dialogImageUrl', file, this.dialogImageUrl])
      this.dialogVisible = true
      this.$emit('onPreview')
    },
    removeImg(file) {
      if (this.imgList.length) {
        let index = this.imgList.findIndex(v => v.uid === file.uid)
        if (index > -1) {
          this.imgList.splice(index, 1)
        }
      }
      this.$emit('onRemove', this.imgList)
    },
    upLoadChange() {
      this.$emit('onChange', this.imgList)
    },
    displayCard(val) {
      let el = document.querySelector('.wistar-upload')
      let pictureCard = el.querySelector('.el-upload--picture-card')
      if (val * 1 === this.imgList.length && this.imgList.length !== 0) {
        pictureCard.style.display = 'none'
      } else {
        pictureCard.style.display = 'inline-block'
      }
    }
  },
  watch: {
    limit(val) {
      this.displayCard(val)
    },
    imgList: {
      handler() {
        this.displayCard(this.limit)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .avatar_uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
  &.avatar_disabled {
    .el-upload:hover {
      border-color: none;
      cursor: not-allowed;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-upload-list--picture-card {
    .el-upload-list__item {
      width: 100px;
      height: 100px;
    }
  }

  .avatar_uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
}
</style>
