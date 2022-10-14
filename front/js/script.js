// On récupère les produits de l'api
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((productsObject) => {
    console.table(productsObject);
    showProducts(productsObject);
  })
  .catch(function (err) {
    document.getElementById("items").innerHTML =
      "Nous n'avons pas réussi à afficher nos produits. Verifiez si le serveur local (Port 3000) est bien ouvert.";
  });

// on affiche les produits de l'api sur la page d'accueil grace à notre fonction
function showProducts(index) {
  let spaceProduct = document.getElementById("items");
  for (let product of index) {
    spaceProduct.innerHTML += `<a href="./product.html?_id=${product._id}">
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
    </article>
  </a>`;
  }
}
