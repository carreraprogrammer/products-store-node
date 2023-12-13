const db = require('../util/database');

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

  static fetchAll() {
    return db.execute('SELECT * FROM products');
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
