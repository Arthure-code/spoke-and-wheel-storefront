import { mount } from '@vue/test-utils'
import ProductDetail from '../src/components/ProductDetail.vue'
import { products } from './products.js'

describe('ProductDetail', () => {
  it('renders every field of the bike and its picture on the right', () => {
    const product = { ...products[2], imageUrl: 'https://example.test/cobat.jpg' }
    const wrapper = mount(ProductDetail, { props: { product } })

    expect(wrapper.find('[data-testid=detail-name]').text()).toBe('Cosmic Cobat 2015')
    expect(wrapper.find('[data-testid=detail-description]').text()).toBe('Great bike.')
    expect(wrapper.find('[data-testid=detail-price]').text()).toBe('Price: 499.90 $')
    expect(wrapper.find('[data-testid=detail-fixed-price]').text()).toBe('Fixed price? No')
    expect(wrapper.find('[data-testid=detail-discontinued]').text()).toBe('Discontinued? No')
    expect(wrapper.find('[data-testid=detail-modified-date]').text()).toBe('Modified date: 2015-05-17')

    const picture = wrapper.find('[data-testid=detail-picture]')
    expect(picture.attributes('src')).toBe('https://example.test/cobat.jpg')
    expect(picture.attributes('alt')).toBe('Cosmic Cobat 2015')
    expect(picture.attributes('width')).toBe('200')
    expect(picture.classes()).toContain('float-end')
  })

  it('says Yes in red when the bike is discontinued, and Yes for a fixed price', () => {
    const product = { ...products[1], fixedPrice: true }
    const wrapper = mount(ProductDetail, { props: { product } })

    expect(wrapper.find('[data-testid=detail-fixed-price]').text()).toBe('Fixed price? Yes')
    expect(wrapper.find('[data-testid=detail-discontinued]').text()).toBe('Discontinued? Yes')
    expect(wrapper.find('[data-testid=detail-discontinued]').classes()).toContain('text-danger')
  })
})
