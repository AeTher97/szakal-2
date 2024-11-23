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
* **NamedEntityGraph** - one of the most complex annotations out there allows us to customize the query plan when asking
  database for complex entities. Taking an example
  of [Company.java](../src/main/java/org/iaeste/szakal2/models/entities/Company.java)
  class which is a very complex entity with many sub entities we can customize a couple different query plan for
  different
  views we support in the application:

```java
@NamedEntityGraph(name = "Company.listing",
        attributeNodes = {
                @NamedAttributeNode("address"),
                @NamedAttributeNode("categories"),
                @NamedAttributeNode(value = "contactJourneys", subgraph = "journey-subgraph"),
        },
        subgraphs = {
                @NamedSubgraph(
                        name = "journey-subgraph",
                        attributeNodes = {
                                @NamedAttributeNode("campaign")
                        })
        })
@NamedEntityGraph(name = "Company.address",
        attributeNodes = {
                @NamedAttributeNode("address"),
        })
@NamedEntityGraph(name = "Company.detail",
        attributeNodes = {
                @NamedAttributeNode("address"),
                @NamedAttributeNode("categories"),
                @NamedAttributeNode("updatedBy"),
                @NamedAttributeNode(value = "contactJourneys", subgraph = "journey-subgraph"),
        },
        subgraphs = {
                @NamedSubgraph(
                        name = "journey-subgraph",
                        attributeNodes = {
                                @NamedAttributeNode("campaign")
                        })
        })
```

Here we have three query graphs: listing, address and details, fields that we specify as attribute nodes will be joined
in one query allowing us to minimize amount of queries to fetch this large structure and avoid lazy initialization
exception.
To use the entity graph its enough to give its name to the repository fetching method:

```java

@EntityGraph(value = "Company.listing", type = EntityGraph.EntityGraphType.LOAD)
List<Company> findAllById(Iterable<UUID> ids);
```

## Serializing entities

Serializing entities to JSON is easy in principle cause Spring does it for us when we return a value from a controller,
there is a catch though, any fields that were just lazy loaded by Hibernate from the database will fail to convert to
JSON
because serializer is already out of Hibernate context. To avoid these issue its nice to pass smaller object with only
required fields to the serializer. This is mostly the purpose of `models.dto` package. For example for the company class
there are a couple of different DTO classes with only selected fields specified, this is to avoid serialization errors.
Also all of these DTO classes support creation directly from the company using the static `fromCompany` method.

```java

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyListingDTO {

    private UUID id;
    private String name;
    private Address address;
    private String phone;
    private String www;
    private String email;
    private LocalDateTime insertDate;
    private Set<CompanyCategory> categories;
    private Set<ContactJourneyMinimalDTO> contactJourneys;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    // Even more field ignored from serialization
    @JsonIgnoreProperties(value = {"company", "campaign", "contactEvents"})
    private ContactJourneyMinimalDTO currentJourney;

    public static CompanyListingDTO fromCompany(Company company) {
        return fromCompany(company, null);
    }

    public static CompanyListingDTO fromCompany(Company company, UUID currentCampaign) {
        return builder()
                // Omitted for brevity
                .build();
    }
}

```

## Lombok's annotations
These generate Java code in the background that is indexed by idea so we can use all the constructors, setters, getters,
builders etc. that are defined using annotations.

Most commonly used annotations in the project:
* **@Data** - used on the class level, means that the whole class should be treated as a data structure and all fields 
should get a getter and a setter.
* **@Setter, @Getter** - used on the field level, means that a field should have a getter or a setter generated.
* **@AllArgsConstructor, @NoArgsConstructor** - used on the class level, means that the class should have a constructor 
with all the fields or no fields generated. It is possible to 
* **@Builder** - means that the class should have a builder generated.
