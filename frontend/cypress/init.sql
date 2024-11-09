--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0 (Debian 17.0-1.pgdg120+1)
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: access_rights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.access_rights
(
    id          uuid NOT NULL,
    code        character varying(255),
    description character varying(255)
);


ALTER TABLE public.access_rights
    OWNER TO postgres;

--
-- Name: access_rights_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.access_rights_roles
(
    role_id          uuid NOT NULL,
    access_rights_id uuid NOT NULL
);


ALTER TABLE public.access_rights_roles
    OWNER TO postgres;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses
(
    id            uuid NOT NULL,
    city          character varying(255),
    postal_code   character varying(255),
    street        character varying(255),
    street_number character varying(255)
);


ALTER TABLE public.addresses
    OWNER TO postgres;

--
-- Name: application_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_settings
(
    id    uuid NOT NULL,
    name  character varying(255),
    value character varying(255)
);


ALTER TABLE public.application_settings
    OWNER TO postgres;

--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns
(
    id          uuid                   NOT NULL,
    description character varying(255),
    name        character varying(255) NOT NULL,
    start_date  date                   NOT NULL
);


ALTER TABLE public.campaigns
    OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories
(
    id   uuid                   NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.categories
    OWNER TO postgres;

--
-- Name: categories_companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories_companies
(
    company_id  uuid NOT NULL,
    category_id uuid NOT NULL
);


ALTER TABLE public.categories_companies
    OWNER TO postgres;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments
(
    id                 uuid                           NOT NULL,
    comment            character varying(255)         NOT NULL,
    date               timestamp(6) without time zone NOT NULL,
    contact_journey_id uuid                           NOT NULL,
    user_id            uuid                           NOT NULL
);


ALTER TABLE public.comments
    OWNER TO postgres;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies
(
    id            uuid                           NOT NULL,
    deleted       boolean                        NOT NULL,
    deleted_date  timestamp(6) without time zone,
    email         character varying(255),
    fax           character varying(255),
    insert_date   timestamp(6) without time zone NOT NULL,
    name          character varying(255)         NOT NULL,
    phone         character varying(255),
    update_date   timestamp(6) without time zone NOT NULL,
    www           character varying(255),
    address_id    uuid,
    updated_by_id uuid                           NOT NULL
);


ALTER TABLE public.companies
    OWNER TO postgres;

--
-- Name: contact_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_events
(
    id                 uuid                   NOT NULL,
    date               timestamp(6) without time zone,
    description        character varying(255) NOT NULL,
    event_type         character varying(255),
    contact_journey_id uuid                   NOT NULL,
    contact_person_id  uuid,
    user_id            uuid                   NOT NULL,
    CONSTRAINT contact_events_event_type_check CHECK (((event_type)::text = ANY
                                                       (ARRAY [('ASSIGNED'::character varying)::text, ('CALL_LATER'::character varying)::text, ('NOT_INTERESTED'::character varying)::text, ('INTERNSHIP'::character varying)::text, ('WAITING_FOR_RESPONSE'::character varying)::text, ('BARTER'::character varying)::text, ('SPONSOR'::character varying)::text, ('TRAINING'::character varying)::text, ('DIFFERENT_FORM_PARTNERSHIP'::character varying)::text, ('CALL_NEXT_YEAR'::character varying)::text, ('I_HAVE_TO_CONTACT_COMPANY'::character varying)::text, ('COMPANY_WILL_REACH_OUT'::character varying)::text])))
);


ALTER TABLE public.contact_events
    OWNER TO postgres;

--
-- Name: contact_journeys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_journeys
(
    id               uuid                           NOT NULL,
    campaign_id      uuid                           NOT NULL,
    contact_status   character varying(255)         NOT NULL,
    finished         boolean                        NOT NULL,
    journey_start    timestamp(6) without time zone NOT NULL,
    last_interaction timestamp(6) without time zone,
    company_id       uuid                           NOT NULL,
    user_id          uuid,
    CONSTRAINT contact_journeys_contact_status_check CHECK (((contact_status)::text = ANY
                                                             (ARRAY [('ASSIGNED'::character varying)::text, ('CALL_LATER'::character varying)::text, ('NOT_INTERESTED'::character varying)::text, ('INTERNSHIP'::character varying)::text, ('WAITING_FOR_RESPONSE'::character varying)::text, ('BARTER'::character varying)::text, ('SPONSOR'::character varying)::text, ('TRAINING'::character varying)::text, ('DIFFERENT_FORM_PARTNERSHIP'::character varying)::text, ('CALL_NEXT_YEAR'::character varying)::text, ('I_HAVE_TO_CONTACT_COMPANY'::character varying)::text, ('COMPANY_WILL_REACH_OUT'::character varying)::text])))
);


ALTER TABLE public.contact_journeys
    OWNER TO postgres;

--
-- Name: contact_persons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_persons
(
    id         uuid                   NOT NULL,
    comment    character varying(255),
    committee  character varying(255),
    email      character varying(255),
    is_alumni  boolean                NOT NULL,
    name       character varying(255) NOT NULL,
    phone      character varying(255),
    "position" character varying(255),
    company_id uuid                   NOT NULL
);


ALTER TABLE public.contact_persons
    OWNER TO postgres;

--
-- Name: failed_emails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.failed_emails
(
    id        uuid NOT NULL,
    content   character varying(255),
    date      timestamp(6) without time zone,
    recipient character varying(255),
    subject   character varying(255)
);


ALTER TABLE public.failed_emails
    OWNER TO postgres;

--
-- Name: favourite_journey; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favourite_journey
(
    id                 uuid NOT NULL,
    user_id            uuid,
    contact_journey_id uuid
);


ALTER TABLE public.favourite_journey
    OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications
(
    id         uuid    NOT NULL,
    date       timestamp(6) without time zone,
    journey_id uuid,
    seen       boolean NOT NULL,
    text       character varying(255),
    user_id    uuid
);


ALTER TABLE public.notifications
    OWNER TO postgres;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens
(
    id          uuid NOT NULL,
    expiry_date timestamp(6) without time zone,
    token       character varying(255),
    user_id     uuid NOT NULL
);


ALTER TABLE public.password_reset_tokens
    OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles
(
    id          uuid NOT NULL,
    description character varying(255),
    is_local    character varying(255),
    name        character varying(255),
    sort_order  character varying(255)
);


ALTER TABLE public.roles
    OWNER TO postgres;

--
-- Name: scheduled_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scheduled_contacts
(
    id            uuid NOT NULL,
    contact_date  timestamp(6) without time zone,
    note          character varying(255),
    reminder_date timestamp(6) without time zone,
    company_id    uuid,
    user_id       uuid
);


ALTER TABLE public.scheduled_contacts
    OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students
(
    id   integer NOT NULL,
    name character varying(100),
    age  integer
);


ALTER TABLE public.students
    OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_groups
(
    id         uuid                   NOT NULL,
    entry_code character varying(255),
    name       character varying(255) NOT NULL
);


ALTER TABLE public.user_groups
    OWNER TO postgres;

--
-- Name: user_groups_campaign_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_groups_campaign_list
(
    user_group_id    uuid NOT NULL,
    campaign_list_id uuid NOT NULL
);


ALTER TABLE public.user_groups_campaign_list
    OWNER TO postgres;

--
-- Name: user_groups_user_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_groups_user_list
(
    user_group_id uuid NOT NULL,
    user_list_id  uuid NOT NULL
);


ALTER TABLE public.user_groups_user_list
    OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users
(
    id              uuid                           NOT NULL,
    accepted        boolean                        NOT NULL,
    active          boolean                        NOT NULL,
    created_at      timestamp(6) without time zone NOT NULL,
    email           character varying(255)         NOT NULL,
    name            character varying(255)         NOT NULL,
    password        character varying(255)         NOT NULL,
    profile_picture bytea,
    surname         character varying(255)         NOT NULL
);


ALTER TABLE public.users
    OWNER TO postgres;

--
-- Name: users_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_roles
(
    user_id  uuid NOT NULL,
    roles_id uuid NOT NULL
);


ALTER TABLE public.users_roles
    OWNER TO postgres;

--
-- Name: users_user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_user_groups
(
    user_id        uuid NOT NULL,
    user_groups_id uuid NOT NULL
);


ALTER TABLE public.users_user_groups
    OWNER TO postgres;

--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Data for Name: access_rights; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.access_rights (id, code, description) FROM stdin;
40388658-e9e0-421a-aa7e-16d32d98668e	campaign_modification	Dodawanie akcji
02c74921-443f-4e93-9cc3-c60d50a45c49	role_modification	Modyfikacja definicji roli
effafd0b-b8c2-44d6-a9db-394908bcd092	user_role_granting	Modyfikacja roli użytkownika
da5e5354-c9c8-4883-8ebd-abf43732abe7	company_modification	Modyfikacja firm
71a7e96a-3f60-47d5-948e-bc38facbc9cc	category_modification	Modyfikacja branż
3e979033-81de-4765-9d72-c25c92dc2fc2	user_acceptance	Akceptowanie użytkowników
9e30921e-91e8-4f0c-ab7f-f7c71b20f93b	user_management	Deaktywowanie użytkowników
44ddeea9-053f-4f71-8d69-3c6cbd76cc82	journey_creation	Przypisywanie firm do siebie
008531af-eebf-444d-81e1-f315699ada4b	user_group_modification	Modyfikacja grup użytkowników
b17b5b1c-ac49-4ff4-8247-cd60dff4bc25	journey_creation_for_others	Przypisywanie firm do innych
c61f0f2e-0cee-48e7-abff-a644570922cd	journey_modification_for_others	Edycja kontaktów innych
e31a31d7-8fbd-4fdf-8d7b-f8ed86d8e9ad	app_settings	Ustawienia aplikacji
d4ca85f7-4501-45fd-8251-b285660e585b	user_viewing	Przeglądanie listy użytkowników
23778e32-6a33-4a11-bf18-3f7f3fb73c64	role_viewing	Przeglądanie dostępnych ról
\.


--
-- Data for Name: access_rights_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.access_rights_roles (role_id, access_rights_id) FROM stdin;
d3a00c52-8395-4050-b5a2-f07be81bcf4a	40388658-e9e0-421a-aa7e-16d32d98668e
d3a00c52-8395-4050-b5a2-f07be81bcf4a	02c74921-443f-4e93-9cc3-c60d50a45c49
d3a00c52-8395-4050-b5a2-f07be81bcf4a	effafd0b-b8c2-44d6-a9db-394908bcd092
d3a00c52-8395-4050-b5a2-f07be81bcf4a	da5e5354-c9c8-4883-8ebd-abf43732abe7
d3a00c52-8395-4050-b5a2-f07be81bcf4a	71a7e96a-3f60-47d5-948e-bc38facbc9cc
d3a00c52-8395-4050-b5a2-f07be81bcf4a	3e979033-81de-4765-9d72-c25c92dc2fc2
d3a00c52-8395-4050-b5a2-f07be81bcf4a	9e30921e-91e8-4f0c-ab7f-f7c71b20f93b
d3a00c52-8395-4050-b5a2-f07be81bcf4a	44ddeea9-053f-4f71-8d69-3c6cbd76cc82
d3a00c52-8395-4050-b5a2-f07be81bcf4a	008531af-eebf-444d-81e1-f315699ada4b
d3a00c52-8395-4050-b5a2-f07be81bcf4a	b17b5b1c-ac49-4ff4-8247-cd60dff4bc25
d3a00c52-8395-4050-b5a2-f07be81bcf4a	c61f0f2e-0cee-48e7-abff-a644570922cd
d3a00c52-8395-4050-b5a2-f07be81bcf4a	e31a31d7-8fbd-4fdf-8d7b-f8ed86d8e9ad
d3a00c52-8395-4050-b5a2-f07be81bcf4a	d4ca85f7-4501-45fd-8251-b285660e585b
d3a00c52-8395-4050-b5a2-f07be81bcf4a	23778e32-6a33-4a11-bf18-3f7f3fb73c64
e72ceed1-ba48-4097-b44d-3aff1e1098bc	44ddeea9-053f-4f71-8d69-3c6cbd76cc82
\.


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (id, city, postal_code, street, street_number) FROM stdin;
78e344e9-bbf4-4dd2-bf67-17fcdbd04bec	City	69-420	Street	5
b22777a4-70a4-4557-934c-a62cbbf28908	\N	\N	\N	\N
01d64e85-1ced-401a-be5b-bdcf73dea922	\N	\N	\N	\N
d969f053-6627-4a71-a7e5-e1a8cd7072ce	\N	\N	\N	\N
03742575-7921-4872-bd98-9231538fdb4e	\N	\N	\N	\N
32562719-2847-474a-9fa6-a0b17aea1a9a	\N	\N	\N	\N
cbb0c304-4a67-4410-a592-a4281e279f94	\N	\N	\N	\N
b6a4f64a-a8f5-4ec5-b719-e10bc3905015	\N	\N	\N	\N
f76ab177-bb7c-4c54-a4b9-a57e5547f1f6	\N	\N	\N	\N
cc5f320e-f0e0-47db-a679-6b8b6d5ad01a	\N	\N	\N	\N
5385b362-7645-4291-bf09-882c8cdc2813	\N	\N	\N	\N
38618ef3-c396-4b6a-a1d6-47fcb1890d3f	\N	\N	\N	\N
0f2813f7-d7d4-479e-acb8-f6fc85308223	\N	\N	\N	\N
13f7d6bf-45c2-4730-a535-0448ef01d8af	\N	\N	\N	\N
412fa23e-3a03-4c88-8e2d-359608d89696	\N	\N	\N	\N
5aa7c6ea-30ec-48d3-8067-6bccabcbeb56	\N	\N	\N	\N
39b747bb-f61e-4ae2-806a-5eded6515ff7	\N	\N	\N	\N
13ddfea5-3a58-4f6d-a414-07be0518bf15	\N	\N	\N	\N
f765cc2d-761e-44be-8c15-f74238426c64	\N	\N	\N	\N
1df310c2-1698-4a6c-a1f5-f85b17811778	\N	\N	\N	\N
5bdd0313-e2ce-40f4-b20b-166e712f57a2	\N	\N	\N	\N
ff0ce9f8-900f-48ee-8a88-f95d49f5e4b7	\N	\N	\N	\N
2b553695-5ec0-4281-90e6-3ebe559c5905	\N	\N	\N	\N
e3ca40da-c392-4579-8929-8ad0d9381d2f	\N	\N	\N	\N
fe008571-727c-4cc9-8f0c-8dab12c8b56a	\N	\N	\N	\N
206baaeb-1dee-42d6-9d87-29dc52ffa643	\N	\N	\N	\N
da192ee8-bf5e-476c-83ae-f901dcf69c83	\N	\N	\N	\N
f684d96c-5e44-4213-afc9-7ebae0369e89	\N	\N	\N	\N
55ffda93-27a8-42fa-86b5-7921daab3134	\N	\N	\N	\N
565c191c-a43b-458a-a278-1e92c7380bab	\N	\N	\N	\N
e14e5058-6ace-451f-b09f-9bfb33020a64	\N	\N	\N	\N
773e6a46-eb3d-461b-a723-2704849581d9	\N	\N	\N	\N
b5d43ca8-8698-4ac5-abc0-909e6c4a0b0b	\N	\N	\N	\N
d30b4187-72fb-4d9d-9eea-584319f84d7f	\N	\N	\N	\N
7174a28b-0511-4ca7-926e-1c2a17e00395	\N	\N	\N	\N
17b12657-7dc8-462b-93ad-ca5fc2da2fc8	\N	\N	\N	\N
d36d765d-2be8-4144-93cb-5ed51651c5ac	\N	\N	\N	\N
ba9c082e-126b-40e0-8f9d-8991ef49ace7	\N	\N	\N	\N
1ac98cb9-50d8-47ef-8436-2a8ae8c744d9	\N	\N	\N	\N
3dc95590-41d3-423b-a833-5d648e48ae7d	\N	\N	\N	\N
b839cf84-8d13-40e7-b6b4-205a7f3328f2	\N	\N	\N	\N
745d76c6-6011-4566-9aad-c8a3ce57ab9a	\N	\N	\N	\N
d9c45f50-451d-4d73-825a-5a8f5e963125	\N	\N	\N	\N
af89900d-c22c-45af-808d-7020cea24f76	\N	\N	\N	\N
57117d09-8297-4c12-bd56-98ba807edc44	\N	\N	\N	\N
c9f3bb6c-e190-4cf8-99a0-472ae0796d94	\N	\N	\N	\N
b6d9e2cc-c354-42e7-b4f9-7ba4844dd773	\N	\N	\N	\N
c226d11a-5210-4f1e-b8a5-9f39ed760b6c	\N	\N	\N	\N
27413733-dd77-4cb9-b6da-7ade03c02e8c	\N	\N	\N	\N
9e0edae9-c0f0-4dd7-ac2d-0722c03cbca1	\N	\N	\N	\N
6076eca9-a2e2-468d-9e70-04e137d24213	\N	\N	\N	\N
\.


--
-- Data for Name: application_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_settings (id, name, value) FROM stdin;
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaigns (id, description, name, start_date) FROM stdin;
3646865f-dbfd-4823-9641-5b5c1d74f85b		Test Campaign	2024-11-07
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name) FROM stdin;
c04fd2fa-80f1-43d9-93d5-03cc61ef64ce	Category 1
\.


