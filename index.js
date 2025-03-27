const express = require('express');
const app = express();
const PORT = 3000;
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
app.use(cors());


app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

// 영화 목록
// 

const dbFilePath = 'movies.db'; // SQLite 데이터베이스 경로

// /movies 엔드포인트에서 영화 정보를 JSON 형식으로 반환
app.get("/movies", (req, res) => {
    // SQLite 데이터베이스 연결
    const db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
            console.error('데이터베이스 연결 오류:', err.message);
            return res.status(500).json({ error: '데이터베이스 연결 오류' });
        }
    });

    // 데이터베이스에서 id, title, original_title, poster_path, vote_average 정보를 쿼리
    db.all(`
        SELECT id, title, original_title, poster_path, vote_average 
        FROM movies
    `, [], (err, rows) => {
        if (err) {
            console.error('쿼리 실행 오류:', err.message);
            return res.status(500).json({ error: '쿼리 실행 오류' });
        }

        // 쿼리 결과를 JSON 형태로 응답
        res.json(rows);
    });

    // 데이터베이스 연결 종료
    db.close((err) => {
        if (err) {
            console.error('데이터베이스 종료 오류:', err.message);
        }
    });
});



// 영화 상세글
// 대충 다 보여주면 될듯

// 회원가입

// 로그인

// 검색



