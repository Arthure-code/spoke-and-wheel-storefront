import { flushPromises, mount } from '@vue/test-utils'
import ProductsView from '../src/views/ProductsView.vue'
import ProductView from '../src/views/ProductView.vue'
import * as ProductService from '../src/services/ProductService.js'
import { products } from './products.js'
import { makeRouter } from './router.js'

vi.mock('../src/services/ProductService.js')

async function mountWithRouter(component, props = {}) {
  const router = makeRouter()
  router.push('/')
  await router.isReady()
  return mount(component, { props, global: { plugins: [router] } })
}

describe('ProductsView', () => {
  it('says it is loading, then shows the catalogue the service returned', async () => {
    ProductService.getProducts.mockResolvedValue(products)
    const wrapper = await mountWithRouter(ProductsView)

    expect(wrapper.find('[data-testid=loading]').exists()).toBe(true)

    await flushPromises()

    expect(wrapper.find('[data-testid=loading]').exists()).toBe(false)
    expect(wrapper.findAll('[data-testid=product]')).toHaveLength(5)
    expect(ProductService.getProducts).toHaveBeenCalledTimes(1)
  })

  it('shows the error when the service fails', async () => {
    ProductService.getProducts.mockRejectedValue(new Error('The catalogue could not be loaded (503).'))
    const wrapper = await mountWithRouter(ProductsView)

    await flushPromises()

    expect(wrapper.find('[data-testid=error]').text()).toBe('The catalogue could not be loaded (503).')
    expect(wrapper.find('[data-testid=product]').exists()).toBe(false)
  })
})

describe('ProductView', () => {
  it('fetches the bike whose id is in the route and shows its detail', async () => {
    ProductService.getProduct.mockResolvedValue(products[3])
    const wrapper = await mountWithRouter(ProductView, { id: '4' })

    await flushPromises()

    expect(ProductService.getProduct).toHaveBeenCalledWith('4')
    expect(wrapper.find('[data-testid=detail-name]').text()).toBe('Hero DTB 2016')
    expect(wrapper.find('[data-testid=detail-price]').text()).toBe('Price: 759.00 $')
  })

  it('says so when the id matches no bike', async () => {
    ProductService.getProduct.mockResolvedValue(null)
    const wrapper = await mountWithRouter(ProductView, { id: '99' })

    await flushPromises()

    expect(wrapper.find('[data-testid=error]').text()).toBe('There is no bike number 99.')
    expect(wrapper.find('[data-testid=detail-name]').exists()).toBe(false)
  })

  it('shows the error when the service fails', async () => {
    ProductService.getProduct.mockRejectedValue(new Error('The catalogue could not be loaded (500).'))
    const wrapper = await mountWithRouter(ProductView, { id: '1' })

    await flushPromises()

    expect(wrapper.find('[data-testid=error]').text()).toBe('The catalogue could not be loaded (500).')
  })
})
