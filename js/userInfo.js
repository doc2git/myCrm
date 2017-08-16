'use strict';
let userInfo = (event)=>{
  $.ajax({
    type: 'post',
    url: '/changeUserInfo',
    async: false,
    header: {
      'Content-Type': 'application/json',
    },
    dataType: 'json',
    data: {
      id: $('#id').val(),
      name: $('#name').val(),
      sex: $('#sex').val() === '男' ? 1 : 0,
      score: $('#score').val(),
    },
    cache: false,
    success: res => {
      if (res && res.code === 1) {
        alert('修改用户信息失败！');
      } else {
        alert('修改用户信息成功！');
        let target = './userList.html';
        window.location.href = target;
      }
    },
    error: e => {console.log('没有拿到数据返回！')}
  })
};
decodeURI(window.location.href).match(/[^\?&]+=[^\?&]+/gu)
/*
 * 通过正则准备好填入表单value语句，并eval执行的方式,但是有被注入攻击风险，所以不用这方式
//    .map(item => item.replace(
//      /([^=]+)=([^=]+)$/gu, (all, key, val)=>`${key}.value='${val}'`
//    )).forEach(item=>eval("document.querySelector('form')." + item));
//  ) //通过正则准备好填入表单value语句，并eval执行的方式
*/
  .map(item => item.split('='))
  .filter(item=>item[0] !== 'pageCode')
  .forEach(item => $('form')[0][item[0]]['value'] = item[1]);
$('#sub').click(userInfo);
$('#sub').on('keyup', userInfo);
/*
 * console.log('What needs to change in this module?'); 
 * console.log('What would be incoming?');
 * console.log('What would be affected?');
 * console.log('What would be return?');
 */