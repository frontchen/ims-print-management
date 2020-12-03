// 缓存前缀
const prefix = 'ims'

// localStorage
const localKey = {}

// sessionStorage
const sessionKey = {
  vuexStore: `${prefix}-session-store` // vuex刷新缓存
}

const storeKey = {
  ...localKey,
  ...sessionKey
}

export default storeKey
