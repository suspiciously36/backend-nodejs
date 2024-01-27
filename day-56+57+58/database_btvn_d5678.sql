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
-- Name: user_agent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_agent (
    id integer NOT NULL,
    user_id integer,
    device_type character varying(100),
    os_name character varying(100),
    client_name character varying(100),
    logout_time timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    user_agent character varying,
    login_time timestamp with time zone,
    is_logged_in boolean
);


ALTER TABLE public.user_agent OWNER TO postgres;

--
-- Name: user_agent_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_agent ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_agent_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


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
-- Data for Name: user_agent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_agent (id, user_id, device_type, os_name, client_name, logout_time, created_at, updated_at, user_agent, login_time, is_logged_in) FROM stdin;
116	16	desktop	Windows	Microsoft Edge	2024-01-27 13:37:07.105144+07	2024-01-27 02:20:33.967+07	2024-01-27 13:37:07.1+07	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0	2024-01-27 13:37:02.562246+07	f
115	16	desktop	Windows	Chrome	2024-01-27 13:31:36.189488+07	2024-01-27 02:17:08.622+07	2024-01-27 13:48:30.59+07	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36	2024-01-27 13:48:30.594777+07	t
114	16	smartphone	iOS	Mobile Safari	2024-01-27 13:30:39.774541+07	2024-01-27 02:13:54.097+07	2024-01-27 13:30:39.769+07	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	2024-01-27 03:10:21.656324+07	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at, updated_at, status) FROM stdin;
16	Sustyrene	admin@gmail.com	$2b$15$BKL8JhgWscSn06L8M7YWn.0zPAzfex9.XD9b5BDdC.htpkkXlNUSe	2024-01-20 01:35:01.239+07	2024-01-27 13:43:24.465+07	t
11	ponynhinhi	nhinhipony2007@gmail.com	$2b$15$LmLPke0./QAoWZ3mp2xoI.Jmq4pC3967XI4TRai/AEM.jgGJr4ASK	2024-01-19 23:54:25.368+07	2024-01-19 23:54:25.368+07	t
31	sus	sus@gmail.com	$2b$15$tDz5WXmD4nCymXbXN3eEBObyjPp0xnADi4ePWd/BEujfL78SWeZA2	2024-01-22 01:56:23.892+07	2024-01-22 01:56:23.892+07	f
\.


--
-- Name: user_agent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_agent_id_seq', 116, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 34, true);


--
-- Name: users email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT email_unique UNIQUE (email);


--
-- Name: user_agent user_agent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_agent
    ADD CONSTRAINT user_agent_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: user_agent user_agent_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_agent
    ADD CONSTRAINT user_agent_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

