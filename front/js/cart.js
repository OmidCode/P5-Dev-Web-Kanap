//affichage du panier
let url = "http://localhost:3000/api/products/";
let tableauKanap = JSON.parse(localStorage.getItem("listOfProduct"));
let itemsQuantityInput = document.getElementsByClassName("itemQuantity");

if (!tableauKanap || tableauKanap == 0) {
  let subtitle1 = document.createElement("h1");
  subtitle1.setAttribute("style", "text-align:center");
  subtitle1.innerHTML = "est vide.";
  cart__items.appendChild(subtitle1);

  let subtitle2 = document.createElement("h2");
  subtitle2.setAttribute("style", "text-align:center");
  subtitle2.innerHTML = "Avez-vous vu notre page d'accueil ?";
  cart__items.appendChild(subtitle2);
} else {
  for (let kanap of tableauKanap) {
    isCart(kanap);
  }
}
//affichage informations dans le DOM
function createHTMLContent(res, kanap) {
  let cartSection = document.getElementById("cart__items");
  let cartArticle = document.createElement("article");

  cartSection.appendChild(cartArticle);
  cartArticle.className = "cart__item";
  cartArticle.setAttribute("data-id", res._id);
  cartArticle.setAttribute("data-color", kanap.color);

  let divImage = document.createElement("div");
  divImage.className = "cart__item__img";
  cartArticle.appendChild(divImage);

  let imageElt = document.createElement("img");
  imageElt.src = res.imageUrl;
  imageElt.alt = res.altTxt;
  divImage.appendChild(imageElt);

  let divContent = document.createElement("div");
  divContent.className = "cart__item__content";
  cartArticle.appendChild(divContent);

  let description = document.createElement("div");
  description.className = "cart__item__content__description";
  divContent.appendChild(description);

  let h2Elt = document.createElement("h2");
  h2Elt.innerHTML = res.name;
  description.appendChild(h2Elt);

  let pColor = document.createElement("p");
  pColor.textContent = kanap.color;
  description.appendChild(pColor);

  let pPrice = document.createElement("p");
  let pPriceValue = parseFloat(res.price) * parseInt(kanap.quantity);
  pPrice.innerHTML = pPriceValue + ",00 €";
  description.appendChild(pPrice);

  let settings = document.createElement("div");
  settings.className = "cart__item__content__settings";
  divContent.appendChild(settings);

  let settingsQuantity = document.createElement("div");
  settingsQuantity.className = "cart__item__content__settings__quantity";
  settings.appendChild(settingsQuantity);

  let pQuantity = document.createElement("p");
  settingsQuantity.appendChild(pQuantity);
  pQuantity.innerHTML = "Qté : ";

  let inputQuantity = document.createElement("input");
  inputQuantity.type = "number";
  inputQuantity.className = "itemQuantity";
  inputQuantity.name = "itemQuantity";
  inputQuantity.setAttribute("min", "1");
  inputQuantity.max = "100";
  inputQuantity.value = kanap.quantity;
  settingsQuantity.appendChild(inputQuantity);

  let settingsDelete = document.createElement("div");
  settingsDelete.className = "cart__item__content__settings__delete";
  settings.appendChild(settingsDelete);

  let pDelete = document.createElement("p");
  pDelete.className = "deleteItem";
  settingsDelete.appendChild(pDelete);
  pDelete.innerHTML = "Supprimer";
}

// fonction pour pouvoir changer la quantité
function changedQuantity(kanap) {
  for (let i = 0; i < itemsQuantityInput.length; i++) {
    let itemQuantityInput = itemsQuantityInput[i];
    itemQuantityInput.addEventListener("change", () => {
      let IdOfQuantitysArticle = itemQuantityInput
        .closest("article")
        .getAttribute("data-id");
      let ColorOfQuantitysArticle = itemQuantityInput
        .closest("article")
        .getAttribute("data-color");
      let changedQuantity = itemQuantityInput.valueAsNumber;
      let findProduct = tableauKanap.find(
        (kanap) =>
          kanap.id == IdOfQuantitysArticle &&
          kanap.originalQuantity !== changedQuantity &&
          kanap.color == ColorOfQuantitysArticle
      );
      findProduct.quantity = changedQuantity;

      originalQuantity = changedQuantity;
      if (
        changedQuantity > 100 ||
        changedQuantity <= 0 ||
        changedQuantity != parseInt(changedQuantity)
      ) {
        alert("Veuillez sélectionner une quantité comprise entre 1 et 100.");
        return changedQuantity == undefined;
      }
      localStorage.setItem("listOfProduct", JSON.stringify(tableauKanap));
      window.location.reload(calcTotalKanap);
    });
  }
}

// on crée une fonction pour le bouton "supprimer"
function deleteKanap() {
  const deleteSelectors = document.querySelectorAll(".deleteItem");
  for (let i = 0; i < deleteSelectors.length; i++) {
    let deleteSelector = deleteSelectors[i];
    deleteSelector.addEventListener("click", () => {
      let deleteId = deleteSelector.closest("article").getAttribute("data-id");
      let deleteColor = deleteSelector
        .closest("article")
        .getAttribute("data-color");

      filterProduct = tableauKanap.filter(
        (kanap) => (deleteId != kanap.id, deleteColor != kanap.color)
      );
      tableauKanap = filterProduct;
      localStorage.setItem("listOfProduct", JSON.stringify(tableauKanap));

      alert("Votre article a bien été supprimé.");
      window.location.reload();
    });
  }
}

