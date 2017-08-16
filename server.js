let express = require('express');
let bodyParser = require('body-parser');
// let multer = require('multer');
let fs = require('fs');
let app = express();
// let upload = multer();
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', (req, res) => res.sendFile('./page/userList.html', {root: __dirname}));
app.get('/userInfo.html', (req, res) => res.sendFile('./page/userInfo.html', {root: __dirname}));
app.get('/userList.html', (req, res) => res.sendFile('./page/userList.html', {root: __dirname}));
let userAllAry = JSON.parse(fs.readFileSync('./data/userList.json', 'utf-8'));
let resObj = {};
// let resObj = {pageTotal: Math.ceil(userAllAry.length / 10)};
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
  // console.log(resObj.data);
  res.send(resObj);
});
app.post('/addUser', (req, res) => {
  // console.log(req.body);
  // res.json(req.body);
  let addUserData = req.body;
  console.dir(req.body, '36dskj');
  // console.log(JSON.stringify(req.body), '36dskj');
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
  console.log('46lsdfj', userAllAry.filter);
  resObj.data = userAllAry = userAllAry.filter(item => item['id'] !== Number(removeUserId));
  console.log('48lsdfj', userAllAry.length);
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
        old = userAllAry.splice(index, 1, req.body)[0];
        successObj();
      } else {
        failedObj();
      }
    });
    if(old && Number(old.id) === changeUserId ){
      resolve(userAllAry[2]);
    }else{
      reject('76skdfj: update data in userAllAry failed.')
    }
  }).then((a)=>console.log('78sdf: modify account data in userAllAry successed!', a))
    .then(
    () => fs.writeFile('./data/userList.json', JSON.stringify(userAllAry), 'utf-8', err => {
      if (err) console.error(err);
      console.log('82skdfj: modify data in json file successed!', JSON.parse(fs.readFileSync('./data/userList.json', 'utf-8'))[changeUserId - 1]);
    }));
  res.send(resObj);
});
let port = 3333;
app.listen(port, () => console.log(port + ' ok'));