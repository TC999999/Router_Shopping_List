let $shoppingList = $("#shopping_list");
let $addButton = $("#add_item_button");
let $itemName = $("#item_name");
let $itemPrice = $("#item_price");
let baseURL = "http://localhost:3000/api/items";

async function fillList() {
  let res = await axios.get(baseURL);
  console.log(res.data.items);
  if (res.data.items.length !== 0) {
    console.log("full list");
    for (let item of res.data.items) {
      let $newItem = $("<li>");
      $newItem.text(`${item.name} - $${item.price}`);
      $shoppingList.append($newItem);
    }
  }
}

$(document).ready(function () {
  fillList();
});

$addButton.on("click", async function (e) {
  e.preventDefault();
  $shoppingList.empty();
  $name = $itemName.val();
  $price = $itemPrice.val();

  await axios.post(baseURL, { name: $name, price: $price });
  $itemName.val("");
  $itemPrice.val("");
  fillList();
});
