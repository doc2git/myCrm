let UserList = (() => {
  let pageTotal = 0, pageCode = 1, isSelected=false;
  let bindHTML = () => {
    $.ajax({
      type: 'GET',
      url: '/getUserList',
      dataType: 'json',
      data: {pageCode},
      success: page,
      error: () => {
        console.log('12, some error');
      },
    });
    function page(res) { //为了让page函数在预解释阶段声明且赋值，特意用function关键自定义
      pageTotal = res['pageTotal'];
      if(!isSelected) pageCode = localStorage.getItem('defaultPageCode');
      pageCode = Math.min(Math.max(1, pageCode), pageTotal);
      let data = res['data'];
      let str = data.map(item => (
        `<li data-id="${item['id']}">
         <span>${item['id']}</span>
         <span>${item['name']}</span>
         <span>${Number(item['sex']) === 1 ? '男' : '女'}</span>
         <span>${item['score']}</span>
         <span>
         <button class="del">删除</button>
         <button class="check">查看/修改</button>
         </span>
         </li>`
      )).join('');
      $('#list').html(str);
      str = new Array(pageTotal).fill('').fill(' class="bg" ', pageCode - 1, pageCode)
        .map((item, index) => '<li' + item + '>' + (Number(index) + 1) + '</li>')
        .join('');
      $('#pageNum').html(str);
      $('#pageInput').val(pageCode);
    }
  };
  return {
    init: function () {
      bindHTML();
      $("#page").on("click", "span", function () {
        let text = this.innerText;
        switch (text) {
          case '首页':
          case '上一页':
            if (pageCode === 1) break;
            text === '首页' ? pageCode = 1 : pageCode--;
            break;
          case '尾页':
          case '下一页':
            if (pageCode === pageTotal) break;
            text === '尾页' ? pageCode = pageTotal : pageCode++;
            break;
        }
        isSelected = true;
        bindHTML();
      });
      $("#pageNum").on("click", "font", function (event) {
        let text = event.target.innerText;
        !isNaN(text) ? pageCode = text : null;
        isSelected = true;
        bindHTML();
      });
      $("#pageInput").on("keyup", function (e) {
        e = e || window.event;
        if (e.keyCode !== 13) return void 0;
        let val = Math.round(this.value);
        if (isNaN(val)) return this.value = pageCode;
        val < 1 ? val = 1 : null;
        val > pageTotal ? val = pageTotal : null;
        pageCode = val;
        bindHTML();
      });
      //删除事件
      $("#list").on("click", ".del", function () {
        let userId = $(this.parentNode.parentNode).attr("data-id"),
          flag = confirm((`确定要删除ID为【 ${userId} 】的信息吗`)),
          _this = this;
        if (!flag) return void 0;
        $.ajax({
          type: 'get',
          url: '/removeUser',
          dataType: 'json',
          data: {
            id: userId,
          },
          async: true,
          success: res => {
            if (res && res.code === 0) {
              alert('该数据即将被删除，你确定要这么操作吗？');
              $('#list')[0].removeChild(_this.parentNode.parentNode);
            } else {
              alert('删除数据失败');
            }
            bindHTML();
          },
          error: e => {
          }
        })
      });
      //增加用户
      $('#submit').click(function () {
        $.ajax({
          type: 'post',
          url: '/addUser',
          async: false,
          header: {
            'Content-Type': 'application/json',
          },
          dataType: 'json',
          data: {
            name: $('#name').val(),
            sex: $('#sex').val() === '男' ? 1 : 0,
            score: $('#score').val()
          },
          cache: false,
          success: res => {
            if (res && res.code === 0) {
              alert('成功增加一条用户信息！')
              bindHTML();
              $('form')[0].reset();
            } else {
              alert('增加信息失败了！');
            }
          },
          error: e => {
          }
        })
      });
      //查看和修改用户信息
      $('#list').on('click', '.check', function () {
        localStorage.setItem('defaultPageCode', pageCode);
        let text = $(this.parentNode.parentNode).text();
        let infoAry = text.match(/(.+)\n/gu).slice(0, 4).map(item => item.replace(/\s/g, ''));
        let url = encodeURI('./userInfo.html?id=' + infoAry[0] + '&name=' + infoAry[1] + '&sex=' + infoAry[2] + '&score=' + infoAry[3]);
        window.open(url);
      })
    }
  }
})();
UserList.init();