import { mount } from '@vue/test-utils'
import ProductList from '../src/components/ProductList.vue'
import { products } from './products.js'

// Black box, as the Vue guide asks: props and clicks go in, rendered text,
// classes and emitted events come out. Elements are found by data-testid.
const productSelector = '[data-testid=product]'
const searchSelector = '[data-testid=search]'
const pageSelector = '[data-testid=page]'
const nextSelector = '[data-testid=next]'
const previousSelector = '[data-testid=previous]'

const names = (wrapper) => wrapper.findAll(productSelector).map((row) => row.find('span').text())

describe('ProductList rows', () => {
  it('renders name, description and price with two decimals', () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 5 } })

    const cells = wrapper.find(productSelector).findAll('span').map((cell) => cell.text())

    expect(cells).toEqual(['Trek SSL 2017', 'Racing bike.', '999.90 $'])
  })

  it('marks the discontinued bike and the selected bike with a class each', () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 5, selected: products[2] } })

    const rows = wrapper.findAll(productSelector)

    expect(rows[1].classes()).toContain('discontinued')
    expect(rows[2].classes()).toContain('selected')
    expect(rows[2].attributes('aria-pressed')).toBe('true')
    expect(rows.filter((row) => row.classes().includes('selected'))).toHaveLength(1)
  })

  it('emits select with the bike clicked', async () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 5 } })

    await wrapper.findAll(productSelector)[3].trigger('click')

    expect(wrapper.emitted('select')[0]).toEqual([products[3]])
  })
})

describe('ProductList search', () => {
  it('keeps the names that match, case-insensitive', async () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 5 } })

    await wrapper.find(searchSelector).setValue('cO')
    expect(names(wrapper)).toEqual(['Cosmic Cobat 2015'])

    await wrapper.find(searchSelector).setValue('2015')
    expect(names(wrapper)).toEqual(['City XT 2015', 'Cosmic Cobat 2015'])
  })

  it('says so when nothing matches', async () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 2 } })

    await wrapper.find(searchSelector).setValue('zzz')

    expect(wrapper.findAll(productSelector)).toHaveLength(0)
    expect(wrapper.find('[data-testid=no-match]').text()).toBe('No bike matches that name.')
    expect(wrapper.find(pageSelector).text()).toBe('Page 1 of 1')
  })
})

describe('ProductList sort', () => {
  it('sorts ascending on the first click, descending on the second', async () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 5 } })
    const priceButton = wrapper.find('[data-testid=sort-price]')

    await priceButton.trigger('click')
    expect(names(wrapper)).toEqual(['Cosmic Cobat 2015', 'City XT 2015', 'Hero DTB 2016', 'Trek SSL 2017', 'S-WORKS 2016'])
    expect(priceButton.text()).toBe('Price ↑')
    expect(priceButton.attributes('aria-pressed')).toBe('true')

    await priceButton.trigger('click')
    expect(names(wrapper)[0]).toBe('S-WORKS 2016')
    expect(priceButton.text()).toBe('Price ↓')
  })

  it('sorts by name and by date, and a new button starts ascending again', async () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 5 } })

    await wrapper.find('[data-testid=sort-name]').trigger('click')
    expect(names(wrapper)[0]).toBe('City XT 2015')

    await wrapper.find('[data-testid=sort-name]').trigger('click')
    expect(names(wrapper)[0]).toBe('Trek SSL 2017')

    await wrapper.find('[data-testid=sort-date]').trigger('click')
    expect(names(wrapper)).toEqual(['City XT 2015', 'Cosmic Cobat 2015', 'Hero DTB 2016', 'S-WORKS 2016', 'Trek SSL 2017'])
    expect(wrapper.find('[data-testid=sort-name]').text()).toBe('Name')
  })

  it('sorts the filtered list, not the whole catalogue', async () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 5 } })

    await wrapper.find(searchSelector).setValue('2016')
    await wrapper.find('[data-testid=sort-price]').trigger('click')
    await wrapper.find('[data-testid=sort-price]').trigger('click')

    expect(names(wrapper)).toEqual(['S-WORKS 2016', 'Hero DTB 2016'])
  })
})

describe('ProductList pagination', () => {
  it('shows two bikes a page when the parent says so and counts the pages', () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 2 } })

    expect(names(wrapper)).toEqual(['Trek SSL 2017', 'City XT 2015'])
    expect(wrapper.find(pageSelector).text()).toBe('Page 1 of 3')
  })

  it('moves with Next and Previous and disables them at the ends', async () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 2 } })

    expect(wrapper.find(previousSelector).attributes('disabled')).toBeDefined()
    expect(wrapper.find(nextSelector).attributes('disabled')).toBeUndefined()

    await wrapper.find(nextSelector).trigger('click')
    expect(names(wrapper)).toEqual(['Cosmic Cobat 2015', 'Hero DTB 2016'])

    await wrapper.find(nextSelector).trigger('click')
    expect(names(wrapper)).toEqual(['S-WORKS 2016'])
    expect(wrapper.find(pageSelector).text()).toBe('Page 3 of 3')
    expect(wrapper.find(nextSelector).attributes('disabled')).toBeDefined()

    await wrapper.find(nextSelector).trigger('click')
    expect(wrapper.find(pageSelector).text()).toBe('Page 3 of 3')

    await wrapper.find(previousSelector).trigger('click')
    expect(wrapper.find(pageSelector).text()).toBe('Page 2 of 3')
  })

  it('shows ten bikes a page by default', () => {
    const wrapper = mount(ProductList, { props: { products } })

    expect(names(wrapper)).toHaveLength(5)
    expect(wrapper.find(pageSelector).text()).toBe('Page 1 of 1')
  })

  it('drops the selection when the page changes', async () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 2, selected: products[0] } })

    await wrapper.find(nextSelector).trigger('click')

    expect(wrapper.emitted('select').at(-1)).toEqual([null])
  })

  it('goes back to page 1 on a new search or a new order', async () => {
    const wrapper = mount(ProductList, { props: { products, perPage: 2 } })

    await wrapper.find(nextSelector).trigger('click')
    await wrapper.find(nextSelector).trigger('click')
    await wrapper.find(searchSelector).setValue('201')
    expect(wrapper.find(pageSelector).text()).toBe('Page 1 of 3')

    await wrapper.find(nextSelector).trigger('click')
    await wrapper.find('[data-testid=sort-price]').trigger('click')
    expect(wrapper.find(pageSelector).text()).toBe('Page 1 of 3')
  })
})
