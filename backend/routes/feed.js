/* --------------------------------------------------------------------------- */
/* ------------------------- 기본 정의 (Module, DB) -------------------------- */
/* --------------------------------------------------------------------------- */

/* 의존관계 정보 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var multer = require('multer');
var fs = require("fs-extra");

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
    console.log('DB OK_ (post)');
  else
    console.log('DB ERR_', err);
})

/* --------------------------------------------------------------------------- */
/* ------------------------ 기본 정의 끝 (Module, DB) ------------------------- */
/* --------------------------------------------------------------------------- */

//페이지뷰 라우팅은 index.js에서 처리

/*------------------------------ 게시물 목록 로드 기능 ------------------------------*/
router.get('/load', function(req, res){
    var sql = 'SELECT * FROM post';

    connection.query(sql, function(err, rows){
        if(err){
            console.log('게시물 정보 조회 실패 - ', err);
            res.json(null);
            return;
        }
        else{
            /* 엔터 쳐주는 기능이나.. Vue에 Raw HTML 출력 옵션을 주면 XSS 공격에 취약하다고 하여 일단 보류
            for(var i = 0; i < rows2.length; i++){
                rows[i].post_text.replace(/(?:\r\n|\r|\n)/g, '<br />');
            }
            */
            res.json(rows);
        }
    });
});
/*---------------------------- 게시물 목록 로드 기능 끝 ----------------------------*/

/*------------------------------ 게시물 작성 기능(기본) ------------------------------*/
router.post('/write', function(req, res){
    //텍스트의 post_type == 0
    //이미지의 post_type == 1
    //동영상의 post_type == 2
    //외부 동영상의 post_type == 3
    var user = req.session.user;
    var url = req.body.url;
    var title = req.body.title;
    var text = req.body.text;
    var rawtag = req.body.tag;
    var tags;
    var type = req.body.type;
    var sql = 'INSERT INTO post (post_file, post_type, post_title, post_text, post_tag1, post_tag2, post_tag3, post_tag4, post_tag5, post_nick) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var params;

    //게시물 양식 검증
    if(title == ''){
        fs.unlink('public/' + url);
        res.json({
            success: 0,
            message: '게시물 제목을 작성해주세요'
        });
        return;
    }
    if(title.length > 50){
        fs.unlink('public/' + url);
        res.json({
            success: 0,
            message: '게시물 제목은 50자 이하여야 합니다.'
        });
        return;
    }
    if(text == ''){
        fs.unlink('public/' + url);
        res.json({
            success: 0,
            message: '게시물 내용을 작성해주세요'
        });
        return;
    }
    if(text.length > 5000){
        fs.unlink('public/' + url);
        res.json({
            success: 0,
            message: '게시물 내용은 5000자 이하여야 합니다.'
        });
        return;
    }

    //태그 5개 구분
    tags = rawtag.split(',', 5);

    params = [url, type, title, text, tags[0], tags[1], tags[2], tags[3], tags[4], user.nick]
    connection.query(sql, params, function(err){
        if(err){
            console.log('게시물 작성 실패 - ', err);
            fs.unlink('public/' + url);
            res.json({
                success: 0,
                message: 'DB 오류'
            });
        }
        else{
            res.json({
                success: 1,
                message: '작성 되었습니다.'
            });
        }
    });
});
/*---------------------------- 게시물 작성 기능 (기본) 끝 ----------------------------*/

/*------------------------------ 게시물 작성 기능(파일) ------------------------------*/
router.post('/uploadfile', function(req, res){
    var user = req.session.user;
    var fileroute;
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const ls = 'public/Files/' + user.id;
            console.log(ls);
            cb(null, ls);
        },
        filename: function (req, file, cb) {
            const name = file.originalname;
            console.log(name);
            cb(null, name);
        }
    });
    var upload = multer({storage: storage}).single("files");
    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            res.json({
                success: 0,
                message: '파일 업로드 실패'
            });
        }
        else {
            console.log('업로드 완료');
            fileroute = 'Files/' + user.id + '/' + req.file.originalname;
            console.log(fileroute);
            res.json({
                success: 1,
                message: '파일 업로드 완료',
                route: fileroute
            });
        }
    });
});
/*---------------------------- 게시물 작성 기능 (파일) 끝 ----------------------------*/

