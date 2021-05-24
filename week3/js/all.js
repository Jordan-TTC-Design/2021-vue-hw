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
// console.log(window.location.href);
if (window.location.href.indexOf('login.html') > 0) {
  console.log('這裡是登入頁面！');
  login.init();
}
// if (window.location.href.indexOf('adminProduct.html') > 0) {
//   console.log('這裡是後台！');
// }

