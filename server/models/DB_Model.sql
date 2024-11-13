// NOTES: Vishal Sharma - I have generated these table script from postgres admin "Pg4" tool after manually creating database and altering schema while i was developing the app

-- Table: public.books

-- DROP TABLE IF EXISTS public.books;

CREATE TABLE IF NOT EXISTS public.books
(
    isbn character varying COLLATE pg_catalog."default" NOT NULL,
    title character varying COLLATE pg_catalog."default" NOT NULL,
    author character varying COLLATE pg_catalog."default" NOT NULL,
    genre character varying COLLATE pg_catalog."default" NOT NULL,
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    CONSTRAINT books_pkey PRIMARY KEY (isbn)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.books
    OWNER to postgres;

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
    username character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    phone character varying COLLATE pg_catalog."default" NOT NULL,
    address character varying COLLATE pg_catalog."default" NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'Unknown'::character varying,
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    CONSTRAINT users_pkey PRIMARY KEY (user_id),
    CONSTRAINT unique_username UNIQUE (username),
    CONSTRAINT users_username_key UNIQUE (username)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

	-- Table: public.users_books

-- DROP TABLE IF EXISTS public.users_books;

CREATE TABLE IF NOT EXISTS public.users_books
(
    users_books_id integer NOT NULL DEFAULT nextval('users_books_users_books_id_seq'::regclass),
    requester integer,
    user_id integer NOT NULL,
    bookisbn character varying COLLATE pg_catalog."default" NOT NULL,
    condition character varying COLLATE pg_catalog."default" NOT NULL,
    request_type smallint,
    request_date timestamp with time zone,
    request_days smallint,
    request_approved boolean,
    rent_price character varying COLLATE pg_catalog."default" DEFAULT 15,
    requester_comment character varying COLLATE pg_catalog."default",
    owner_comment character varying COLLATE pg_catalog."default",
    user_received_status boolean,
    user_ship_status boolean,
    user_ship_date timestamp with time zone,
    requester_ship_date timestamp with time zone,
    requester_ship_status boolean,
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    requester_received_status boolean,
    requester_received_date timestamp with time zone,
    user_received_date timestamp with time zone,
    request_approved_date timestamp with time zone,
    CONSTRAINT users_books_pkey PRIMARY KEY (users_books_id),
    CONSTRAINT users_books_bookisbn_fkey FOREIGN KEY (bookisbn)
        REFERENCES public.books (isbn) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_books_requester_fkey FOREIGN KEY (requester)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_books_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users_books
    OWNER to postgres;

COMMENT ON COLUMN public.users_books.request_type
    IS 'exchange = 0 , rent = 1, ';


-- Table: public.users_books_log

-- DROP TABLE IF EXISTS public.users_books_log;

CREATE TABLE IF NOT EXISTS public.users_books_log
(
    users_books_id integer NOT NULL,
    requester integer,
    user_id integer NOT NULL,
    bookisbn character varying COLLATE pg_catalog."default" NOT NULL,
    condition character varying COLLATE pg_catalog."default" NOT NULL,
    request_type smallint,
    request_date timestamp with time zone,
    request_days smallint,
    request_approved boolean,
    rent_price character varying COLLATE pg_catalog."default" DEFAULT 15,
    requester_comment character varying COLLATE pg_catalog."default",
    owner_comment character varying COLLATE pg_catalog."default",
    user_received_status boolean,
    user_ship_status boolean,
    user_ship_date timestamp with time zone,
    requester_ship_date timestamp with time zone,
    requester_ship_status boolean,
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    requester_received_status boolean,
    requester_received_date timestamp with time zone,
    user_received_date timestamp with time zone,
    request_approved_date timestamp with time zone,
    CONSTRAINT users_books_log_pkey PRIMARY KEY (id),
    CONSTRAINT users_books_bookisbn_fkey FOREIGN KEY (bookisbn)
        REFERENCES public.books (isbn) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_books_requester_fkey FOREIGN KEY (requester)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT users_books_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users_books_log
    OWNER to postgres;