--
-- Data for Name: categories_companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories_companies (company_id, category_id) FROM stdin;
19327774-cc15-4fa4-9456-d26ea6809dd3	c04fd2fa-80f1-43d9-93d5-03cc61ef64ce
613d4b2a-69ab-4460-9aa6-524c62545c83	c04fd2fa-80f1-43d9-93d5-03cc61ef64ce
631fb1f6-3297-4417-b051-2aff9cf5a18d	c04fd2fa-80f1-43d9-93d5-03cc61ef64ce
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, comment, date, contact_journey_id, user_id) FROM stdin;
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, deleted, deleted_date, email, fax, insert_date, name, phone, update_date, www, address_id,
                       updated_by_id) FROM stdin;
19327774-cc15-4fa4-9456-d26ea6809dd3	f	\N	test@email.com	\N	2024-11-07 22:15:12.558527	Company 01		2024-11-07 22:15:12.5585	test.com	78e344e9-bbf4-4dd2-bf67-17fcdbd04bec	c13f6b7a-af82-409d-8910-c71f82ee8aa7
613d4b2a-69ab-4460-9aa6-524c62545c83	f	\N		\N	2024-11-08 18:31:09.438261	Company 02		2024-11-08 18:31:09.438261		b22777a4-70a4-4557-934c-a62cbbf28908	c13f6b7a-af82-409d-8910-c71f82ee8aa7
631fb1f6-3297-4417-b051-2aff9cf5a18d	f	\N		\N	2024-11-08 18:31:11.993878	Company 03		2024-11-08 18:31:11.993878		01d64e85-1ced-401a-be5b-bdcf73dea922	c13f6b7a-af82-409d-8910-c71f82ee8aa7
c51b8fb6-8d38-43ca-a71e-da122fb10ef5	f	\N		\N	2024-11-08 18:31:14.71191	Company 04		2024-11-08 18:31:14.71191		d969f053-6627-4a71-a7e5-e1a8cd7072ce	c13f6b7a-af82-409d-8910-c71f82ee8aa7
d5e2f6a3-1650-4d13-89f7-5379aec46def	f	\N		\N	2024-11-08 18:31:17.701118	Company 05		2024-11-08 18:31:17.701118		03742575-7921-4872-bd98-9231538fdb4e	c13f6b7a-af82-409d-8910-c71f82ee8aa7
6428dccb-321d-41f6-a5ed-3edb29c80f4a	f	\N		\N	2024-11-08 18:31:21.026711	Company 06		2024-11-08 18:31:21.026711		32562719-2847-474a-9fa6-a0b17aea1a9a	c13f6b7a-af82-409d-8910-c71f82ee8aa7
c4aa27d9-63b1-4e94-aa2f-08b6f14bc82c	f	\N		\N	2024-11-08 18:31:24.261334	Company 07		2024-11-08 18:31:24.261334		cbb0c304-4a67-4410-a592-a4281e279f94	c13f6b7a-af82-409d-8910-c71f82ee8aa7
5229a2ea-1aa4-4407-9c57-75a04dc88529	f	\N		\N	2024-11-08 18:31:27.383139	Company 08		2024-11-08 18:31:27.383139		b6a4f64a-a8f5-4ec5-b719-e10bc3905015	c13f6b7a-af82-409d-8910-c71f82ee8aa7
a0e676dd-ae2b-4ed9-9c8a-6c8ff4aba86e	f	\N		\N	2024-11-08 18:31:31.013816	Company 09		2024-11-08 18:31:31.013816		f76ab177-bb7c-4c54-a4b9-a57e5547f1f6	c13f6b7a-af82-409d-8910-c71f82ee8aa7
79a22c08-1e0c-4ff1-9c71-02df32954bb1	f	\N		\N	2024-11-08 18:31:35.170222	Company 10		2024-11-08 18:31:35.170222		cc5f320e-f0e0-47db-a679-6b8b6d5ad01a	c13f6b7a-af82-409d-8910-c71f82ee8aa7
3afca932-d7ef-4a8e-a177-efb3a06f2f69	f	\N		\N	2024-11-08 18:32:47.310645	Company 11		2024-11-08 18:32:47.310645		5385b362-7645-4291-bf09-882c8cdc2813	c13f6b7a-af82-409d-8910-c71f82ee8aa7
965a4e8c-080d-4f8f-ba07-9221185d3dbe	f	\N		\N	2024-11-08 18:32:52.777184	Company 12		2024-11-08 18:32:52.777184		38618ef3-c396-4b6a-a1d6-47fcb1890d3f	c13f6b7a-af82-409d-8910-c71f82ee8aa7
f0996c37-e362-4dd6-978e-1efb93a5220c	f	\N		\N	2024-11-08 18:32:55.4971	Company 13		2024-11-08 18:32:55.4971		0f2813f7-d7d4-479e-acb8-f6fc85308223	c13f6b7a-af82-409d-8910-c71f82ee8aa7
39f427e2-c899-422f-add7-1351efdcdb9b	f	\N		\N	2024-11-08 18:32:59.531098	Company 14		2024-11-08 18:32:59.531098		13f7d6bf-45c2-4730-a535-0448ef01d8af	c13f6b7a-af82-409d-8910-c71f82ee8aa7
9e6e31fe-427c-453f-a87f-50c8b40a7f51	f	\N		\N	2024-11-08 18:33:04.309778	Company 15		2024-11-08 18:33:04.309778		412fa23e-3a03-4c88-8e2d-359608d89696	c13f6b7a-af82-409d-8910-c71f82ee8aa7
e50b2142-c472-4417-a2dd-f9b8a8b9a95f	f	\N		\N	2024-11-08 18:33:17.139049	Company 16		2024-11-08 18:33:17.139049		5aa7c6ea-30ec-48d3-8067-6bccabcbeb56	c13f6b7a-af82-409d-8910-c71f82ee8aa7
486f9bb9-a5c8-4c47-ac04-e059cb07508e	f	\N		\N	2024-11-08 18:33:25.895227	Company 17		2024-11-08 18:33:25.895227		39b747bb-f61e-4ae2-806a-5eded6515ff7	c13f6b7a-af82-409d-8910-c71f82ee8aa7
79a62e51-2d37-4654-b8b4-98e81e2a39a5	f	\N		\N	2024-11-08 18:33:28.899836	Company 18		2024-11-08 18:33:28.899836		13ddfea5-3a58-4f6d-a414-07be0518bf15	c13f6b7a-af82-409d-8910-c71f82ee8aa7
9e7eadaa-fb02-4af2-ac15-96cdfda4b8af	f	\N		\N	2024-11-08 18:33:31.839899	Company 19		2024-11-08 18:33:31.839899		f765cc2d-761e-44be-8c15-f74238426c64	c13f6b7a-af82-409d-8910-c71f82ee8aa7
18e152d9-9841-4c92-a37c-f98f25eb91f3	f	\N		\N	2024-11-08 18:33:36.846029	Company 20		2024-11-08 18:33:36.846029		1df310c2-1698-4a6c-a1f5-f85b17811778	c13f6b7a-af82-409d-8910-c71f82ee8aa7
d05283ba-b48e-4322-b74d-aee57d19062d	f	\N		\N	2024-11-08 18:33:40.104199	Company 21		2024-11-08 18:33:40.104199		5bdd0313-e2ce-40f4-b20b-166e712f57a2	c13f6b7a-af82-409d-8910-c71f82ee8aa7
bb065da7-5d77-455a-86be-608e5f5ab55a	f	\N		\N	2024-11-08 18:33:42.465824	Company 22		2024-11-08 18:33:42.465824		ff0ce9f8-900f-48ee-8a88-f95d49f5e4b7	c13f6b7a-af82-409d-8910-c71f82ee8aa7
9786de7f-ed68-4686-8322-762b918583b1	f	\N		\N	2024-11-08 18:33:45.172527	Company 23		2024-11-08 18:33:45.172527		2b553695-5ec0-4281-90e6-3ebe559c5905	c13f6b7a-af82-409d-8910-c71f82ee8aa7
9daa5340-04cb-405b-a78b-30c1d4256f55	f	\N		\N	2024-11-08 18:33:47.333247	Company 24		2024-11-08 18:33:47.333247		e3ca40da-c392-4579-8929-8ad0d9381d2f	c13f6b7a-af82-409d-8910-c71f82ee8aa7
0da1c519-029f-47d4-aab2-05e8aea6e984	f	\N		\N	2024-11-08 18:33:49.787675	Company 25		2024-11-08 18:33:49.787675		fe008571-727c-4cc9-8f0c-8dab12c8b56a	c13f6b7a-af82-409d-8910-c71f82ee8aa7
edc27128-3b5c-4f5b-a92c-be8572fb9fb0	f	\N		\N	2024-11-08 18:33:52.651464	Company 26		2024-11-08 18:33:52.651464		206baaeb-1dee-42d6-9d87-29dc52ffa643	c13f6b7a-af82-409d-8910-c71f82ee8aa7
3ceac9d8-1210-4c4a-93d5-db2d3dbd13f6	f	\N		\N	2024-11-08 18:33:55.078215	Company 27		2024-11-08 18:33:55.078215		da192ee8-bf5e-476c-83ae-f901dcf69c83	c13f6b7a-af82-409d-8910-c71f82ee8aa7
17bb77ad-b8b3-4fd3-8d2c-8c701cb2d233	f	\N		\N	2024-11-08 18:33:57.702198	Company 28		2024-11-08 18:33:57.702198		f684d96c-5e44-4213-afc9-7ebae0369e89	c13f6b7a-af82-409d-8910-c71f82ee8aa7
76215a90-4cb3-45fc-90ab-bd776bff5c7e	f	\N		\N	2024-11-08 18:34:00.475639	Company 29		2024-11-08 18:34:00.475639		55ffda93-27a8-42fa-86b5-7921daab3134	c13f6b7a-af82-409d-8910-c71f82ee8aa7
d699862c-c5d5-4d51-94c5-43813698f98c	f	\N		\N	2024-11-08 18:34:04.438735	Company 30		2024-11-08 18:34:04.438735		565c191c-a43b-458a-a278-1e92c7380bab	c13f6b7a-af82-409d-8910-c71f82ee8aa7
463f1917-4a5a-4da0-b4d1-9ad3a652f3f5	f	\N		\N	2024-11-08 18:34:08.537504	Company 31		2024-11-08 18:34:08.537504		e14e5058-6ace-451f-b09f-9bfb33020a64	c13f6b7a-af82-409d-8910-c71f82ee8aa7
fe883fc5-b8ee-4ea9-abb5-a64ae3b565fc	f	\N		\N	2024-11-08 18:34:10.538136	Company 32		2024-11-08 18:34:10.538136		773e6a46-eb3d-461b-a723-2704849581d9	c13f6b7a-af82-409d-8910-c71f82ee8aa7
ef1976e7-40b2-45aa-a359-c3772725875b	f	\N		\N	2024-11-08 18:34:12.441436	Company 33		2024-11-08 18:34:12.441436		b5d43ca8-8698-4ac5-abc0-909e6c4a0b0b	c13f6b7a-af82-409d-8910-c71f82ee8aa7
ab26a634-1708-40e1-9256-e50c0d8e01c0	f	\N		\N	2024-11-08 18:34:14.29418	Company 34		2024-11-08 18:34:14.29418		d30b4187-72fb-4d9d-9eea-584319f84d7f	c13f6b7a-af82-409d-8910-c71f82ee8aa7
7fc8574a-6cb4-4fef-a8d1-388d20b902a6	f	\N		\N	2024-11-08 18:34:16.185142	Company 35		2024-11-08 18:34:16.185142		7174a28b-0511-4ca7-926e-1c2a17e00395	c13f6b7a-af82-409d-8910-c71f82ee8aa7
adaa0d61-1509-4ede-94eb-57ef2c573631	f	\N		\N	2024-11-08 18:34:18.721709	Company 36		2024-11-08 18:34:18.721709		17b12657-7dc8-462b-93ad-ca5fc2da2fc8	c13f6b7a-af82-409d-8910-c71f82ee8aa7
e22a4a31-3d3c-4139-b319-07347302dc60	f	\N		\N	2024-11-08 18:34:21.315444	Company 37		2024-11-08 18:34:21.314926		d36d765d-2be8-4144-93cb-5ed51651c5ac	c13f6b7a-af82-409d-8910-c71f82ee8aa7
81209a4c-d456-49d7-95cc-e6626513de9e	f	\N		\N	2024-11-08 18:34:24.06551	Company 38		2024-11-08 18:34:24.06551		ba9c082e-126b-40e0-8f9d-8991ef49ace7	c13f6b7a-af82-409d-8910-c71f82ee8aa7
3efd07d2-16b1-4cfe-93fc-101cf53706e1	f	\N		\N	2024-11-08 18:34:26.510481	Company 39		2024-11-08 18:34:26.510481		1ac98cb9-50d8-47ef-8436-2a8ae8c744d9	c13f6b7a-af82-409d-8910-c71f82ee8aa7
74247972-4e6d-48c8-aac1-c11d05b30191	f	\N		\N	2024-11-08 18:34:29.420177	Company 40		2024-11-08 18:34:29.420177		3dc95590-41d3-423b-a833-5d648e48ae7d	c13f6b7a-af82-409d-8910-c71f82ee8aa7
cf33641b-1654-4819-a33a-f427cd448c1a	f	\N		\N	2024-11-08 18:34:32.889003	Company 41		2024-11-08 18:34:32.889003		b839cf84-8d13-40e7-b6b4-205a7f3328f2	c13f6b7a-af82-409d-8910-c71f82ee8aa7
0adc1ea3-370d-459b-977a-c944acd9f7dc	f	\N		\N	2024-11-08 18:34:42.68866	Company 42		2024-11-08 18:34:42.68866		745d76c6-6011-4566-9aad-c8a3ce57ab9a	c13f6b7a-af82-409d-8910-c71f82ee8aa7
05bb06fe-37a6-493e-8925-1f63992ddf23	f	\N		\N	2024-11-08 18:34:46.691081	Company 43		2024-11-08 18:34:46.691081		d9c45f50-451d-4d73-825a-5a8f5e963125	c13f6b7a-af82-409d-8910-c71f82ee8aa7
de3433af-4268-4f89-b04f-00e660b0a29c	f	\N		\N	2024-11-08 18:34:49.635798	Company 44		2024-11-08 18:34:49.635798		af89900d-c22c-45af-808d-7020cea24f76	c13f6b7a-af82-409d-8910-c71f82ee8aa7
d44c41ec-af59-4322-82d1-adaa8fff1bb5	f	\N		\N	2024-11-08 18:34:52.649077	Company 45		2024-11-08 18:34:52.649077		57117d09-8297-4c12-bd56-98ba807edc44	c13f6b7a-af82-409d-8910-c71f82ee8aa7
788613a3-cd06-4ecb-88ad-486275197983	f	\N		\N	2024-11-08 18:34:54.922565	Company 46		2024-11-08 18:34:54.922565		c9f3bb6c-e190-4cf8-99a0-472ae0796d94	c13f6b7a-af82-409d-8910-c71f82ee8aa7
9d33c3b5-b558-4b61-99a7-13de4d298be5	f	\N		\N	2024-11-08 18:34:57.460599	Company 47		2024-11-08 18:34:57.460599		b6d9e2cc-c354-42e7-b4f9-7ba4844dd773	c13f6b7a-af82-409d-8910-c71f82ee8aa7
e166c1b5-a4d0-4dc2-a8a8-1061174b5c0e	f	\N		\N	2024-11-08 18:34:59.914379	Company 48		2024-11-08 18:34:59.914379		c226d11a-5210-4f1e-b8a5-9f39ed760b6c	c13f6b7a-af82-409d-8910-c71f82ee8aa7
eae4e54f-2922-4bb2-b36f-fc9e05f6135d	f	\N		\N	2024-11-08 18:35:02.431758	Company 49		2024-11-08 18:35:02.431758		27413733-dd77-4cb9-b6da-7ade03c02e8c	c13f6b7a-af82-409d-8910-c71f82ee8aa7
b6380f34-b9d4-4f11-b327-439887e9d60e	f	\N		\N	2024-11-08 18:35:09.246032	Company 51		2024-11-08 18:35:09.246032		6076eca9-a2e2-468d-9e70-04e137d24213	c13f6b7a-af82-409d-8910-c71f82ee8aa7
406b11cf-49c0-4a2f-801a-4c67f27ef527	f	\N		\N	2024-11-08 18:35:05.989423	Company 50		2024-11-08 18:35:05.989423		9e0edae9-c0f0-4dd7-ac2d-0722c03cbca1	c13f6b7a-af82-409d-8910-c71f82ee8aa7
\.


