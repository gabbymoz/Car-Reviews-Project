
// page element where rows will be inserted 
const productRows = document.getElementById('productRows');


// Function: Get Products for a given Category
//
  async function getProductsByCategory(category) {

    // Build FireStore document path
    // starting point (all categories)
    let storePath = 'categories';

    // Generate path to products in a particular category
    if (category !== '') {
      storePath += `/${category}/Products`
    }
    try {
      // Get products contained in the given category
      const products = await getFireStoreDataAsync(storePath);

      // return products
      return products;
  
    } // catch and log any errors
    catch (err) {
      console.log(err);
    }
  }


// Function: Get all Products from all Categories
// 1. Get all categories
// 2. Find products in each of the categories and add to an array
// 3. Return the results
//
async function getProductsForAllCategories() {

  // categories array
  let categories = [];
  // products array
  let products = [];

  // Get Categories
  try {
    categories = await getFireStoreDataAsync();

  } // catch and log any errors
  catch (err) {
    console.log(err);
  }

  // If categories array is not undefined and contains something
  if (typeof categories !== 'undefined' && categories.length > 0) {

   // Asynchronously get products in each category found and add to the array
    for (const category of categories) {
      const p = await getProductsByCategory(category.id);
      products = products.concat(p);
    }

    // return Products array
    return products;
  }
} 

async function getCategories() {
  try {

    const categories = await getFireStoreDataAsync();
    return categories;

  } // catch and log any errors
  catch (err) {
    console.log(err);
  }
  
}

// Function: Generate product table rows for display 
//
async function displayProducts(products) {

  // clear existing rows - otherwise items will be repeated
  productRows.innerHTML = '';

  // Use the Array map method to iterate through the array of message documents
  // Each message will be formated as HTML table rows and added to the array
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Finally the output array is inserted as the content into the <tbody id="productRows"> element.

  // map the array to reyurn a table row for each product in the array
  const tableRows = products.map(product => {
    return `<tr>
          <td>${product.id}</td>
          <td>${product.data().carbrand}</td>
          <td>${product.data().engine}</td>
          <td>${product.data().bodytype}</td>
          <td>${product.data().rating}</td>
          <td class="price">&euro;${Number(product.data().price).toFixed(2)}</td>
      </tr>`;
  });

  // Insert rows into HTML table
  productRows.innerHTML = tableRows.join('');

}


// function: load and display categories in a bootstrap list group
//
function displayCategories(categories) {
  
  // map the array to return a list item for each category in the array
  const items = categories.map(category => {
    return `<a href="#" class="list-group-item list-group-item-action" onclick="updateProducts('${category.id}')">${category.id}</a>`;
  });

  // Add an All categories link at the start (unshift inserts at start of array)
  items.unshift(`<a href="index2 (2).html" class="list-group-item list-group-item-action" onclick="updateProducts()">Show all</a>`);

  // Set the innerHTML of the productRows root element = rows
  document.getElementById('categoryList').innerHTML = items.join('');
} // end function


// Function: initialise page data - load and display
//
async function loadProducts() {

  let products = await getProductsForAllCategories();
  let categories = await getCategories();
  displayCategories(categories);
  displayProducts(products);
}

// Function: Update products when category is selected
// Default is all in case of empty parameter
//
async function updateProducts(category = 'all') {

  let products = [];

  if (category === 'all') {
    // Find all products
    products = await getProductsForAllCategories();
  }
  else {
    // Find products for a single category
    products = await getProductsByCategory(category);
  }

  // Update the page
  displayProducts(products);
}

// Load data when page loads
loadProducts();
