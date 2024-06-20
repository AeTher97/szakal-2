# Data
Data is the very center of the **_Szakal-2_** application. Since it is pretty much a CRUD application.
This document outlines the structure of the data that is stored to power all the awesome features we have here.

## ORM
Most of the SQL magic is handled by an ORM framework called **Hibernate**. In case of any open questions around data
entities in the project, how to create and modify them, or how to work with repositories and generated queries, it's 
a good idea to include Hibernate in the Google searches.

## Table structure
Table structure employed in the application can be reviewed on the following diagram:
![database structure](/backend/docs/images/database-structure.png)

All the properties and relations here are modelled using **Hibernate** ORM and defined in **models.entities** package.
Hibernate allows to model fields and relations using Java annotations making it easy to define the structure and having 
it moderately well visible from the class level. 

The entity class usually consists of a couple of elements:
* The basic Java class with typed fields that define the structure of the data (columns of a table).
* ORM annotations like **@Entity, @Id, @OneToMany** etc. defined on a class or on particular fields.
* Lombok's annotations like **@Data, @Getter, @AllArgsConstructor** that generate Java boilerplate code to make classes 
cleaner and reduce the need for writing repeatable code.

### Java class fields
This one should be self-explanatory. We have fields with defined types in the class. ORM is smart enough to use those 
as column, simple types like String, Integer etc. are mostly supported by default. Complex ones like list or objects 
require us to set up what we would normally do in an SQL database which is _relations_.

### ORM annotations
Those provide a little more context to the ORM so that it knows how to pack our classes into the database. Most 
important ones are:
* **@Entity** - used on the class level, mean that this class should be persistable in the database and have a table 
created
* **@Table** - we can specify the name of the table we want for the entity, otherwise we will get something auto-generated.
* **@Id** - used on the field level, defines what will be used as the primary key in the table.
* **@OneToMany, @ManyToMany, @ManyToOne, @OneToOne** - used on the field level, defines the relation of the field to the 
current class it's in. Generally used on a field of a custom object type so
we can create a coupling. For example 
Companies and their contact people. Most of the time these relations will have to be defined on both ends (both entities).
* **@JoinTable** - used on the field level, provides more context for the relations annotation on how to join tables
in the background. For example for Company and the ContactPerson. ContactPerson might have a companyId foreign key column
that identifies what company it exists under. With join table we can tell hibernate how to join these two entities using 
this column.

### Lombok's annotations
These generate Java code in the background that is indexed by idea so we can use all the constructors, setters, getters,
builders etc. that are defined using annotations.

Most commonly used annotations in the project:
* **@Data** - used on the class level, means that the whole class should be treated as a data structure and all fields 
should get a getter and a setter.
* **@Setter, @Getter** - used on the field level, means that a field should have a getter or a setter generated.
* **@AllArgsConstructor, @NoArgsConstructor** - used on the class level, means that the class should have a constructor 
with all the fields or no fields generated. It is possible to 
* **@Builder** - means that the class should have a builder generated.
