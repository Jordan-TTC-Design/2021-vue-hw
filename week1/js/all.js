//抓取畫面元素
const productTitle = document.querySelector('#title');
const productOgPrice = document.querySelector('#origin_price');
const productPrice = document.querySelector('#price');
const addProductBtn = document.querySelector('#addProduct');
const clearAllProductBtn = document.querySelector('#clearAll');
const productListTable = document.querySelector('#productList');
const productCount = document.querySelector('#productCount');
let productData = JSON.parse(localStorage.getItem('todoList')) || []; //資料會儲存在localStorage，如果沒有預設為空陣列

//init
renderProduct(productData);
// console.log(productData);

//監聽：取得產品資料
addProductBtn.addEventListener('click', function () {
  let name = productTitle.value;
  let ogPrice = productOgPrice.value || 0;
  let price = productPrice.value || 0;
  let id = Math.floor(Date.now());
  let state = false;
  if (name) {
    let newProduct = {
      id,
      name,
      ogPrice,
      price,
      state,
    };
    productData.push(newProduct);
    // console.log(productData);
    saveData(productData);
    renderProduct(productData);
    formClear();
  }
});

//監聽：對產品列表做出動作
productListTable.addEventListener('click', function (e) {
  const dataSetting = e.target.dataset;
  //判斷動作是改狀態還是刪除
  if (dataSetting.action == 'changeProductState') {
    console.log(`我要調整${dataSetting.id}的狀態`);
    changeProductState(dataSetting.id);
  } else if (dataSetting.action == 'deleteProduct') {
    console.log(`我要刪除${dataSetting.id}`);
    deleteProductList(dataSetting.id);
  }
});

//監聽：刪除全部資料
clearAllProductBtn.addEventListener('click', deleteProductListAll);

//儲存資料至local
function saveData(productData) {
  let dataTxt = JSON.stringify(productData);
  localStorage.setItem('todoList', dataTxt);
  //   console.log(localStorage.getItem('todoList'));
}

//刪除加入產品輸入表單
function formClear() {
  productTitle.value = '';
  productOgPrice.value = '';
  productPrice.value = '';
}

//刪除特定資料
function deleteProductList(id) {
  let num = getProductNum(id);
  productData.splice(num, 1);
  saveData(productData);
  renderProduct(productData);
}

//轉換產品狀態
function changeProductState(id) {
  let num = getProductNum(id);
  productData[num].state = !productData[num].state;
  saveData(productData);
  renderProduct(productData);
}

//刪除全部資料
function deleteProductListAll() {
  if (productData.length != 0) {
    console.log('productData 有資料');
    productData = [];
    saveData(productData);
    renderProduct(productData);
  } else {
    console.log('productData 沒資料');
    return;
  }
}

//渲染產品列表
function renderProduct(productData) {
  let str = ``;
  productData.forEach(function (item) {
    str =
      str +
      ` 
    <tr>
    <th>${item.name}</th>
    <th width="120">${item.ogPrice}</th>
    <th width="120">${item.price}</th>
    <th width="150">
      <div class="form-check form-switch">
        <input
          type="checkbox"
          class="form-check-input"
          id="${item.id}"
          data-action="changeProductState"
          data-id="${item.id}"
          ${item.state ? 'checked' : ''}
        />
        <label class="form-check-label" for="${item.id}">${
        item.state ? '啟動' : '未啟動'
      }</label>
      </div>
    </th>
    <th width="120">
      <button
        type="button"
        class="btn btn-sm btn-danger move"
        data-action="deleteProduct"
        data-id="${item.id}"
      >
        刪除
      </button>
    </th>`;
  });
  productListTable.innerHTML = str;
  productCount.textContent = productData.length;
}

//取得產品於陣列位置
function getProductNum(id) {
  let num = 0;
  productData.forEach(function (item, index) {
    if (item.id == id) {
      num = index;
    }
  });
  return num;
}