/*------------------------------ 게시물 수정 기능 ------------------------------*/
router.post('/loadmodify', function(req, res){
    let keyword = req.body.keyword;
    let sql = 'SELECT post_title, post_text FROM post where post_num = "' + keyword + '"';
    connection.query(sql, function(err,rows){
        if(err){
            console.log('게시물 정보 조회 실패 - ', err);
            res.json({
                success: 0,
                message: 'DB 조회 오류'
            });
        }
        else{
            res.json({
                success: 1,
                newtitle: rows[0].post_title,
                newtext: rows[0].post_text
            });
        }
    });
});

router.post('/modify', function(req, res){
    let keyword = req.body.keyword;
    let title = req.body.newtitle;
    let text = req.body.newtext;
    let rawtag = req.body.newtag;
    let tags;
    let sql = 'UPDATE post SET post_title = ?, post_text = ?, post_tag1 = ?, post_tag2 = ?, post_tag3 = ?, post_tag4 = ?, post_tag5 = ? where post_num = "' + keyword + '"';
    let params = [];

    if(title == ''){
        res.json({
            success: 0,
            message: '게시물 제목을 작성해주세요'
        });
        return;
    }
    if(title.length > 50){
        res.json({
            success: 0,
            message: '게시물 제목은 50자 이하여야 합니다.'
        });
        return;
    }
    if(text == ''){
        res.json({
            success: 0,
            message: '게시물 내용을 작성해주세요'
        });
        return;
    }
    if(text.length > 5000){
        res.json({
            success: 0,
            message: '게시물 내용은 5000자 이하여야 합니다.'
        });
        return;
    }

    //태그 5개 구분
    tags = rawtag.split(',', 5);
    params = [title, text, tags[0], tags[1], tags[2], tags[3], tags[4]];
    connection.query(sql, params, function(err){
        if(err){
            console.log('게시물 정보 업데이트 실패 - ', err);
            res.json({
                success: 0,
                message: 'DB 조회 오류'
            });
            return;
        }
        else{
            res.json({
                success: 1,
                message: '게시물이 수정되었습니다'
            });
        }
    });
});
/*---------------------------- 게시물 수정 기능 끝 ----------------------------*/

/*------------------------------ 게시물 삭제 기능 ------------------------------*/
router.post('/remove', function(req, res){
    var keyword = req.body.keyword;
    var sql1 = 'SELECT post_file FROM post where post_num = "' + keyword + '"';
    var sql2 = 'DELETE FROM post where post_num = "' + keyword + '"';
    connection.query(sql1, function(err1, rows1){
        if(err1){
            console.log('게시물 정보 조회 실패 - ', err);
            res.json({
                success: 0,
                message: 'DB 조회 오류'
            });
            return;
        }
        else{
            fs.unlink('public/' + rows1[0].post_file);
            connection.query(sql2, function(err2){
                if(err2){
                    res.json({
                        success: 0,
                        message: 'DB 삭제 오류'
                    });
                    return;
                }
                else{
                    res.json({
                        success: 1,
                        message: '삭제되었습니다'
                    });
                }
            });
        }
    });
});
/*---------------------------- 게시물 삭제 기능 끝 ----------------------------*/

/*---------------------------- 게시물 좋아요 기능 끝 ----------------------------*/
router.post('/like', function(req, res){
    let keyword = req.body.keyword;
    let sql = 'UPDATE post SET post_like = post_like + 1 where post_num = "' + keyword + '"';
    connection.query(sql, function(err){
        if(err){
            console.log('게시물 정보 업데이트 실패 - ', err);
            res.json({
                message: 'DB 조회 오류'
            });
            return;
        }
        else{
            res.json({
                message: '해당 게시물을 좋아합니다.'
            });
        }
    });
});
/*---------------------------- 게시물 좋아요 기능 끝 ----------------------------*/