--
-- Data for Name: contact_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_events (id, date, description, event_type, contact_journey_id, contact_person_id,
                            user_id) FROM stdin;
aa376003-428e-481b-a693-29ce8a1c702e	2024-11-09 16:27:29.810398	Waiting	WAITING_FOR_RESPONSE	04ef0a68-51dc-45d8-8e69-9df65b8e01b6	\N	c13f6b7a-af82-409d-8910-c71f82ee8aa7
ce742e3b-3a0b-42aa-8991-3d5f916f35a0	2024-11-09 16:27:38.041639	Call later	CALL_LATER	6a3dab4d-d11f-4ec0-9b87-98dfa6e95a60	\N	c13f6b7a-af82-409d-8910-c71f82ee8aa7
2f4f335b-1e1e-466d-8476-a1b5e1baad35	2024-11-09 16:27:47.0866	Not interested	NOT_INTERESTED	fc94ecce-ee88-4164-8b19-0d54f44423d9	50fbc0b6-0272-4462-8fbd-565cbf10e5ed	c13f6b7a-af82-409d-8910-c71f82ee8aa7
3e894c42-5fc5-43aa-b583-74620a3b64c0	2024-11-09 16:27:52.908497	Barter	BARTER	8809e693-f6d1-47bd-a96e-606e5435918f	\N	c13f6b7a-af82-409d-8910-c71f82ee8aa7
d14ad2e8-13f8-4fc0-808b-f2d99790828d	2024-11-09 16:27:59.683433	Sponsor	SPONSOR	7037d5e5-ed91-42bc-be07-08910a272601	\N	c13f6b7a-af82-409d-8910-c71f82ee8aa7
f7bdd525-e481-4507-bc91-e819fd41ddb3	2024-11-09 16:29:06.24917	Training	TRAINING	856eac81-4fdf-4326-b25a-944e7148b2f0	\N	c13f6b7a-af82-409d-8910-c71f82ee8aa7
37f41d3f-2a7f-4e3a-8e3d-e2ef5992bc20	2024-11-09 16:29:16.868673	Other cooperation form	DIFFERENT_FORM_PARTNERSHIP	94e0da4b-bb81-4ee8-abf3-836463f9175c	\N	c13f6b7a-af82-409d-8910-c71f82ee8aa7
d7331956-cbf0-4809-b9c5-45530828e30c	2024-11-09 16:29:26.235581	Call next year	CALL_NEXT_YEAR	de51457a-4c6b-4ca5-abd8-9f95c714397b	\N	c13f6b7a-af82-409d-8910-c71f82ee8aa7
9c35a59f-41c9-4a4a-b451-6effeb685a3b	2024-11-09 16:29:35.596666	Internship	INTERNSHIP	dbc52605-0f60-40e1-9e48-938c5be4011a	\N	c13f6b7a-af82-409d-8910-c71f82ee8aa7
22cfa954-51bf-4099-9332-bb7b0d8fc6de	2024-11-09 16:29:48.915784	I have to contact the company	I_HAVE_TO_CONTACT_COMPANY	bb2bfb63-d5aa-4c0a-9bfd-3032ae99cf37	\N	c13f6b7a-af82-409d-8910-c71f82ee8aa7
076668d5-3775-4033-91a8-9f0474fb65b2	2024-11-09 16:30:01.482745	Company has to contact me	COMPANY_WILL_REACH_OUT	5ac2cea8-9780-4861-a1ee-f38b3eb57e86	\N	c13f6b7a-af82-409d-8910-c71f82ee8aa7
\.


