const fs = require('fs').promises;
const path = require('path');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
);

const getProductsFromFile = async () => {
  try {
    const fileContent = await fs.readFile(p, 'utf8');
    return JSON.parse(fileContent);
  } catch (err) {
    return [];
  }
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  async save() {

   const products = await getProductsFromFile();

   try {
    const productIndex = products.findIndex(p => p.id === this.id);
    console.log(`THIS IS THE PRODUCTS ARRAY: ${productIndex}`)
    
    if (productIndex >= 0) {
      products[productIndex] = this;
    } else {
      this.id = Math.random().toString();
      products.push(this);
    }
   } catch (err) {
     console.log(err);
   }

    await fs.writeFile(p, JSON.stringify(products));
    console.log(`Product ${this.id} saved`)
  }  

  static async fetchAll() {
    try {
      return await getProductsFromFile();
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  static async findById(id) {
    try {
      const products = await getProductsFromFile();
      return products.find(p => p.id === id);
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteById(id) {

    const products = await getProductsFromFile();

    try {
      const updatedProducts = products.filter(p => p.id !== id);
      await fs.writeFile(p, JSON.stringify(updatedProducts));
      console.log(`Product ${id} deleted`);
    } catch (err) {
      console.log(err);
    }
  }
};
