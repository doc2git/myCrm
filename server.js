let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', (req, res) => res.sendFile('./page/userList.html', {root: __dirname}));
app.get('/userInfo.html', (req, res) => res.sendFile('./page/userInfo.html', {root: __dirname}));
app.get('/userList.html', (req, res) => {
  res.sendFile('./page/userList.html', {root: __dirname});
});
let userAllAry = JSON.parse(fs.readFileSync('./data/userList.json', 'utf-8'));
let resObj = {pageTotal: Math.ceil(userAllAry.length / 10)};
let successObj = () => {
  resObj.code = 0;
  resObj.msg = "successed";
  resObj.pageTotal = Math.ceil(userAllAry.length / 10);
};
let failedObj = () => {
  resObj.code = 1;
  resObj.msg = 'some error';
};
app.get('/userInfo', (req, res) => {
  resObj.data = userAllAry.find(item => item.id === Number(req.query.id));
  resObj.data ? successObj() : failedObj();
  res.send(resObj);
});
app.get('/getUserList', (req, res) => {
  let pageCode = req.query.pageCode || 1;
  resObj.data = userAllAry.slice((pageCode - 1) * 10, pageCode * 10);
  resObj.data ? successObj() : failedObj();
  res.send(resObj);
});
app.post('/addUser', (req, res) => {
  let addUserData = req.body;
  let len = addUserData.length;
  addUserData['id'] = userAllAry.slice(-1)[0]['id'] + 1;
  userAllAry.push(addUserData);
  resObj.data = userAllAry;
  resObj.data ? successObj() : failedObj();
  fs.writeFileSync('./data/userList.json', JSON.stringify(userAllAry));
  res.send(resObj);
});
app.get('/removeUser', (req, res) => {
  let removeUserId = req.query['id'];
  let len = userAllAry.length;
  resObj.data = userAllAry = userAllAry.filter(item => item['id'] !== Number(removeUserId));
  userAllAry.length < len ? successObj() : failedObj();
  fs.writeFileSync('./data/userList.json', JSON.stringify(userAllAry));
  res.send(resObj);
});
app.post('/changeUserInfo', (req, res) => {
  let changeUserId = Number(req.body.id);
  let old;
  new Promise((resolve, reject) => {
    resObj.data = userAllAry.find((item, index) => {
      if (Number(item['id']) === Number(changeUserId)) {
        req.body['sex'] = Number(req.body['sex']);
        old = userAllAry.splice(index, 1, req.body)[0];
      }
    });
    if(old && Number(old.id) === changeUserId ){
      successObj();
      resolve(userAllAry[changeUserId - 1]);
    }else{
      failedObj();
      reject('76skdfj: update data in userAllAry failed.')
    }
  }).then(
    () => fs.writeFile('./data/userList.json', JSON.stringify(userAllAry), 'utf-8', err => {
      if (err) console.error('78sdklfj', err);
      console.log('79skdfj: modify data in json file successed!', JSON.parse(fs.readFileSync('./data/userList.json', 'utf-8'))[changeUserId - 1]);
      res.send(resObj);
    }));
});
let port = 3333;
app.listen(port, () => console.log(port + ' ok'));