/*---------------------------- 게시물 제목 검색 기능 ----------------------------*/
router.post('/searchpostbytitle', function(req, res){
    let keyword = req.body.keyword;
    let keyword2 = '%' + req.body.keyword + '%';
    let sql = 'SELECT * FROM post WHERE post_title LIKE ?';
    let params = [keyword2, keyword2, keyword, keyword, keyword, keyword, keyword];
    //태그는 키워드와 정확하게 일치하여야만 검색대상
    //제목이나 내용은 키워드와 유사하면 검색대상
    if(keyword == ''){
        console.log('검색 키워드가 비어있습니다.');
        res.json(null);
        return;
    }
    connection.query(sql, params, function(err, rows){
        if(err){
            console.log('게시물 검색 실패 - ', err);
            res.json(null);
            return;
        }
        else{
            res.json(rows);
        }
    });
});
/*---------------------------- 게시물 제목 검색 기능 끝 ----------------------------*/

/*---------------------------- 게시물 내용 검색 기능 ----------------------------*/
router.post('/searchpostbytitle', function(req, res){
    let keyword = req.body.keyword;
    let keyword2 = '%' + req.body.keyword + '%';
    let sql = 'SELECT * FROM post WHERE post_text LIKE ?';
    let params = [keyword2, keyword2, keyword, keyword, keyword, keyword, keyword];
    //태그는 키워드와 정확하게 일치하여야만 검색대상
    //제목이나 내용은 키워드와 유사하면 검색대상
    if(keyword == ''){
        console.log('검색 키워드가 비어있습니다.');
        res.json(null);
        return;
    }
    connection.query(sql, params, function(err, rows){
        if(err){
            console.log('게시물 검색 실패 - ', err);
            res.json(null);
            return;
        }
        else{
            res.json(rows);
        }
    });
});
/*---------------------------- 게시물 내용 검색 기능 끝 ----------------------------*/

/*---------------------------- 게시물 태그 검색 기능 ----------------------------*/
router.post('/searchpostbytitle', function(req, res){
    let keyword = req.body.keyword;
    let keyword2 = '%' + req.body.keyword + '%';
    let sql = 'SELECT * FROM post WHERE post_tag1 = ? OR post_tag2 = ? OR post_tag3 = ? OR post_tag4 = ? OR post_tag5 = ?';
    let params = [keyword2, keyword2, keyword, keyword, keyword, keyword, keyword];
    //태그는 키워드와 정확하게 일치하여야만 검색대상
    //제목이나 내용은 키워드와 유사하면 검색대상
    if(keyword == ''){
        console.log('검색 키워드가 비어있습니다.');
        res.json(null);
        return;
    }
    connection.query(sql, params, function(err, rows){
        if(err){
            console.log('게시물 검색 실패 - ', err);
            res.json(null);
            return;
        }
        else{
            res.json(rows);
        }
    });
});
/*---------------------------- 게시물 태그 검색 기능 끝 ----------------------------*/

/*---------------------------- 게시물 작성자 검색 기능 ----------------------------*/
router.post('/searchpostbytitle', function(req, res){
    let keyword = req.body.keyword;
    let keyword2 = '%' + req.body.keyword + '%';
    let sql = 'SELECT * FROM post WHERE post_nick = ?';
    let params = [keyword2, keyword2, keyword, keyword, keyword, keyword, keyword];
    //태그는 키워드와 정확하게 일치하여야만 검색대상
    //제목이나 내용은 키워드와 유사하면 검색대상
    if(keyword == ''){
        console.log('검색 키워드가 비어있습니다.');
        res.json(null);
        return;
    }
    connection.query(sql, params, function(err, rows){
        if(err){
            console.log('게시물 검색 실패 - ', err);
            res.json(null);
            return;
        }
        else{
            res.json(rows);
        }
    });
});
/*---------------------------- 게시물 작성자 검색 기능 끝 ----------------------------*/

module.exports = router;