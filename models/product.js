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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  async save() {
    this.id = Math.random().toString();
    try {
      const products = await getProductsFromFile();
      products.push(this);
      await fs.writeFile(p, JSON.stringify(products));
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    try {
      return await getProductsFromFile();
    } catch (err) {
      console.log(err);
      return [];
    }
  }
};
