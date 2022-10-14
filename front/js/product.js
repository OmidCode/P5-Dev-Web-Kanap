// on récupère l'id du produit via son url avec searchParams
const params = new URL(document.location).searchParams;
const id = params.get("_id");

// on récupère le produit via l'apiavec la méthode fetch
fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => res.json())
  .then(async function (resultatAPI) {
    productUnit = await resultatAPI;
    showProduct(productUnit);
  })
  .catch(function (err) {
    document.getElementsByClassName("item").innerHTML =
      "Nous n'avons pas réussi à afficher nos produits. Verifiez si le serveur local (Port 3000) est bien ouvert.";
  });

// on place les données reçue via l'api aux emplacements prévu pour son affichage
function showProduct(productSheet) {
  document.title = productSheet.name;
  let productImg = document.querySelector(".item__img");

  // insertion image du canapé
  let createPict = document.createElement("img");
  createPict.setAttribute("src", productSheet.imageUrl);
  createPict.setAttribute("alt", productSheet.altTxt);
  productImg.appendChild(createPict);

  // insertion du nom du canapé
  let productTitle = document.querySelector("#title");
  productTitle.textContent = productSheet.name;

  // insertion du prix du canapé
  let productPrice = document.querySelector("#price");
  productPrice.textContent = productSheet.price;

  // insertion du choix du canapé
  let productDescription = document.querySelector("#description");
  productDescription.textContent = productSheet.description;
}