--
-- Data for Name: contact_journeys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_journeys (id, campaign_id, contact_status, finished, journey_start, last_interaction, company_id,
                              user_id) FROM stdin;
d4060b2d-86f4-4aec-b439-ae3d0f621f05	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:08.96209	\N	965a4e8c-080d-4f8f-ba07-9221185d3dbe	c13f6b7a-af82-409d-8910-c71f82ee8aa7
2515bee8-2fce-48b3-be38-5398fe6e8022	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:11.909638	\N	f0996c37-e362-4dd6-978e-1efb93a5220c	c13f6b7a-af82-409d-8910-c71f82ee8aa7
34afbaa7-b07c-4229-937f-5217ffb6163d	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:15.340129	\N	39f427e2-c899-422f-add7-1351efdcdb9b	c13f6b7a-af82-409d-8910-c71f82ee8aa7
0159aaa8-18a6-40c1-ad2f-f365c07ceb9d	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:18.72575	\N	9e6e31fe-427c-453f-a87f-50c8b40a7f51	c13f6b7a-af82-409d-8910-c71f82ee8aa7
cbe245c1-f4f3-47e0-acdf-d1382ebc4d54	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:21.867894	\N	e50b2142-c472-4417-a2dd-f9b8a8b9a95f	c13f6b7a-af82-409d-8910-c71f82ee8aa7
b561f1ec-623e-4eed-9b92-fedcdc42833a	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:25.11542	\N	486f9bb9-a5c8-4c47-ac04-e059cb07508e	c13f6b7a-af82-409d-8910-c71f82ee8aa7
d3b8de59-1d34-4031-9ab7-537e59ddbbc4	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:29.25751	\N	79a62e51-2d37-4654-b8b4-98e81e2a39a5	c13f6b7a-af82-409d-8910-c71f82ee8aa7
e44dfb53-19c0-4941-a34c-df4b823c5aa0	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:32.640065	\N	9e7eadaa-fb02-4af2-ac15-96cdfda4b8af	c13f6b7a-af82-409d-8910-c71f82ee8aa7
9ced3748-2e4c-441d-912e-e92d5a65fc0b	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:35.92081	\N	18e152d9-9841-4c92-a37c-f98f25eb91f3	c13f6b7a-af82-409d-8910-c71f82ee8aa7
4fd761b9-1385-4689-8c1c-0c0b8c5e5371	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:39.439541	\N	d05283ba-b48e-4322-b74d-aee57d19062d	c13f6b7a-af82-409d-8910-c71f82ee8aa7
5d33e6ab-12a3-4919-9fd6-43115cef0b51	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:42.63453	\N	bb065da7-5d77-455a-86be-608e5f5ab55a	c13f6b7a-af82-409d-8910-c71f82ee8aa7
5eb6a6ea-dca3-4177-9f7a-14caf8353920	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:45.658832	\N	9786de7f-ed68-4686-8322-762b918583b1	c13f6b7a-af82-409d-8910-c71f82ee8aa7
afeada62-33bc-45ad-bf73-251fda04a4a1	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:50.468533	\N	9daa5340-04cb-405b-a78b-30c1d4256f55	c13f6b7a-af82-409d-8910-c71f82ee8aa7
72b6ed33-ee9f-4788-8704-a7ff6cd51a50	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:37:54.124046	\N	0da1c519-029f-47d4-aab2-05e8aea6e984	c13f6b7a-af82-409d-8910-c71f82ee8aa7
0185a2df-a871-4484-a815-d26d8ccf0cbd	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:38:05.605852	\N	edc27128-3b5c-4f5b-a92c-be8572fb9fb0	84249a5c-dc01-4091-94ce-1864d3b0554e
32c51a46-6f7d-4a08-89c5-a31c77e06de4	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:38:11.960701	\N	3ceac9d8-1210-4c4a-93d5-db2d3dbd13f6	84249a5c-dc01-4091-94ce-1864d3b0554e
44f78e05-a5b5-4ac2-a91c-17d7c9d52bf2	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:41:32.449562	\N	76215a90-4cb3-45fc-90ab-bd776bff5c7e	c13f6b7a-af82-409d-8910-c71f82ee8aa7
8f8fa963-866a-4187-b11e-99eb56af3cba	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:41:35.966831	\N	d699862c-c5d5-4d51-94c5-43813698f98c	c13f6b7a-af82-409d-8910-c71f82ee8aa7
bc7c27e4-f5ff-49c6-b704-81b86ce895f4	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:41:38.855988	\N	463f1917-4a5a-4da0-b4d1-9ad3a652f3f5	c13f6b7a-af82-409d-8910-c71f82ee8aa7
0260fb1e-7e6b-413b-a37d-ab5ec85695f3	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:41:41.593525	\N	fe883fc5-b8ee-4ea9-abb5-a64ae3b565fc	c13f6b7a-af82-409d-8910-c71f82ee8aa7
a4a21153-06f1-45b4-bee8-bb00ec8351c6	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 15:42:58.094404	\N	17bb77ad-b8b3-4fd3-8d2c-8c701cb2d233	c13f6b7a-af82-409d-8910-c71f82ee8aa7
5694087b-c3ec-475b-bdb3-97619e34cfad	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 16:02:59.374602	\N	ef1976e7-40b2-45aa-a359-c3772725875b	84249a5c-dc01-4091-94ce-1864d3b0554e
1b9c725a-d8c7-4e6d-b468-3119b4dcbdb6	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 16:03:01.0185	\N	ab26a634-1708-40e1-9256-e50c0d8e01c0	84249a5c-dc01-4091-94ce-1864d3b0554e
274ac16a-c8eb-422a-bb5e-1d72af9e3ca3	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 16:03:02.145647	\N	7fc8574a-6cb4-4fef-a8d1-388d20b902a6	84249a5c-dc01-4091-94ce-1864d3b0554e
06056bb5-bf40-491d-9ee3-d7ffe310f4ea	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 16:03:03.263489	\N	adaa0d61-1509-4ede-94eb-57ef2c573631	84249a5c-dc01-4091-94ce-1864d3b0554e
0bdf20e2-e316-46a2-b2fe-9f3b2420f0cd	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 16:03:04.374189	\N	e22a4a31-3d3c-4139-b319-07347302dc60	84249a5c-dc01-4091-94ce-1864d3b0554e
d0383d2d-b47d-494e-9385-006c3287a4bb	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 16:03:05.401433	\N	81209a4c-d456-49d7-95cc-e6626513de9e	84249a5c-dc01-4091-94ce-1864d3b0554e
5073213d-648b-449b-9f10-949424d96527	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 16:03:06.591568	\N	3efd07d2-16b1-4cfe-93fc-101cf53706e1	84249a5c-dc01-4091-94ce-1864d3b0554e
07501143-6053-4699-a39e-47043718a635	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 16:03:09.400779	\N	74247972-4e6d-48c8-aac1-c11d05b30191	84249a5c-dc01-4091-94ce-1864d3b0554e
0c3fd348-0241-465d-ae2b-a568abe2884e	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 16:03:10.416529	\N	cf33641b-1654-4819-a33a-f427cd448c1a	84249a5c-dc01-4091-94ce-1864d3b0554e
a0afbd94-345f-4631-be89-3681805b98bd	3646865f-dbfd-4823-9641-5b5c1d74f85b	ASSIGNED	f	2024-11-09 16:03:11.73069	\N	0adc1ea3-370d-459b-977a-c944acd9f7dc	84249a5c-dc01-4091-94ce-1864d3b0554e
6a3dab4d-d11f-4ec0-9b87-98dfa6e95a60	3646865f-dbfd-4823-9641-5b5c1d74f85b	CALL_LATER	f	2024-11-09 15:36:31.417774	2024-11-09 16:27:38.042153	613d4b2a-69ab-4460-9aa6-524c62545c83	c13f6b7a-af82-409d-8910-c71f82ee8aa7
fc94ecce-ee88-4164-8b19-0d54f44423d9	3646865f-dbfd-4823-9641-5b5c1d74f85b	NOT_INTERESTED	f	2024-11-09 15:36:36.83151	2024-11-09 16:27:47.087119	631fb1f6-3297-4417-b051-2aff9cf5a18d	c13f6b7a-af82-409d-8910-c71f82ee8aa7
8809e693-f6d1-47bd-a96e-606e5435918f	3646865f-dbfd-4823-9641-5b5c1d74f85b	BARTER	f	2024-11-09 15:36:41.607858	2024-11-09 16:27:52.909018	c51b8fb6-8d38-43ca-a71e-da122fb10ef5	c13f6b7a-af82-409d-8910-c71f82ee8aa7
7037d5e5-ed91-42bc-be07-08910a272601	3646865f-dbfd-4823-9641-5b5c1d74f85b	SPONSOR	f	2024-11-09 15:36:44.371562	2024-11-09 16:27:59.684041	d5e2f6a3-1650-4d13-89f7-5379aec46def	c13f6b7a-af82-409d-8910-c71f82ee8aa7
856eac81-4fdf-4326-b25a-944e7148b2f0	3646865f-dbfd-4823-9641-5b5c1d74f85b	TRAINING	f	2024-11-09 15:36:46.99265	2024-11-09 16:29:06.250206	6428dccb-321d-41f6-a5ed-3edb29c80f4a	\N
de51457a-4c6b-4ca5-abd8-9f95c714397b	3646865f-dbfd-4823-9641-5b5c1d74f85b	CALL_NEXT_YEAR	f	2024-11-09 15:36:53.314861	2024-11-09 16:29:26.236101	5229a2ea-1aa4-4407-9c57-75a04dc88529	c13f6b7a-af82-409d-8910-c71f82ee8aa7
bb2bfb63-d5aa-4c0a-9bfd-3032ae99cf37	3646865f-dbfd-4823-9641-5b5c1d74f85b	I_HAVE_TO_CONTACT_COMPANY	f	2024-11-09 15:37:00.89618	2024-11-09 16:29:48.916496	79a22c08-1e0c-4ff1-9c71-02df32954bb1	c13f6b7a-af82-409d-8910-c71f82ee8aa7
5ac2cea8-9780-4861-a1ee-f38b3eb57e86	3646865f-dbfd-4823-9641-5b5c1d74f85b	COMPANY_WILL_REACH_OUT	f	2024-11-09 15:37:04.074417	2024-11-09 16:30:01.48327	3afca932-d7ef-4a8e-a177-efb3a06f2f69	c13f6b7a-af82-409d-8910-c71f82ee8aa7
04ef0a68-51dc-45d8-8e69-9df65b8e01b6	3646865f-dbfd-4823-9641-5b5c1d74f85b	WAITING_FOR_RESPONSE	f	2024-11-07 22:15:33.350028	2024-11-07 16:27:29.81	19327774-cc15-4fa4-9456-d26ea6809dd3	c13f6b7a-af82-409d-8910-c71f82ee8aa7
94e0da4b-bb81-4ee8-abf3-836463f9175c	3646865f-dbfd-4823-9641-5b5c1d74f85b	DIFFERENT_FORM_PARTNERSHIP	t	2024-11-09 15:36:49.980319	2024-11-09 16:29:16.869713	c4aa27d9-63b1-4e94-aa2f-08b6f14bc82c	c13f6b7a-af82-409d-8910-c71f82ee8aa7
dbc52605-0f60-40e1-9e48-938c5be4011a	3646865f-dbfd-4823-9641-5b5c1d74f85b	INTERNSHIP	t	2024-11-09 15:36:57.020524	2024-11-09 16:29:35.597699	a0e676dd-ae2b-4ed9-9c8a-6c8ff4aba86e	c13f6b7a-af82-409d-8910-c71f82ee8aa7
\.


