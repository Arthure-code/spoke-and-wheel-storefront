import router from '../src/router/index.js'

describe('router', () => {
  it('resolves the three pages', () => {
    expect(router.resolve('/').name).toBe('home')
    expect(router.resolve('/products').name).toBe('products')
    expect(router.resolve('/products/7')).toMatchObject({ name: 'product', params: { id: '7' } })
  })

  it('loads the catalogue and the product views when first visited', async () => {
    await router.push('/products')
    await router.isReady()
    expect(router.currentRoute.value.name).toBe('products')

    await router.push({ name: 'product', params: { id: 2 } })
    expect(router.currentRoute.value.path).toBe('/products/2')
  })
})
