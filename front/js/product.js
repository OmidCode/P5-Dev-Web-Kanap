//on récupère l'id du produit via son url avec searchParams
let url = new URL(location.href);
let productId = url.searchParams.get("productId");

//fonction qui va permettre de sauvegarder et mettre à jour notre localStorage
function saveTableauKanap(tableauKanap) {
  localStorage.setItem("listOfProduct", JSON.stringify(tableauKanap));
}
//on récupère le produit via l'api en ciblant son ID
fetch("http://localhost:3000/api/products/" + productId)
  .then(function (res) {
    if (res.ok) {
      console.log("res", res);
      return res.json();
    }
  })
  .then(function (product) {
    createHTML(product);
    addToCart2(product);
  });

//On affiche le produit correspondant avec ses informations
let createHTML = (product) => {
  let imageClass = document.getElementsByClassName("item__img");
  let imageProduct = document.createElement("img");
  imageClass[0].appendChild(imageProduct);
  imageProduct.src = product.imageUrl;
  imageProduct.alt = product.altTxt;
  let h1Product = document.getElementById("title");
  h1Product.innerHTML = product.name;
  let priceProduct = document.getElementById("price");
  priceProduct.innerHTML = parseInt(product.price);
  let description = document.getElementById("description");
  description.innerHTML = product.description;
  let selectOption = document.getElementById("colors").options;
  for (colors of product.colors) {
    selectOption.add(new Option(colors, colors));
  }
  let quantity = document.getElementById("quantity");
};

//ajout d'une fonction pour le boutton "ajouter au panier"
let addToCart2 = (product) => {
  let addProduct = document.getElementById("addToCart");
  addProduct.addEventListener("click", function () {
    //Création d'un array dans lequel nous ajoutons un objet produit
    // L'objet product (kanap) contient un ID, la quantité et la couleur sélectionnées
    let tableauKanap = [];
    let kanap = {
      id: productId,
      quantity: document.getElementById("quantity").value,
      color: document.getElementById("colors").value,
    };
    //Ajout de conditions avant d'ajouter le produit au panier (quantité max, min)
    if (kanap.color == 0) {
      alert("Veuillez sélectionner une couleur.");
      return kanap == undefined;
    } else if (
      kanap.quantity > 100 ||
      kanap.quantity <= 0 ||
      kanap.quantity != parseInt(kanap.quantity)
    ) {
      alert("Veuillez sélectionner une quantité comprise entre 1 et 100.");
      return kanap == undefined;
    }
    if (localStorage.getItem("listOfProduct")) {
      //permet d'ajouter autant de produits que l'on veut dans le tableau
      tableauKanap = JSON.parse(localStorage.getItem("listOfProduct"));
      let foundProduct = tableauKanap.find(
        (el) => el.id == kanap.id && el.color == kanap.color
      );
      if (foundProduct != undefined) {
        let finalSelection =
          parseInt(foundProduct.quantity) + parseInt(kanap.quantity);
        foundProduct.quantity = finalSelection;
        alert(
          "Ce produit a déjà été ajouté. La quantité sélectionnée a été ajouté"
        );
      } else {
        tableauKanap.push(kanap);
        alert("Votre produit a bien été ajouté au panier");
        saveTableauKanap(tableauKanap);
      }
      saveTableauKanap(tableauKanap);
    } else {
      tableauKanap.push(kanap);
      alert("Votre produit a bien été ajouté au panier");
    }
    saveTableauKanap(tableauKanap);
  });
};
