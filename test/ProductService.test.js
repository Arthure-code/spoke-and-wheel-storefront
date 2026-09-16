import { getProduct, getProducts } from '../src/services/ProductService.js'
import { products } from './products.js'

// The service is the only code that calls fetch; fetch is replaced by a
// stub that answers with the catalogue, or with an error status.
const answer = (body, ok = true, status = 200) =>
  vi.fn().mockResolvedValue({ ok, status, json: () => Promise.resolve(body) })

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ProductService', () => {
  it('getProducts returns the whole catalogue from the API URL', async () => {
    vi.stubGlobal('fetch', answer(products))

    const result = await getProducts()

    expect(result).toEqual(products)
    expect(fetch).toHaveBeenCalledWith('/api/products.json')
  })

  it('getProduct returns the product with that id, whether the id is a string or a number', async () => {
    vi.stubGlobal('fetch', answer(products))

    expect(await getProduct('3')).toEqual(products[2])
    expect(await getProduct(5)).toEqual(products[4])
  })

  it('getProduct returns null for an id that is not in the catalogue', async () => {
    vi.stubGlobal('fetch', answer(products))

    expect(await getProduct('99')).toBeNull()
  })

  it('throws with the status when the API does not answer 2xx', async () => {
    vi.stubGlobal('fetch', answer(null, false, 503))

    await expect(getProducts()).rejects.toThrow('The catalogue could not be loaded (503).')
  })
})
