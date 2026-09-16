// Every call to the catalogue goes through here, so a view never knows
// where the data comes from. Today the catalogue is a JSON file served with
// the site; pointing API_URL at a real service is the only change needed.
const API_URL = `${import.meta.env.BASE_URL}api/products.json`

async function fetchCatalogue() {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error(`The catalogue could not be loaded (${response.status}).`)
  }
  return response.json()
}

// All the products.
export async function getProducts() {
  return fetchCatalogue()
}

// One product by its id, or null when there is none.
export async function getProduct(id) {
  const products = await fetchCatalogue()
  return products.find((product) => product.id === Number(id)) ?? null
}