--
-- Data for Name: contact_persons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_persons (id, comment, committee, email, is_alumni, name, phone, "position", company_id) FROM stdin;
50fbc0b6-0272-4462-8fbd-565cbf10e5ed	MIS	AGH		t	Alumn 1			631fb1f6-3297-4417-b051-2aff9cf5a18d
158f30f4-2f06-4b8b-abfd-3b293f5988d6	JAR	UMED		t	Alumn 2			19327774-cc15-4fa4-9456-d26ea6809dd3
\.


--
-- Data for Name: failed_emails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.failed_emails (id, content, date, recipient, subject) FROM stdin;
\.


--
-- Data for Name: favourite_journey; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favourite_journey (id, user_id, contact_journey_id) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, date, journey_id, seen, text, user_id) FROM stdin;
9c83185a-598b-4882-971e-1744a888c2d9	2024-11-09 15:38:05.606368	0185a2df-a871-4484-a815-d26d8ccf0cbd	t	Zostałeś przypisany do firmy Company 26 w akcji Test Campaign kliknij by przejść do kontaktu	84249a5c-dc01-4091-94ce-1864d3b0554e
52647d52-6ec3-4c30-9455-0871c06b647d	2024-11-09 15:38:11.961213	32c51a46-6f7d-4a08-89c5-a31c77e06de4	t	Zostałeś przypisany do firmy Company 27 w akcji Test Campaign kliknij by przejść do kontaktu	84249a5c-dc01-4091-94ce-1864d3b0554e
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (id, expiry_date, token, user_id) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, description, is_local, name, sort_order) FROM stdin;
d3a00c52-8395-4050-b5a2-f07be81bcf4a	System administrator	\N	ADMIN	\N
e72ceed1-ba48-4097-b44d-3aff1e1098bc	Calling person	\N	Caller	\N
\.


