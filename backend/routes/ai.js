/* --------------------------------------------------------------------------- */
/* ------------------------- 기본 정의 (Module, DB) -------------------------- */
/* --------------------------------------------------------------------------- */

/* 의존관계 정보 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

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
    console.log('DB OK_ (AI)');
  else
    console.log('DB ERR_', err);
})

/* --------------------------------------------------------------------------- */
/* ------------------------ 기본 정의 끝 (Module, DB) ------------------------- */
/* --------------------------------------------------------------------------- */

/* ------------------------ 인공지능 처리상태 리스트 갱신 기능 ------------------------ */
router.get('/list', function(req, res){
    var user = req.session.user;
    var sql = 'SELECT * FROM ai WHERE ai_user = ?';
    var params = ['test']
    connection.query(sql, params, function(err, rows){
        if(err){
            console.log('AI 요청 큐 조회 실패 - ', err);
            res.json({
                success: 0,
                message: 'DB 오류'
            });
        }
        else{
            res.json(rows);
        }
    });
});
/* ----------------------- 인공지능 처리상태 리스트 갱신 기능 끝 ----------------------- */

/* ------------------------ 인공지능 처리명령 Request 기능 ------------------------ */
router.post('/request', function(req, res){
    //var user = req.session.user;
    var task = req.body.request.task;
    var isTest = req.body.request.isTest;
    var isArdu = req.body.request.isArdu;
    var status = 'wait';
    var sql = 'INSERT INTO ai (ai_user, ai_istest, ai_isArdu, ai_task, ai_status) VALUES(?, ?, ?, ?, ?)';
    var params = ['test', isTest, isArdu, task, status];

    connection.query(sql, params, function(err){
        if(err){
            console.log('AI 요청 큐 추가 실패 - ', err);
            res.json({
                success: 0,
                message: 'DB 오류'
            });
        }
        else{
            res.json({
                success: 1,
                message: '인공지능 대기열에 작업이 추가 되었습니다.'
            });
        }
    });
});
/* ------------------------ 인공지능 처리명령 Request 기능 끝 ------------------------ */

/* ------------------------- 인공지능 처리결과 Response 기능 ------------------------- */
router.post('/response', function(req, res){
    var user = req.session.user;
    var taskid = req.body.id;
    var sql = 'SELECT * FROM ai WHERE ai_id = ? AND ai_user = ?';
    var params = [user.nick, taskid];

    connection.query(sql, params, function(err, rows){
        if(err){
            console.log('AI 처리 결과 조회 실패 - ', err);
            res.json({
                success: 0,
                message: 'DB 오류'
            });
        }
        else{
            if(rows[0].status != 'done'){
                res.json({
                    success: 0,
                    message: '아직 해당 프로세스가 완료되지 않았습니다. AI가 열심히 일하고 있으니 잠시만 기다려주시기 바랍니다.'
                })
                return;
            }
            else{
                res.json({
                    success: 1,
                    result: rows[0].result,
                    task: rows[0].task
                });
            }
        }
    });
});
/* ------------------------ 인공지능 처리결과 Response 기능 끝 ------------------------ */

module.exports = router;