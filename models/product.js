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
    return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]);
  }  

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static async findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
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
