import { flushPromises, mount } from '@vue/test-utils'
import App from '../src/App.vue'
import * as ProductService from '../src/services/ProductService.js'
import { products } from './products.js'
import { makeRouter } from './router.js'

// The service is replaced by a stub, so no fetch happens; the router is
// real, on a memory history.
vi.mock('../src/services/ProductService.js')

async function mountAt(path) {
  const router = makeRouter()
  router.push(path)
  await router.isReady()
  const wrapper = mount(App, { global: { plugins: [router] } })
  await flushPromises()
  return { wrapper, router }
}

beforeEach(() => {
  ProductService.getProducts.mockResolvedValue(products)
  ProductService.getProduct.mockImplementation(async (id) => products.find((p) => p.id === Number(id)) ?? null)
})

describe('App', () => {
  it('shows Home at / with a menu of two entries', async () => {
    const { wrapper } = await mountAt('/')

    expect(wrapper.find('h1').text()).toBe('Home')
    expect(wrapper.findAll('nav .nav-link').map((a) => a.text())).toEqual(['Home', 'Products'])
    expect(wrapper.find('[data-testid=product]').exists()).toBe(false)
  })

  it('the Products link shows the catalogue fetched from the service', async () => {
    const { wrapper, router } = await mountAt('/')

    await wrapper.find('[data-testid=nav-products]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/products')
    expect(ProductService.getProducts).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('[data-testid=product]')).toHaveLength(5)
    expect(wrapper.find('[data-testid=nav-products]').classes()).toContain('router-link-active')
  })

  it('clicking a bike goes to its page, which fetches that bike by id', async () => {
    const { wrapper, router } = await mountAt('/products')

    await wrapper.findAll('[data-testid=product]')[2].trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/products/3')
    expect(ProductService.getProduct).toHaveBeenCalledWith('3')
    expect(wrapper.find('[data-testid=detail-name]').text()).toBe('Cosmic Cobat 2015')
  })

  it('the back link of a product page returns to the catalogue', async () => {
    const { wrapper, router } = await mountAt('/products/2')

    expect(wrapper.find('[data-testid=detail-name]').text()).toBe('City XT 2015')

    await wrapper.find('[data-testid=back]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/products')
    expect(wrapper.findAll('[data-testid=product]')).toHaveLength(5)
  })
})
