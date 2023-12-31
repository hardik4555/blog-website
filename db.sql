CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    author VARCHAR(255),
    data TIMESTAMP
);