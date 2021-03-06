const appAdmin = {
  data() {
    return {
      products: [],
      productModal: '',
      deleteProductModal: '',
      nowAction: '',
      apiData: {
        apiUrl: `https://vue3-course-api.hexschool.io`,
        api: `jordanttcdesign`,
        token: '',
      },
      temProduct: {
        imagesUrl: [],
      },
    };
  },
  methods: {
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
        .get(
          `${this.apiData.apiUrl}/api/${this.apiData.api}/admin/products/all`
        )
        .then((res) => {
          // console.log(res);
          this.products = Object.values(res.data.products);
          console.log(this.products);
          this.spinnerClose();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    newProduct() {
      let product = {
        data: this.temProduct,
      };
      console.log(product);
      this.spinnerOpen();
      axios
        .post(
          `${this.apiData.apiUrl}/api/${this.apiData.api}/admin/product`,
          product
        )
        .then((res) => {
          console.log(res);
          return this.getProductData();
        })
        .then((res) => {
          this.productModal.hide();
          this.temProduct = {
            imagesUrl: [],
          };
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeProductState(id) {
      // console.log(id);
      const product = {};
      this.products.forEach(function (item) {
        if (item.id == id) {
          if (item.is_enabled > 0) {
            item.is_enabled = 0;
          } else {
            item.is_enabled = 1;
          }
          product.data = item;
        }
      });
      this.spinnerOpen();
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
    updateProduct() {
      let id = this.temProduct.id;
      let product = {
        data: this.temProduct,
      };
      this.spinnerOpen();
      axios
        .put(
          `${this.apiData.apiUrl}/api/${this.apiData.api}/admin/product/${id}`,
          product
        )
        .then((res) => {
          this.productModal.hide();
          this.getProductData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteProduct() {
      let id = this.temProduct.id;
      axios
        .delete(
          `${this.apiData.apiUrl}/api/${this.apiData.api}/admin/product/${id}`
        )
        .then((res) => {
          // console.log(res);
          this.deleteProductModal.hide();
          this.getProductData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeBoolean(key) {
      this[key] = !this[key];
      console.log(this[key]);
    },
    addImageUrl() {
      this.temProduct.imagesUrl.push('');
    },
    deleteImageUrl() {
      this.temProduct.imagesUrl.pop();
    },
    openModal(e, item) {
      console.log(e.target.dataset.action);
      nowAction = e.target.dataset.action;
      if (nowAction == 'newProduct') {
        this.nowAction = e.target.dataset.action
        this.temProduct = {
          imagesUrl: [],
        };
        console.log(this.productModal);
        this.productModal.show();
      } else if (nowAction == 'editProduct') {
        this.nowAction = e.target.dataset.action
        console.log(item);
        if (!item.imagesUrl) {
          this.temProduct = { ...item, imagesUrl: [] };
        } else {
          this.temProduct = { ...item };
        }
        this.productModal.show();
      } else if (nowAction == 'deleteProduct') {
        this.nowAction = e.target.dataset.action
        console.log(item);
        if (!item.imagesUrl) {
          this.temProduct = { ...item, imagesUrl: [] };
        } else {
          this.temProduct = { ...item };
        }
        // console.log(this.temProduct.id)
        this.deleteProductModal.show();
        // console.log(this.deleteProductModal)
      }
    },
    spinnerOpen() {
      document.querySelector('.spinner').classList.add('spinner--open');
    },
    spinnerClose() {
      document.querySelector('.spinner').classList.remove('spinner--open');
    },
    bsModal() {
      this.productModal = new bootstrap.Modal(
        document.querySelector('#productModal')
      );
      this.deleteProductModal = new bootstrap.Modal(
        document.querySelector('#delProductModal')
      );
    },
  },
  created() {
    this.spinnerOpen();
    this.getToken();
    this.getProductData();
  },
  mounted() {
    this.bsModal();
  },
};
Vue.createApp(appAdmin).mount('#appAdmin');
