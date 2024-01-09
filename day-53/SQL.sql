-- CREATE DATABASE:
CREATE DATABASE database_02_tuankietk4
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- CREATE TABLES:
CREATE TABLE IF NOT EXISTS public.customers
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    phone character varying COLLATE pg_catalog."default" NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT customers_id_key PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.order_detail
(
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT order_and_product_id_primary PRIMARY KEY (order_id, product_id),
    CONSTRAINT order_detail_order_id_foreign FOREIGN KEY (order_id)
        REFERENCES public.orders (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT order_detail_product_id_foreign FOREIGN KEY (product_id)
        REFERENCES public.products (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.orders
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    customer_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    status character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT order_id_primary PRIMARY KEY (id),
    CONSTRAINT order_customer_id_foreign FOREIGN KEY (customer_id)
        REFERENCES public.customers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.products
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    price real NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT product_id_primary PRIMARY KEY (id)
)


-- DATA

INSERT INTO products (name, price, quantity)
VALUES  ('Sản phẩm 01', 10000, 101),
		('Sản phẩm 02', 20000, 101),
		('Sản phẩm 03', 30000, 101),
		('Sản phẩm 04', 40000, 101),
		('Sản phẩm 05', 50000, 101),
		('Sản phẩm 06', 60000, 101)
		
INSERT INTO customers (name, email, phone)
VALUES  ('Khách hàng 01', 'khachhang01@gmail.com', '0966322701'),
		('Khách hàng 02', 'khachhang02@gmail.com', '0966322702'),
		('Khách hàng 03', 'khachhang03@gmail.com', '0966322703'),
		('Khách hàng 04', 'khachhang04@gmail.com', '0966322704'),
		('Khách hàng 05', 'khachhang05@gmail.com', '0966322705'),
		('Khách hàng 06', 'khachhang06@gmail.com', '0966322706')
		
INSERT INTO orders (customer_id, status)
VALUES  (1, 'pending'),
		(2, 'pending'),
		(1, 'success'),
		(4, 'success'),
		(1, 'cancelled'),
		(6, 'cancelled')
		
INSERT INTO order_detail (order_id, product_id, quantity)
VALUES  (1, 2, 30),
		(1, 3, 5),
		(1, 4, 10),
		
		(2, 1, 15),
		(3, 4, 10),
		(4, 5, 15),
		(5, 4, 10),
		(6, 5, 15)


-- QUERY
-- #1. Xem danh sách sản phẩm
SELECT 
c.name AS customer_name, c.email, c.phone,
total_quantity, total_price, o.status, o.created_at

FROM orders AS o
INNER JOIN customers AS c
ON c.id = o.customer_id

INNER JOIN (SELECT od.order_id, sum(quantity) AS total_quantity 
			FROM order_detail AS od
			GROUP BY order_id) AS tq
ON tq.order_id = o.id

INNER JOIN (SELECT od.order_id, sum(p.price * od.quantity) AS total_price 
			FROM order_detail AS od
			JOIN products AS p
			ON p.id = od.product_id
			GROUP BY od.order_id) AS tp
ON tp.order_id = o.id

-- #2. Xem chi tiết đơn hàng

-- Xem chi tiết đơn hàng với id=1 (Không bao gồm danh sách sản phẩm trong đơn hàng)
SELECT 
c.name AS customer_name, c.email, c.phone, o.status, o.created_at, o.updated_at
FROM orders AS o
INNER JOIN customers AS c
ON c.id = o.customer_id
WHERE o.id = 1


-- Danh sách sản phẩm của đơn hàng với id=1
SELECT 
p.name AS product_name, od.product_id, p.price, od.quantity, (p.price * od.quantity) AS total_price
FROM order_detail AS od
INNER JOIN products AS p
ON od.product_id = p.id
WHERE od.order_id=1


-- Xem tổng hợp thông tin của tất cả đơn hàng:
SELECT c.name AS customer_name, c.email, c.phone, p.name AS product_name, od.product_id, p.price, od.quantity, (p.price * od.quantity) AS total_price,
o.status, o.created_at, o.updated_at

FROM customers AS c
INNER JOIN order_detail AS od
ON c.id = od.order_id
INNER JOIN products AS p
ON od.product_id = p.id
INNER JOIN orders AS o
ON c.id = o.customer_id
-- WHERE od.order_id = 1 
-- ^ Undo comment để xem chi tiết từng đơn hàng theo id
GROUP BY customer_name, c.email, c.phone, product_name, od.product_id, p.price, od.quantity, o.status, o.created_at, o.updated_at
ORDER BY customer_name
