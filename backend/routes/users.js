/* --------------------------------------------------------------------------- */
/* ------------------------- 기본 정의 (Module, DB) -------------------------- */
/* --------------------------------------------------------------------------- */

/* 의존관계 정보 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var fs = require('fs-extra');

/* DB 정보 */
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'hacker',
  password : 'hacker',
  database : 'hacker',
  charset : 'utf8'
})

/* mysql 접속 및 이용할 데이터베이스 설정 */
connection.connect();
connection.query('USE hacker', function(err){
  if(!err)
    console.log('DB OK_ (users)');
  else
    console.log('DB ERR_', err);
})

/* --------------------------------------------------------------------------- */
/* ------------------------ 기본 정의 끝 (Module, DB) ------------------------- */
/* --------------------------------------------------------------------------- */

//페이지뷰 라우팅은 index.js에서 처리

/*------------------------------ 회원 관련 기능 ------------------------------*/
//로그인 여부 확인 알고리즘
router.get('/check', function(req, res){
  if(req.session.user){
    res.json({
      islogin: true
    });
  }
  else{
    res.json({
      islogin: false
    });
  }
});

//로그인 처리 알고리즘
router.post('/login', function(req, res){
  /* 변수 선언 */
  var auth = {
    "id": req.body.user.userid,
    "pw": req.body.user.userpw
  } //양식을 임시 저장할 객체
  var sql = 'SELECT * FROM member'; //Mysql 쿼리 양식

  /* 알고리즘 */

  //디버깅용 로그
  console.log(auth);

  //DB에서 회원정보 읽어와서 사용자가 입력한 내용과 대조
  connection.query(sql, function(err, rows){
    if(err){
      console.log(err);
    }
    else {
      for(var i=0; i<rows.length; i++){
        if(rows[i].id == auth.id && rows[i].pw == auth.pw){
          //세션 생성
          req.session.user = {
            "id" : rows[i].id,
            "nick" : rows[i].nick
          }
          console.log('로그인 처리 - 세션 저장');
          res.json({
            success: 1,
            message: '로그인 되었습니다!'
          })
          return;
        }
      }
      //일치하는 id,pw가 없음
      res.json({
        success: 0,
        message: 'ID와 PW를 다시 확인하여 주십시오!'
      })
     }
  });
});

// 로그아웃 처리 알고리즘
router.get('/logout', function(req, res){
  req.session.destroy();
  console.log('로그아웃 처리 - 세션 삭제');
  res.json({
    success: 1,
    message: '로그아웃 되었습니다!'
  })
});

//회원가입 처리 알고리즘
router.post('/signup', function(req, res){
  /* 변수 선언 */
  //양식을 임시 저장할 객체
  var info = {
    'userid': req.body.user.userid,
    'userpw': req.body.user.userpw,
    'userpwck': req.body.user.userpwck,
    'nick': req.body.user.nick
  };
  //Mysql 쿼리 양식
  var sql = 'INSERT INTO member (id, pw, nick) VALUES(?, ?, ?)';
  var params = [info.userid,info.userpw,info.nick];
  var sql2 = 'SELECT * FROM member WHERE id = "' + info.userid + '"';

  /* 알고리즘 */
  /* const salt = bcrypt.genSaltSync();
  const encryptedPW = bcrypt.hashSync(user.userpw, salt);
  */
  //개인 프로젝트이므로 비밀번호 암호화는.. 생.략.한.다.
  
  //사용자가 입력한 회원가입 양식 검증
  if(info.userid==""||info.userpw==""||info.userpwck==""||info.nick==""){
    res.json ({
      success: 0,
      message: '회원가입 페이지의 모든 양식을 채워 주십시오. 공백은 허용되지 않습니다.'
    });
    return;
  }
  else if(info.userpw!=info.userpwck){
    res.json ({
      success: 0,
      message: '비밀번호와 비밀번호 확인 필드의 값이 서로 다릅니다!'
    });
    return;
  }

  //양식에 문제 없으면 DB에 저장
  connection.query(sql2, function(err, rows2){
    if(err){
      console.log(err);
    }
    else {
      for(var i=0; i<rows2.length; i++){
        if(rows2[i].id == info.userid){
          console.log('아이디 중복');
          res.json ({
            success: 0,
            message: '해당 아이디는 이미 다른 사람이 사용하고 있습니다. 다른 아이디를 입력해 주세요.'
          });
          return;
        }
      }
      connection.query(sql, params, function(err, rows){
        if(err){
          console.log(err);
          res.json ({
            success: 0,
            message: '서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오.'
          });
          return;
        }
        else {
          fs.mkdirSync('public/Files/' + info.userid); //데이터 저장용 폴더 생성
          res.json ({
            success: 1,
            message: '회원가입이 완료되었습니다.'
          });
        }
      });
    }
    //디버깅용 로그
    console.log(info);
  });
});

