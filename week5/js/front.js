// import 'https://unpkg.com/mitt/dist/mitt.umd.js';  為啥直接import不能使用
const emitter = mitt();
const app = Vue.createApp({
  data() {
    return {
      products: [],
      // cartTotal: null,
      // carts: [],
      pagination: {},
      apiData: {
        apiUrl: `https://vue3-course-api.hexschool.io`,
        api: `jordanttcdesign`,
      },
      temProduct: {},
    };
  },
  methods: {
    getData() {
      this.$refs.spinnerModal.spinnerOpen();
      axios
        .get(`${this.apiData.apiUrl}/api/${this.apiData.api}/products?page=:1`)
        .then((res) => {
          // console.log(res)
          this.products = res.data.products;
          this.pagination = res.data.pagination;
          // console.log(this.products)
          this.$refs.spinnerModal.spinnerClose();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addCart(id, qty = 1) {
      console.log(qty);
      let product = { data: { product_id: id, qty } };
      axios
        .post(`${this.apiData.apiUrl}/api/${this.apiData.api}/cart`, product)
        .then((res) => {
          // console.log(`${res.data.message}:${id}`);
          this.$refs.cartCompo.getCart();
          this.$refs.productModal.modal.hide();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getProductDetail(id) {
      this.$refs.spinnerModal.spinnerOpen();
      // console.log(id)
      axios
        .get(`${this.apiData.apiUrl}/api/${this.apiData.api}/product/${id}`)
        .then((res) => {
          console.log(res);
          this.temProduct = res.data.product;
          this.$refs.productModal.openModal(id, this.temProduct);
          this.$refs.spinnerModal.spinnerClose();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getData();
  },
});
app.component('cartCompo', {
  template: '#cartCompo',
  data() {
    return {
      apiData: {
        apiUrl: `https://vue3-course-api.hexschool.io`,
        api: `jordanttcdesign`,
      },
      carts: [],
      cartTotal: null,
      cartState: false,
    };
  },
  methods: {
    getCart() {
      this.spinnerOpen();
      axios
        .get(`${this.apiData.apiUrl}/api/${this.apiData.api}/cart`)
        .then((res) => {
          console.log(res);
          this.carts = res.data.data.carts;
          this.cartTotal = res.data.data.final_total;
          // this.$refs.spinnerModal.spinnerClose();這裡不能使用，我改用emitter
          this.spinnerClose();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    spinnerClose() {
      emitter.emit('spinner-close');
    },
    spinnerOpen() {
      emitter.emit('spinner-open');
    },
    deleteCartProduct(id) {
      axios
        .delete(`${this.apiData.apiUrl}/api/${this.apiData.api}/cart/${id}`)
        .then((res) => {
          console.log(`${res.data.message}`);
          this.getCart();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteCart() {
      axios
        .delete(`${this.apiData.apiUrl}/api/${this.apiData.api}/carts`)
        .then((res) => {
          console.log(`${res.data.message}`);
          this.getCart();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateCart(item) {
      let product = { data: { product_id: item.product.id, qty: item.qty } };
      axios
        .put(
          `${this.apiData.apiUrl}/api/${this.apiData.api}/cart/${item.id}`,
          product
        )
        .then((res) => {
          console.log(`${res.data.message}`);
          this.getCart();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  watch: {
    carts() {
      if (this.carts.length > 0) {
        this.cartState = true;
      } else {
        this.cartState = false;
      }
      console.log(this.cartState);
      emitter.emit('sendCartState', this.cartState);
    },
  },
  created() {
    emitter.on('get-cart', () => {
      this.getCart();
    });
  },
  mounted() {
    this.getCart();
  },
});
app.component('productModal', {
  template: '#productModal',
  data() {
    return {
      modal: {},
      apiData: {
        apiUrl: `https://vue3-course-api.hexschool.io`,
        api: `jordanttcdesign`,
      },
      temProduct: {},
      qty: 1,
      modalState: false,
    };
  },
  methods: {
    openModal(id, product) {
      this.modalState = true;
      this.qty = 1;
      this.temProduct = { ...product };
      this.modal.show();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為輸入字元立即進行驗證
});
app.component('customerInfoCompo', {
  template: '#customerInfoCompo',
  data() {
    return {
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      apiData: {
        apiUrl: `https://vue3-course-api.hexschool.io`,
        api: `jordanttcdesign`,
      },
      cartState: false,
    };
  },
  methods: {
    sendForm() {
      console.log(this.cartState);
      if (this.cartState == false) {
        alert(`購物車沒商品`);
      } else {
        let formData = {
          data: this.form,
        };
        axios
          .post(
            `${this.apiData.apiUrl}/api/${this.apiData.api}/order`,
            formData
          )
          .then((res) => {
            console.log(`${res.data.message}`);
            this.getCart();
            //不知道怎清空
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    getCart() {
      console.log('有成功');
      emitter.emit('get-cart');
    },
  },
  created() {
    emitter.on('sendCartState', (data) => {
      this.cartState = data;
    });
  },
  mounted() {},
});
app.component('spinnerModal', {
  template: '#spinnerModal',
  methods: {
    spinnerOpen() {
      this.$refs.spinner.classList.add('spinner--open');
    },
    spinnerClose() {
      this.$refs.spinner.classList.remove('spinner--open');
    },
  },
  created() {
    emitter.on('spinner-close', () => {
      this.spinnerClose();
    });
    emitter.on('spinner-open', () => {
      this.spinnerOpen();
    });
  },
});
app.mount('#app');
