//表單元件
const compoForm = {
  //新增產品列表
  addProduct() {
    const that = this;
    const addProductBtn = document.querySelector('#addProduct');
    addProductBtn.addEventListener('click', function () {
      let name = document.querySelector('#title').value || '';
      let ogPrice = document.querySelector('#origin_price').value || 0;
      let price = document.querySelector('#price').value || 0;
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
        // console.log(newProduct);
        compoProductList.data.push(newProduct);
        compoProductList.saveData();
        compoProductList.renderProduct();
        that.formClear();
      }
    });
  },
  //刪除表單輸入框
  formClear() {
    document.querySelector('#title').value = '';
    document.querySelector('#origin_price').value = '';
    document.querySelector('#price').value = '';
  },
  init() {
    console.log(this.addProduct);
    this.addProduct();
  },
};
//產品列表元件
const compoProductList = {
  //產品資料
  data: [],
  //渲染資料
  renderProduct() {
    const productListTable = document.querySelector('#productList');
    const productCount = document.querySelector('#productCount');
    console.log('render成功！');
    let str = ``;
    this.data.forEach(function (item) {
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
    productCount.textContent = this.data.length;
  },
  //儲存資料到local
  saveData() {
    console.log('saveDate成功！');
    let dataTxt = JSON.stringify(this.data);
    localStorage.setItem('todoList', dataTxt);
    //   console.log(localStorage.getItem('todoList'));
  },
  //刪除特定產品資料
  deleteProductList(id) {
    let num = this.getProductNum(id);
    this.data.splice(num, 1);
    this.saveData();
    this.renderProduct();
  },
  //改變產品狀態
  changeProductState(id) {
    let num = this.getProductNum(id);
    this.data[num].state = !this.data[num].state;
    this.saveData();
    this.renderProduct();
  },
  //取得產品在資料陣列中的位置
  getProductNum(id) {
    let num = 0;
    this.data.forEach(function (item, index) {
      if (item.id == id) {
        num = index;
      }
    });
    return num;
  },
  //刪除全部資料
  deleteProductListAll(that) {
    console.log(that);
    if (that.data.length != 0) {
      console.log('that.data 有資料');
      that.data = [];
      that.saveData();
      that.renderProduct();
    } else {
      console.log('that.data 沒資料');
      return;
    }
  },
  //監聽綁定，that=this
  bindListener() {
    const that = this;
    //監聽刪除全部產品列表
    const clearAllProductBtn = document.querySelector('#clearAll');
    clearAllProductBtn.addEventListener('click', function () {
      that['deleteProductListAll'](that);
    });
    //如果寫成這樣就會直接執行刪除動作
    // clearAllProductBtn.addEventListener(
    //   'click',
    //   that['deleteProductListAll'](that)
    // );

    //監聽：對產品列表做出動作
    const productListTable = document.querySelector('#productList');
    productListTable.addEventListener('click', function (e) {
      const dataSetting = e.target.dataset;
      //判斷動作是改狀態還是刪除
      if (dataSetting.action == 'changeProductState') {
        console.log(`我要調整${dataSetting.id}的狀態`);
        that.changeProductState(dataSetting.id);
      } else if (dataSetting.action == 'deleteProduct') {
        console.log(`我要刪除${dataSetting.id}`);
        that.deleteProductList(dataSetting.id);
      }
    });
  },
  //生命週期
  init() {
    this.data = JSON.parse(localStorage.getItem('todoList')) || [];
    this.renderProduct(this.data);
    this.bindListener();
  },
};
//預設動作
compoProductList.init();
compoForm.init();
