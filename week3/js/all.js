const login = {
  data(){
    return{
      username:'',
      password:'',
      dom: {
        domEmail: '#username',
        domPassword: '#password',
        loginBtn: '#loginBtn',
      },
      apiData: {
        apiUrl: `https://vue3-course-api.hexschool.io`,
        api: `jordanttcdesign`,
      },
    }
  },
  methods:{
    login() {
      const user = {
        username:this.username,
        password:this.password
      };
      // console.log(user)
      axios
        .post(`${this.apiData.apiUrl}/admin/signin`, user)
        .then((res) => {
          // console.log(res);
          let data = res.data;
          if (data.success === true) {
            //加入token
            const token = res.data.token;
            const expired = res.data.expired;
            console.log(token, expired);
            document.cookie = `hexToken=${token};expires=${new Date(expired)}`;
            alert(`登入成功`);
            window.location.href = 'https://jordan-ttc-design.github.io/2021-vue-hw/week3/adminProduct.html';
            // this.username = '';
            // this.password = '';
          } else {
            alert(`登入失敗`);
            this.username = '';
            this.password = '';
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
  },
};
Vue.createApp(login).mount('#app');