--
-- Data for Name: scheduled_contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scheduled_contacts (id, contact_date, note, reminder_date, company_id, user_id) FROM stdin;
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, name, age) FROM stdin;
1	Mkyong	40
2	Ali	28
3	Teoh	18
\.


--
-- Data for Name: user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_groups (id, entry_code, name) FROM stdin;
e5ab22c0-ca3c-4a4c-a690-ff0eaf56b46a	4117409	Test Group
\.


--
-- Data for Name: user_groups_campaign_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_groups_campaign_list (user_group_id, campaign_list_id) FROM stdin;
e5ab22c0-ca3c-4a4c-a690-ff0eaf56b46a	3646865f-dbfd-4823-9641-5b5c1d74f85b
\.


--
-- Data for Name: user_groups_user_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_groups_user_list (user_group_id, user_list_id) FROM stdin;
e5ab22c0-ca3c-4a4c-a690-ff0eaf56b46a	c13f6b7a-af82-409d-8910-c71f82ee8aa7
e5ab22c0-ca3c-4a4c-a690-ff0eaf56b46a	84249a5c-dc01-4091-94ce-1864d3b0554e
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, accepted, active, created_at, email, name, password, profile_picture, surname) FROM stdin;
c13f6b7a-af82-409d-8910-c71f82ee8aa7	t	t	2024-11-07 22:13:47.17873	administrator@szakal.org	Admin	$2a$10$QpKPtHIGxJbFx1gIdj7WBesKXH3OKIrPj2cGTvMxJVP98.gbtTsGi	\N	Admin
84249a5c-dc01-4091-94ce-1864d3b0554e	t	t	2024-11-09 15:36:06.102673	test1@szakal.org	Test	$2a$12$FetsdhfxE5XeqR82J6A7EuMON85X5XS6fjKCySxjIQLaPHrVPBzbq	\N	One
\.