//fonction qui calcule le total en quantité et montant, en ajustant sila quantité change ou si le produit est supprimé
function calcTotalKanap() {
  let totalQuantity = 0;
  for (let i = 0; i < itemsQuantityInput.length; i++) {
    totalQuantity += itemsQuantityInput[i].valueAsNumber;
  }
  let idTotalQuantity = document.getElementById("totalQuantity");
  idTotalQuantity.innerHTML = totalQuantity;
}

let totalPrice = 0;

function calcTotalPrice(res, kanap) {
  let findId = tableauKanap.find((el) => res._id === el.id);
  let totalPriceCalc = parseInt(res.price) * parseInt(kanap.quantity);
  totalPrice += totalPriceCalc;
  let idTotalPrice = document.getElementById("totalPrice");
  idTotalPrice.innerHTML = totalPrice;
}

// fonction globale qui résume toutes les actions possibles en tant qu'utilisateur(client)
function isCart(kanap) {
  fetch(url + kanap.id)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (res) {
      createHTMLContent(res, kanap);
      changedQuantity(kanap);
      deleteKanap(kanap);
      calcTotalKanap();
      calcTotalPrice(res, kanap);
    })
    .catch(function (err) {
      console.log("erreur :", err);
    });
}

//fonction pour les informations à remplir par l'utilisateur dans le formulaire
// règles et condition sur les caractères + chiffres possible
function getForm() {
  let otherRegExp = new RegExp("^[-a-zA-Z ]{1,30}[^0-9]$");
  let emailRegExp = new RegExp(
    "^[a-zA-Z.-_]{3,30}[@]{1}[a-zA-Z.-_]{3,30}[.]{1}[a-z]{2}[^0-9]$"
  );
  let addressRegExp = new RegExp("^['0-9 A-Za-z-]{2,50}$");

  let firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
  let lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
  let addressErrorMsg = document.querySelector("#addressErrorMsg");
  let cityErrorMsg = document.querySelector("#cityErrorMsg");
  let emailErrorMsg = document.querySelector("#emailErrorMsg");

  document.getElementById("firstName").addEventListener("change", () => {
    if (otherRegExp.test(firstName.value) == true) {
      firstNameErrorMsg.innerHTML = "";
    } else {
      firstNameErrorMsg.innerHTML =
        "Veuillez vérifier l'exactitude de votre saisie";
      return (firstName.value = " ");
    }
  });
  document.getElementById("lastName").addEventListener("change", () => {
    if (otherRegExp.test(lastName.value) == true) {
      lastNameErrorMsg.innerHTML = "";
    } else {
      lastNameErrorMsg.innerHTML =
        "Veuillez vérifier l'exactitude de votre saisie";
      return (lastName.value = " ");
    }
  });
  document.getElementById("address").addEventListener("change", () => {
    if (addressRegExp.test(address.value) == true) {
      addressErrorMsg.innerHTML = "";
    } else {
      addressErrorMsg.innerHTML =
        "Veuillez préciser le numéro, type de voie et nom de voie";
      return (address.value = " ");
    }
  });
  document.getElementById("city").addEventListener("change", () => {
    if (otherRegExp.test(city.value) == true) {
      cityErrorMsg.innerHTML = "";
    } else {
      cityErrorMsg.innerHTML = "Veuillez vérifier l'exactitude de votre saisie";
      return (city.value = " ");
    }
  });
  document.getElementById("email").addEventListener("change", () => {
    if (emailRegExp.test(email.value) == true) {
      emailErrorMsg.innerHTML = "";
    } else {
      emailErrorMsg.innerHTML = "Veuillez noter une adresse email valide";
      return (email.value = " ");
    }
  });
}
getForm();

//
//fonction qui envoie les informations du client + la sélection de produits au clic et génère un orderId
function postForm(res, kanap) {
  let form = document.querySelector(".cart__order__form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (tableauKanap != null) {
      //création d'un tableau d'ID de produit
      let products = [];
      for (let listOfProduct of tableauKanap) {
        products.push(listOfProduct.id);
      }
      //création d'un objet à partir de valeurs de formulaire
      let contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
      };
      // enregistrement dans le LocalStorage le formulaire de contact
      localStorage.setItem("contact", JSON.stringify(contact));
      //confirmation de commande -> récapitulatif de la commande passé
      let order = JSON.stringify({
        contact: contact,
        products: products,
      });

      fetch(url + "order", {
        method: "POST",
        body: order,
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.clear();
          let orderId = data.orderId;
          document.location.href = "./confirmation.html?order=" + orderId;
        })
        .catch((error) => console.log("error", error));
    } else {
      alert("Erreur lors de la commande. Merci de vérifier votre panier.");
      return;
    }
  });
}
postForm();
