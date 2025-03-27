const express = require('express');
const app = express();
const PORT = 3000;
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
app.use(cors());
app.use(express.json());


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

app.get("/movies", (req, res) => {
    const db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
            console.error('데이터베이스 연결 오류:', err.message);
            return res.status(500).json({ error: '데이터베이스 연결 오류' });
        }
    });

    db.all(`
        SELECT id, title, original_title, poster_path, vote_average 
        FROM movies
    `, [], (err, rows) => {
        if (err) {
            console.error('쿼리 실행 오류:', err.message);
            return res.status(500).json({ error: '쿼리 실행 오류' });
        }
        res.json(rows);
    });

    db.close((err) => {
        if (err) {
            console.error('데이터베이스 종료 오류:', err.message);
        }
    });
});

// 영화 상세 정보 API
app.get("/movies/:id", (req, res) => {
    const movieId = req.params.id;
    const db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
            console.error('데이터베이스 연결 오류:', err.message);
            return res.status(500).json({ error: '데이터베이스 연결 오류' });
        }
    });

    db.get(`
        SELECT * FROM movies WHERE id = ?
    `, [movieId], (err, row) => {
        if (err) {
            console.error('쿼리 실행 오류:', err.message);
            return res.status(500).json({ error: '쿼리 실행 오류' });
        }
        if (!row) {
            return res.status(404).json({ error: '영화를 찾을 수 없습니다.' });
        }
        res.json(row);
    });

    db.close((err) => {
        if (err) {
            console.error('데이터베이스 종료 오류:', err.message);
        }
    });
});

// 댓글 작성 API
// 댓글을 삽입하는 API
// 댓글 작성 API
app.post('/movies/:id/comments', (req, res) => {
    const movieId = req.params.id;
    const { comment } = req.body;  // 댓글 내용을 body에서 가져옵니다.

    // 댓글 내용이 비어있는지 확인
    if (!comment) {
        return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    // 데이터베이스 쿼리 실행
    const db = new sqlite3.Database(dbFilePath, (err) => {
        if (err) {
            console.error('데이터베이스 연결 오류:', err.message);
            return res.status(500).json({ error: '데이터베이스 연결 오류' });
        }
    });

    const query = `INSERT INTO comments (movie_id, comment) VALUES (?, ?)`;
    db.run(query, [movieId, comment], function (err) {
        if (err) {
            console.error('댓글 삽입 오류:', err.message);
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
        // 성공적으로 추가된 경우
        res.status(201).json({ message: '댓글이 성공적으로 추가되었습니다.' });
    });

    db.close((err) => {
        if (err) {
            console.error('데이터베이스 종료 오류:', err.message);
        }
    });
});



// 댓글 불러오기 API
app.get("/movies/:id/comments", (req, res) => {
    const movieId = req.params.id;

    const db = new sqlite3.Database('movies.db');
    const sql = `SELECT * FROM comments WHERE movie_id = ?`;

    db.all(sql, [movieId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "댓글을 불러오는 중 오류가 발생했습니다." });
        }
        res.status(200).json(rows);
    });

    db.close();
});


// 회원가입

// 로그인

// 검색