//회원탈퇴 처리 알고리즘
router.post('/resign', function(req, res){
  /* 변수 선언 */
  //양식을 임시 저장할 객체
  var user = req.session.user;
  var auth = {
    "id": req.body.user.userid,
    "pw": req.body.user.userpw
  }
  //Mysql 쿼리 양식
  var sql = 'SELECT id FROM member WHERE id = ? AND pw = ?';
  var params_s = [auth.id, auth.pw];
  var params_d;
  //폴더 삭제 알고리즘
  var deleteFolderRecursive = function(path){
    //내용물(파일)전부 삭제 후 폴더 삭제 (재귀방식)
    if ( fs.existsSync(path) ){
      fs.readdirSync(path).forEach(function(file,index){
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()){
          //폴더라면 내용물 먼저 재귀 삭제
          deleteFolderRecursive(curPath);
        }
        else{
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }
  /* 알고리즘 */
  //세션정보 검증 (세션정보의 id값으로 DB에서 비밀번호 조회)
  connection.query(sql, params_s, function(err, rows, fields){
    if(err) {
      console.log(err);
    }
    else if (rows[0]==undefined || auth.id != user.id) {
      res.json ({
        success: 0,
        message: '2차 인증이 실패했습니다. ID와 PW를 다시 확인해 주십시오!'
      });
      return;
    } //일치하는 id,pw가 없음
    else {
      console.log('회원탈퇴 처리 시작');
      //회원탈퇴 쿼리
      sql = 'DELETE FROM member WHERE id = ?';
      params_d = auth.id;
      connection.query(sql, params_d, function(err, result){
        if(err) {
          console.log('회원탈퇴 처리 실패 - ', err);
          res.json ({
            success: 0,
            message: '서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오.'
          });
          return;
        }
        else {
          deleteFolderRecursive('public/Files/' + user.id);  //데이터 저장용 폴더 삭제
          res.json ({
            success: 1,
            message: '회원 탈퇴 되었습니다!'
          });
          req.session.destroy();
        }
      });
    }
  });
  //디버깅용 로그
  console.log(auth);
});
/*---------------------------- 회원 관련 기능 끝 ----------------------------*/

//아래 내용은 수정 필요
/* ------------------------- 회원 정보 수정 기능 시작 ------------------------- */

router.post('/modify',  function(req, res){  
  /* 변수 선언 */
  var user = req.session.user;
  var auth = {
    "id": req.body.user.userid,
    "pw": req.body.user.userpw
  }
  //Mysql 쿼리 양식
  var sql = 'SELECT * FROM member WHERE id = ? AND pw = ?';
  var params_s = [auth.id, auth.pw];
  //검증 (세션정보의 id값으로 DB에서 비밀번호 조회)
  connection.query(sql, params_s, function(err, rows, fields){
     if(err) {
      console.log(err);
    }
    else if (rows[0] == undefined || auth.id != user.id) {
      res.json ({
        success: 0,
        message: '2차 인증이 실패했습니다. ID와 PW를 다시 확인해 주십시오!'
      });
      return;
    } //일치하는 id,pw가 없음
    else {
      console.log('회원 정보 수정 시작');
      res.json ({
        success: 1,
        message: '',
        pw: rows[0].pw,
        nick: rows[0].nick,
      });
    }
  });
});

router.post('/remodify', function(req, res){ 
  var user = req.session.user;
  var remodif = {
    "pw": req.body.user.userpw,
    "nick": req.body.user.nick
  }
  //양식 검증용 정규식
  var RegExp1 = /^[0-9]*$/;
  var RegExp2 = /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/;
  //사용자가 입력한 회원정보변경 양식 검증
  if(remodif.pw==""||remodif.nick==""||remodif.email==""||remodif.phone==""){
    res.json ({
      success: 0,
      message: '회원정보변경 양식의 모든 필드를 채워주셔야 합니다. 변경하지 않을 정보는 원래 정보를 입력하십시오 (보안강화 차원의 조치입니다.) 빈 칸은 허용되지 않습니다!'
    });
    return;
  }
  if(!RegExp1.test(remodif.phone)){
    res.json ({
      success: 0,
      message: '전화번호는 숫자만 입력하여 주십시오! ( - 는 생략해 주십시오.)'
    });
    return;
  }
  if(!RegExp2.test(remodif.email)){
    res.json ({
      success: 0,
      message: '이메일 양식이 올바르지 않습니다! (example@service.com 형식으로 입력해 주십시오)'
    });
    return;
  }
  else{
    var sql = 'UPDATE member SET pw = ?, nick = ?, email = ?, phone = ? WHERE id = ?';
    params_m = [remodif.pw, remodif.nick, remodif.email, remodif.phone, user.id];
    connection.query(sql, params_m, function(err, rows, fields){
      if(err) {
        console.log('회원 정보 수정 실패 - ', err);
        res.json ({
          success: 0,
          message: '서버측 사정으로 DB오류가 발생하였습니다. 다음에 다시 이용해 주십시오.'
        });
        return;
      }
     else {
        console.log('회원 정보 수정 완료');
        req.session.user.nick = remodif.nick;
        res.json ({
          success: 1,
          message: '회원 정보가 수정 되었습니다!'
        });
      }
    });
  }
});
/* ------------------------- 회원 정보 수정 기능 끝 ------------------------- */


module.exports = router;