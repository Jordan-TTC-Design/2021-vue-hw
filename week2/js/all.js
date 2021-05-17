const login = {
  dom: {
    domEmail: '#username',
    domPassword: '#password',
    loginBtn: '#loginBtn',
  },
  apiData: {
    apiUrl: `https://vue3-course-api.hexschool.io`,
    api: `jordanttcdesign`,
  },
  login() {
    const user = this.getData();
    axios
      .post(`${this.apiData.apiUrl}/admin/signin`, user)
      .then((res) => {
        console.log(res);
        let data = res.data;
        if (data.success === true) {
          //加入token
          const token = res.data.token;
          const expired = res.data.expired;
          console.log(token, expired);
          document.cookie = `hexToken=${token};expires=${new Date(expired)}`;
          alert(`登入成功`);
          window.location.href = 'adminProduct.html';
          // return res;
        } else {
          alert(`登入失敗`);
          username = '';
          password = '';
          // return;
        }
      })
      // .then((res) => {
      //   username = '';
      //   password = '';
      //   window.location.href = 'adminProduct.html';
      // })
      .catch((error) => {
        console.log(error);
      });
  },
  getData() {
    let username = document.querySelector(`${this.dom.domEmail}`).value;
    let password = document.querySelector(`${this.dom.domPassword}`).value;
    const user = {
      username,
      password,
    };
    // console.log(user);
    return user;
  },
  bind() {
    //綁定登入按鈕
    const login = document.querySelector(`${this.dom.loginBtn}`);
    login.addEventListener('click', (e) => {
      e.preventDefault();
      this.login();
    });
  },
  init() {
    this.bind();
    axios
      .get(`${this.apiData.apiUrl}/api/${this.apiData.api}/products`)
      .then((res) => {
        console.log(res);
      });
  },
};
const admin = {
  dom: {
    domProductList: '#productList',
    domProductCount: '#productCount',
  },
  data: [],
  apiData: {
    apiUrl: `https://vue3-course-api.hexschool.io`,
    api: `jordanttcdesign`,
    token: '',
  },
  getToken() {
    this.apiData.token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common.Authorization = this.apiData.token;
  },
  getProductData() {
    console.log(
      `${this.apiData.apiUrl}/api/${this.apiData.api}/admin/products/all`
    );
    axios
      .get(`${this.apiData.apiUrl}/api/${this.apiData.api}/admin/products/all`)
      .then((res) => {
        // console.log(res);
        this.data = Object.values(res.data.products);
        // console.log(this.data);
        this.renderProductList();
      })
      .catch((error) => {
        console.log(error);
      });
  },
  renderProductList() {
    const productListTable = document.querySelector(
      `${this.dom.domProductList}`
    );
    const productCount = document.querySelector(`${this.dom.domProductCount}`);
    let str = ``;
    this.data.forEach(function (item) {
      str =
        str +
        ` 
      <tr>
      <th>${item.content}</th>
      <th width="120">${item.origin_price}</th>
      <th width="120">${item.price}</th>
      <th width="150">
        <div class="form-check form-switch">
          <input
            type="checkbox"
            class="form-check-input"
            id="${item.id}"
            data-action="changeProductState"
            data-id="${item.id}"
            ${item.is_enabled > 0 ? 'checked' : ''}
          />
          <label class="form-check-label" for="${item.id}">${
          item.state > 0 ? '啟動' : '未啟動'
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
  changeProductState(id) {
    // console.log(id);
    const product = {};
    this.data.forEach(function (item) {
      if (item.id == id) {
        if (item.is_enabled > 0) {
          item.is_enabled = 0;
        } else {
          item.is_enabled = 1;
        }
        product.data = item;
      }
    });
    // console.log(product);
    axios
      .put(
        `${this.apiData.apiUrl}/api/${this.apiData.api}/admin/product/${id}`,
        product
      )
      .then((res) => {
        // console.log(res);
        this.getProductData();
      })
      .catch((error) => {
        console.log(error);
      });
  },
  deleteProduct(id) {
    console.log(id);
    axios
      .delete(
        `${this.apiData.apiUrl}/api/${this.apiData.api}/admin/product/${id}`
      )
      .then((res) => {
        // console.log(res);
        this.getProductData();
      })
      .catch((error) => {
        console.log(error);
      });
  },

  bind() {
    const productListTable = document.querySelector(
      `${this.dom.domProductList}`
    );
    productListTable.addEventListener('click', (e) => {
      if (e.target.dataset.action == 'changeProductState') {
        console.log(e.target.dataset.action);
        this.changeProductState(e.target.dataset.id);
      }
      if (e.target.dataset.action == 'deleteProduct') {
        console.log(e.target.dataset.action);
        this.deleteProduct(e.target.dataset.id);
      }
    });
  },
  init() {
    this.getToken();
    this.getProductData();
    this.bind();
  },
};
// console.log(window.location.href);
if (window.location.href.indexOf('login.html') > 0) {
  console.log('這裡是登入頁面！');
  login.init();
}
if (window.location.href.indexOf('adminProduct.html') > 0) {
  console.log('這裡是後台！');
  admin.init();
}
