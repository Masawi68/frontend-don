CREATE TABLE details (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    amount NUMERIC NOT NULL,
    email_updates BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