--
-- Data for Name: users_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_roles (user_id, roles_id) FROM stdin;
c13f6b7a-af82-409d-8910-c71f82ee8aa7	d3a00c52-8395-4050-b5a2-f07be81bcf4a
84249a5c-dc01-4091-94ce-1864d3b0554e	e72ceed1-ba48-4097-b44d-3aff1e1098bc
\.


--
-- Data for Name: users_user_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_user_groups (user_id, user_groups_id) FROM stdin;
c13f6b7a-af82-409d-8910-c71f82ee8aa7	e5ab22c0-ca3c-4a4c-a690-ff0eaf56b46a
84249a5c-dc01-4091-94ce-1864d3b0554e	e5ab22c0-ca3c-4a4c-a690-ff0eaf56b46a
\.


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 3, true);


--
-- Name: access_rights access_rights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_rights
    ADD CONSTRAINT access_rights_pkey PRIMARY KEY (id);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: application_settings application_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_settings
    ADD CONSTRAINT application_settings_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: categories_companies categories_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_companies
    ADD CONSTRAINT categories_companies_pkey PRIMARY KEY (company_id, category_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: contact_events contact_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_events
    ADD CONSTRAINT contact_events_pkey PRIMARY KEY (id);


--
-- Name: contact_journeys contact_journeys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_journeys
    ADD CONSTRAINT contact_journeys_pkey PRIMARY KEY (id);


--
-- Name: contact_persons contact_persons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_persons
    ADD CONSTRAINT contact_persons_pkey PRIMARY KEY (id);


--
-- Name: failed_emails failed_emails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_emails
    ADD CONSTRAINT failed_emails_pkey PRIMARY KEY (id);


--
-- Name: favourite_journey favourite_journey_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favourite_journey
    ADD CONSTRAINT favourite_journey_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: scheduled_contacts scheduled_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_contacts
    ADD CONSTRAINT scheduled_contacts_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: companies uk_qwoxg59ehmgand40pj8bwnst2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT uk_qwoxg59ehmgand40pj8bwnst2 UNIQUE (address_id);


--
-- Name: user_groups user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_roles users_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT users_roles_pkey PRIMARY KEY (user_id, roles_id);


--
-- Name: users_user_groups users_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_user_groups
    ADD CONSTRAINT users_user_groups_pkey PRIMARY KEY (user_id, user_groups_id);


--
-- Name: users_roles fk2o0jvgh89lemvvo17cbqvdxaa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT fk2o0jvgh89lemvvo17cbqvdxaa FOREIGN KEY (user_id) REFERENCES public.users (id);


--
-- Name: contact_journeys fk47rkqltariggr3gomvwljiood; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_journeys
    ADD CONSTRAINT fk47rkqltariggr3gomvwljiood FOREIGN KEY (campaign_id) REFERENCES public.campaigns (id);


--
-- Name: user_groups_campaign_list fk4q68nrjqiketj4sw6s13bl6dp; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups_campaign_list
    ADD CONSTRAINT fk4q68nrjqiketj4sw6s13bl6dp FOREIGN KEY (user_group_id) REFERENCES public.user_groups (id);


--
-- Name: user_groups_user_list fk4toieco6gqs8ie6cbunwdyoqt; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups_user_list
    ADD CONSTRAINT fk4toieco6gqs8ie6cbunwdyoqt FOREIGN KEY (user_group_id) REFERENCES public.user_groups (id);


--
-- Name: contact_events fk5moi322ngm6msqkud9d3l3o45; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_events
    ADD CONSTRAINT fk5moi322ngm6msqkud9d3l3o45 FOREIGN KEY (user_id) REFERENCES public.users (id);


--
-- Name: users_user_groups fk6hs27b967srgdv38gf0jjejuj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_user_groups
    ADD CONSTRAINT fk6hs27b967srgdv38gf0jjejuj FOREIGN KEY (user_groups_id) REFERENCES public.user_groups (id);


--
-- Name: contact_journeys fk6ytg7u8d8cdeuplqklbi7jjfb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_journeys
    ADD CONSTRAINT fk6ytg7u8d8cdeuplqklbi7jjfb FOREIGN KEY (user_id) REFERENCES public.users (id);


--
-- Name: companies fk800jtlbflb2wxcd1ir3fidlwb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT fk800jtlbflb2wxcd1ir3fidlwb FOREIGN KEY (updated_by_id) REFERENCES public.users (id);


--
-- Name: comments fk8omq0tc18jd43bu5tjh6jvraq; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fk8omq0tc18jd43bu5tjh6jvraq FOREIGN KEY (user_id) REFERENCES public.users (id);


--
-- Name: contact_journeys fk8r4x1io4wn5xfixdlfaji1in9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_journeys
    ADD CONSTRAINT fk8r4x1io4wn5xfixdlfaji1in9 FOREIGN KEY (company_id) REFERENCES public.companies (id);


--
-- Name: companies fk8w70yf6urddd0ky7ev90okenf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT fk8w70yf6urddd0ky7ev90okenf FOREIGN KEY (address_id) REFERENCES public.addresses (id);


--
-- Name: categories_companies fk9jq11bvky9v2ydpbm2rhl0svx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_companies
    ADD CONSTRAINT fk9jq11bvky9v2ydpbm2rhl0svx FOREIGN KEY (company_id) REFERENCES public.companies (id);


--
-- Name: notifications fk9y21adhxn0ayjhfocscqox7bh; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk9y21adhxn0ayjhfocscqox7bh FOREIGN KEY (user_id) REFERENCES public.users (id);


--
-- Name: users_roles fka62j07k5mhgifpp955h37ponj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_roles
    ADD CONSTRAINT fka62j07k5mhgifpp955h37ponj FOREIGN KEY (roles_id) REFERENCES public.roles (id);


--
-- Name: scheduled_contacts fkduc8u01vt83sf45sdds9avdbb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_contacts
    ADD CONSTRAINT fkduc8u01vt83sf45sdds9avdbb FOREIGN KEY (company_id) REFERENCES public.companies (id);


--
-- Name: contact_events fkg0outrf809xg6y6jpagl1vws5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_events
    ADD CONSTRAINT fkg0outrf809xg6y6jpagl1vws5 FOREIGN KEY (contact_journey_id) REFERENCES public.contact_journeys (id);


--
-- Name: categories_companies fkg7l79d07itcxmea17wx9rctdt; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_companies
    ADD CONSTRAINT fkg7l79d07itcxmea17wx9rctdt FOREIGN KEY (category_id) REFERENCES public.categories (id);


--
-- Name: scheduled_contacts fkgprfythbrys5ctr269a8nvk3f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scheduled_contacts
    ADD CONSTRAINT fkgprfythbrys5ctr269a8nvk3f FOREIGN KEY (user_id) REFERENCES public.users (id);


--
-- Name: user_groups_campaign_list fkilmyai0uuepuos10ltdauihgx; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups_campaign_list
    ADD CONSTRAINT fkilmyai0uuepuos10ltdauihgx FOREIGN KEY (campaign_list_id) REFERENCES public.campaigns (id);


--
-- Name: user_groups_user_list fkipo3l97w929xi274hj94x5f26; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups_user_list
    ADD CONSTRAINT fkipo3l97w929xi274hj94x5f26 FOREIGN KEY (user_list_id) REFERENCES public.users (id);


--
-- Name: access_rights_roles fkjfq3kdryfqnfxofrxgk249s4l; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_rights_roles
    ADD CONSTRAINT fkjfq3kdryfqnfxofrxgk249s4l FOREIGN KEY (role_id) REFERENCES public.roles (id);


--
-- Name: password_reset_tokens fkk3ndxg5xp6v7wd4gjyusp15gq; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT fkk3ndxg5xp6v7wd4gjyusp15gq FOREIGN KEY (user_id) REFERENCES public.users (id);


--
-- Name: access_rights_roles fkl6nupnolafdnktn8ghh4qfans; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_rights_roles
    ADD CONSTRAINT fkl6nupnolafdnktn8ghh4qfans FOREIGN KEY (access_rights_id) REFERENCES public.access_rights (id);


--
-- Name: comments fkmdcluy16y2kpqqd1nt13h1sv2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT fkmdcluy16y2kpqqd1nt13h1sv2 FOREIGN KEY (contact_journey_id) REFERENCES public.contact_journeys (id);


--
-- Name: users_user_groups fkmsd8fof02cvru21npn06didfo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_user_groups
    ADD CONSTRAINT fkmsd8fof02cvru21npn06didfo FOREIGN KEY (user_id) REFERENCES public.users (id);


--
-- Name: contact_events fkmypj6y492pfjqteihohuuthrh; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_events
    ADD CONSTRAINT fkmypj6y492pfjqteihohuuthrh FOREIGN KEY (contact_person_id) REFERENCES public.contact_persons (id);


--
-- Name: favourite_journey fko7sbjv8viffcv7iyyi2649pkh; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favourite_journey
    ADD CONSTRAINT fko7sbjv8viffcv7iyyi2649pkh FOREIGN KEY (contact_journey_id) REFERENCES public.contact_journeys (id);


--
-- Name: contact_persons fkr7nuii3n8bji9ib8ghxqmltbs; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_persons
    ADD CONSTRAINT fkr7nuii3n8bji9ib8ghxqmltbs FOREIGN KEY (company_id) REFERENCES public.companies (id);


--
-- PostgreSQL database dump complete
--

