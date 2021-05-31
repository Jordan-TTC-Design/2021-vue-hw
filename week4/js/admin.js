const appAdmin = Vue.createApp({
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
      pagination: {},
      spinnerState: false,
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
    getProductData(pageNum = 1) {
      if (!this.spinnerState) {
        this.spinnerOpen();
      }
      // console.log(
      //   `${this.apiData.apiUrl}/api/${this.apiData.api}/admin/products?page=${pageNum}`
      // );
      axios
        .get(
          `${this.apiData.apiUrl}/api/${this.apiData.api}/admin/products?page=${pageNum}`
        )
        .then((res) => {
          // console.log(res);
          // this.products = Object.values(res.data.products);
          this.products = res.data.products;
          this.pagination = res.data.pagination;
          console.log(this.products);
          console.log(this.pagination);
          this.spinnerClose();
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
    updateProduct(updatedProduct) {
      let id = `/${updatedProduct.id}`;
      let product = {
        data: updatedProduct,
      };
      console.log(updatedProduct)
      let axiosAction = 'put';
      if (this.nowAction === 'newProduct') {
        axiosAction = 'post';
        id = '';
      }
      this.spinnerOpen();
      axios[axiosAction](
        `${this.apiData.apiUrl}/api/${this.apiData.api}/admin/product${id}`,
        product
      )
        .then((res) => {
          this.productModal.hide();
          this.getProductData();
          this.temProduct = {
            imagesUrl: [],
          };
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
    openModal(e, item) {
      // console.log(e.target.dataset.action);
      nowAction = e.target.dataset.action;
      if (nowAction == 'newProduct') {
        this.nowAction = e.target.dataset.action;
        this.temProduct = {
          imagesUrl: [],
        };
        // console.log(this.temProduct)
        // console.log(this.productModal);
        this.productModal.show();
      } else if (nowAction == 'editProduct') {
        this.nowAction = e.target.dataset.action;
        // console.log(item);
        if (!item.imagesUrl) {
          this.temProduct = { ...item, imagesUrl: [] };
        } else {
          this.temProduct = { ...item };
        }
        // console.log(this.temProduct)
        this.productModal.show();
      } else if (nowAction == 'deleteProduct') {
        this.nowAction = e.target.dataset.action;
        // console.log(item);
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
});
appAdmin.component('paginationCompo', {
  props: ['page'],
  template: '#paginationCompo',
  created() {
    // console.log(this.page);
  },
});
appAdmin.component('productModalCompo', {
  props: ['temProduct','productModal'],
  data() {
    return {
      modalTemProduct:{imagesUrl:[]},
    };
  },
  template: '#productModalCompo',
  created() {
    modalTemProduct = this.temProduct;
    console.log(this.temProduct);
    console.log(this.modalTemProduct);
  },
  methods: {
    addImageUrl() {
      this.modalTemProduct.imagesUrl.push('');
    },
    deleteImageUrl() {
      this.modalTemProduct.imagesUrl.pop();
    },
    updateProduct(){
      console.log(this.modalTemProduct)
      console.log(this.temProduct)
      this.$emit('update-product',this.temProduct)
    }
  },
});

appAdmin.mount('#appAdmin');
