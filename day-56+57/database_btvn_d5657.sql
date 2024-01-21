--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    password2 character varying(100) NOT NULL,
    status boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at, updated_at, password2, status) FROM stdin;
30	123	123@gmail.com	$2b$15$tyEMP4BSqesVr6MpnM3EjOWL/PhAAzLsLCVG15AjvtWqt3PzNbqbq	2024-01-21 11:07:34.269+07	2024-01-21 11:07:34.269+07	$2b$15$ZVSmjoevsuyICeAD52tOvefSG7/BB/lChpCJ0nRp.0f8zw2Jj51Oi	\N
11	ponynhinhi	nhinhipony2007@gmail.com	$2b$15$LmLPke0./QAoWZ3mp2xoI.Jmq4pC3967XI4TRai/AEM.jgGJr4ASK	2024-01-19 23:54:25.368+07	2024-01-19 23:54:25.368+07	$2b$15$LmLPke0./QAoWZ3mp2xoI.Jmq4pC3967XI4TRai/AEM.jgGJr4ASK	t
16	Lưu Anh Quân	admin@gmail.com	$2b$15$0DJcIoXV8wSLqX.l90OP0OEMqzvhuca9/ALAF6NYcGRwNXgUvjaWO	2024-01-20 01:35:01.239+07	2024-01-20 01:35:01.239+07	$2b$15$0DJcIoXV8wSLqX.l90OP0OEMqzvhuca9/ALAF6NYcGRwNXgUvjaWO	f
31	sus	sus@gmail.com	$2b$15$tDz5WXmD4nCymXbXN3eEBObyjPp0xnADi4ePWd/BEujfL78SWeZA2	2024-01-22 01:56:23.892+07	2024-01-22 01:56:23.892+07	$2b$15$WSDYQ0ifEagXlj0mxW9upe0SXUvo5LS5Z.a7FUllEJPobxWGaoXxa	f
32	123	123123@gmail.com	$2b$15$H53J9u7Z0WynkA1Gl6JA9uhiO20apcoZeIEdtbRQ195tP4CaDOegK	2024-01-22 01:57:22.811+07	2024-01-22 01:57:22.811+07	$2b$15$qPye36tUyJKN39FlZat4QemCyr6VlBfDLs6gJcGKwLZqHp5MMHdA.	f
33	sus2	sus2@gmail.com	$2b$15$QTsPLusePGPvsxNrHoSYlO7KmJrGfgsQUSAfN91XsaRAhXo4297r2	2024-01-22 01:59:35.016+07	2024-01-22 01:59:35.016+07	$2b$15$M8YqGnX9q2Ln0cOb5w57i.EgTmpXPoUJV8kM3M8/f.cySWX1p4BHm	t
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 33, true);


--
-- Name: users email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

