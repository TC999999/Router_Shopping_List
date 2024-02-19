let $shoppingList = $("#shopping_list");
let $shoppingListDiv = $("#shopping_list_div");

let $errorMessage = $("#error_message");
let $totalPriceDiv = $("#total_price_div");
let $totalPrice = $("#total_price");

let $addFormDiv = $("#add_form_div");
let $addButton = $("#add_item_button");
let $itemName = $("#item_name");
let $itemPrice = $("#item_price");

let $updateFormDiv = $("#update_form_div");
let $updateHeader = $("#update_header");
let $updateButton = $("#update_item_button");
let $updateItemName = $("#update_item_name");
let $updateItemPrice = $("#update_item_price");
let $cancel = $("#cancel");

let baseURL = "http://localhost:3000/api/items";
let currentItem;

async function fillList() {
  let res = await axios.get(baseURL);
  let total = 0;
  if (res.data.items.length !== 0) {
    for (let item of res.data.items) {
      let name = item.name.replace(/_/g, " ");
      let nameArr = name.split(" ");
      let capNameArr = nameArr.map((word) => {
        return word[0].toUpperCase() + word.substr(1);
      });
      let newName = capNameArr.join(" ");
      let $newUpdateButton = $('<button id="patch">').text("update item");
      let $newDelButton = $('<button id="delete">').text("delete item");
      let $newItem = $(`<li item_name=${item.name}>`).text(
        `${newName} - $${item.price}`
      );
      total += parseFloat(item.price);
      $newItem.append($newDelButton);
      $newItem.append($newUpdateButton);
      $shoppingList.append($newItem);
    }
  }
  let finalPrice = Math.round(total * 100) / 100;
  $totalPrice.text(`$${finalPrice}`);
}

function hideUpdates() {
  $updateItemName.val("");
  $updateItemPrice.val("");
  $updateFormDiv.hide();
  $shoppingListDiv.show();
  $addFormDiv.show();
  $totalPriceDiv.show();
  currentItem = undefined;
}

$(document).ready(function () {
  fillList();
});

$addButton.on("click", async function (e) {
  e.preventDefault();
  let $name = $itemName.val().toLowerCase().replace(/\s+/g, "_");
  let $price = $itemPrice.val();
  if (!$name || !$price) {
    $errorMessage.text("Please fill out both inputs");
    setTimeout(() => {
      $errorMessage.text("");
    }, 2000);
  } else {
    try {
      await axios.get(`${baseURL}/${$name}`);
      $errorMessage.text("Item already in list");
      setTimeout(() => {
        $errorMessage.text("");
      }, 2000);
      $itemName.val("");
      $itemPrice.val("");
    } catch (err) {
      await axios.post(baseURL, { name: $name, price: $price });
      $shoppingList.empty();
      $itemName.val("");
      $itemPrice.val("");
      fillList();
    }
  }
});

$shoppingList.on("click", "#delete", async function (e) {
  e.preventDefault();
  let name = $(this).parent().attr("item_name");
  let res = await axios.get(`${baseURL}/${name}`);
  currentItem = res.data;
  await axios.delete(`${baseURL}/${name}`);
  $shoppingList.empty();
  fillList();
});

$shoppingList.on("click", "#patch", async function (e) {
  e.preventDefault();
  let name = $(this).parent().attr("item_name");
  let res = await axios.get(`${baseURL}/${name}`);
  currentItem = res.data;
  $updateHeader.text(`Update ${currentItem.name}`);
  $shoppingListDiv.hide();
  $addFormDiv.hide();
  $totalPriceDiv.hide();
  $updateFormDiv.show();
  $updateItemName.val(currentItem.name);
  $updateItemPrice.val(currentItem.price);
});

$cancel.on("click", function (e) {
  e.preventDefault();
  hideUpdates();
});

$updateButton.on("click", async function (e) {
  e.preventDefault();
  let newName = $updateItemName.val();
  let newPrice = $updateItemPrice.val();
  if (!newName) {
    await axios.patch(`${baseURL}/${currentItem.name}`, {
      name: currentItem.name,
      price: newPrice,
    });
  } else if (!newPrice) {
    await axios.patch(`${baseURL}/${currentItem.name}`, {
      name: newName,
      price: currentItem.price,
    });
  } else if (!newName && !newPrice) {
    await axios.patch(`${baseURL}/${currentItem.name}`, {
      name: currentItem.name,
      price: currentItem.price,
    });
  } else {
    try {
      await axios.get(`${baseURL}/${newName}`);
      $errorMessage.text("Item already in list");
      setTimeout(() => {
        $errorMessage.text("");
      }, 2000);
    } catch (err) {
      await axios.patch(`${baseURL}/${currentItem.name}`, {
        name: newName,
        price: newPrice,
      });
      $shoppingList.empty();
      fillList();
      hideUpdates();
    }
  }
});
