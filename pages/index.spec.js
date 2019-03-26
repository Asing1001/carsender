import { shallowMount } from '@vue/test-utils'
import HomePage from './index.vue'

describe('HomePage', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(HomePage)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
