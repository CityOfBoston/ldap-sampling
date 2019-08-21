# COB OpenLDAP Docker Image for testing

## Based on 'rroemhild' [Docker](https://hub.docker.com/r/rroemhild/test-openldap) LDAP Testing Server [Repo](https://github.com/rroemhild/docker-test-openldap)

## Usage

```bash
# Docker Image:
# docker pull phillipbentonkelly/docker-ldap-mock-data
docker pull bostongov/ldap-sampling
# docker run --privileged -d -p 388:389 phillipbentonkelly/docker-ldap-mock-data
docker run --privileged -d -p 389:389 bostongov/ldap-sampling
# OR

# Repo pull-down (Use this method if you plan on running the node server)
# git clone git@github.com:phillipbentonkelly/docker-ldap-mock-data.git
git clone git@github.com:CityOfBoston/ldap-sampling.git
# cd into the directory
docker build -t ldap-mock-1 --no-cache . && docker run --privileged -d -p 389:389 --name ldap-mock-1 ldap-mock-1
```

## Requests

```bash
# Search on `CN`
ldapsearch -x -H ldap://localhost:388 -b "dc=boston,dc=cob" '(cn=000296)'
# The request above request all and filters by the provided 'cn'
# ----
# filter: (cn=000296)
# requesting: ALL
# ----
# -b basedn  base dn for search: "dc=boston,dc=cob"


# Add User
ldapadd -x -D cn=admin,dc=boston,dc=cob -H ldap://localhost:388 -w 'GoodNewsEveryone' <<!
dn: cn=Celes Chere, cn=Internal Users,dc=boston,dc=cob
objectClass: inetorgperson
objectClass: top
objectClass: organizationalPerson
objectClass: person
employeetype: Full-Time
mail: celes.chere@boston.gov
sn: Chere
givenname: Celes
cn: Celes Chere
uid: Celes Chere
!
# Binding DN: 'cn=admin,dc=boston,dc=dob'
# Group/Ldap Password: -w 'GoodNewsEveryone'
# Fields between <<! and ! set the entries attributes

# Modify Group, add new member 'uniqueMember'
ldapmodify -x -D cn=admin,dc=boston,dc=cob -H ldap://localhost:388 -w 'GoodNewsEveryone' <<!
dn: cn=ANML02_LostFound,cn=Lagan_Groups,cn=Groups,dc=boston,dc=cob
changetype: modify
add: uniquemember
uniquemember: cn=132367,cn=Internal Users,dc=boston,dc=cob
!
```

## LDAP JS

We use [ldapjs](https://www.getpostman.com/collections/0099608da43d200f7674) to interact with the Active Directory System we just stood up with Docker. We use Hapi.js to standup a node web server at [http://localhost:8000](http://localhost:8000). These are some of the commands that can be run against ldapjs to fetch and modify Groups.

## [Postman Workspace](https://www.getpostman.com/collections/0099608da43d200f7674)

```bash
# POST Fetch All Groups: localhost:8000/manage-groups/search/groups
curl --location --request POST "localhost:8000/manage-groups/search/groups" \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --data "filter=%28objectClass%3DgroupOfUniqueNames%29&attributes=%20dc%2Ccn%2CuniqueMember"

# POST Get Groups by name (3 letter min): localhost:8000/manage-groups/search/groups
curl --location --request POST "localhost:8000/manage-groups/search/groups" \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --data "filter=%28%26%28objectClass%3DgroupOfUniqueNames%29%28cn%3DBP*%29%29&attributes=%20dc%2Ccn%2CuniqueMember"

# POST Find User by 'cn': localhost:8000/manage-groups/search/person
curl --location --request POST "localhost:8000/manage-groups/search/person" \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --data "filter=%28%26%28objectClass%3DorganizationalPerson%29%28cn%3DLag*%29%29"

# POST Find User by 'displayName': localhost:8000/manage-groups/search/person
curl --location --request POST "localhost:8000/manage-groups/search/person" \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --data "filter=%28%26%28objectClass%3DorganizationalPerson%29%28cn%3DLag*%29%29"

# PATCH Add uniqueMember - localhost:8000/manage-groups/update/group
curl --location --request PATCH "localhost:8000/manage-groups/update/group" \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --data "dn=cn%3DBPD_Administrative%2Ccn%3DLagan_Groups%2Ccn%3DGroups%2Cdc%3Dboston%2Cdc%3Dcob&operation=add&uniqueMember=cn%3DFreya%20Crescent%2Ccn%3DInternal%20Users%2Cdc%3Dboston%2Cdc%3Dcob"

# PATCH Delete Group uniqueMember - localhost:8000/manage-groups/update/group
curl --location --request PATCH "localhost:8000/manage-groups/update/group" \
  --header "Content-Type: application/x-www-form-urlencoded" \
  --data "dn=cn%3DBPD_Administrative%2Ccn%3DLagan_Groups%2Ccn%3DGroups%2Cdc%3Dboston%2Cdc%3Dcob&operation=delete&uniqueMember=cn%3DFreya%20Crescent%2Ccn%3DInternal%20Users%2Cdc%3Dboston%2Cdc%3Dcob"

```

-----


## LDAP structure

### Base DN: dc=boston,dc=cob

| Admin            | Secret           |
| ---------------- | ---------------- |
| cn=admin,dc=boston,dc=cob | GoodNewsEveryone |

## Internal Users

### Internal Users: cn=Internal Users,dc=boston,dc=cob

#### cn=000296,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 000296 |
| sn               | Howard |
| displayName      | Terra Howard |
| givenName        | Terra |
| mail             | terra.howard@boston.gov |
| uid              | 000296 |

#### cn=050086,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 050086 |
| sn               | Palazzo |
| displayName      | Kefka Palazzo |
| givenName        | Kefka |
| mail             | kefka.palazzo@cityofboston.gov |
| uid              | 050086 |

#### cn=052947,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 052947 |
| sn               | Harvey |
| displayName      | Cecil Harvey |
| givenName        | Cecil |
| mail             | cecil.harvey@boston.gov |
| uid              | 052947 |

#### cn=053342,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 053342 |
| sn               | Gainsborough |
| displayName      | Aeris Gainsborough |
| givenName        | Aeris |
| mail             | aeris.gainsborough@cityofboston.gov |
| uid              | 053342 |

#### cn=053355,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 053355 |
| sn               | Fair |
| displayName      | Zack Fair |
| givenName        | Zack |
| mail             | zack.fair@cityofboston.gov |
| uid              | 053355 |

#### cn=054363,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 054363 |
| sn               | Wallace |
| displayName      | Barret Wallace |
| givenName        | Barret |
| mail             | barret.wallace@cityofboston.gov |
| uid              | 054363 |

#### cn=081782,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 081782 |
| sn               | Trepe |
| displayName      | Quistis Trepe |
| givenName        | Quistis |
| mail             | quistis.trepe@cityofboston.gov |
| uid              | 081782 |

#### cn=087028,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 087028 |
| sn               | Valentine |
| displayName      | Vincent Valentine |
| givenName        | Vincent |
| mail             | vincent.valentine@cityofboston.gov |
| uid              | 087028 |

#### cn=097738,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 097738 |
| sn               | Orunitia |
| displayName      | Vivi Orunitia |
| givenName        | Vivi |
| mail             | vivi.orunitia@cityofboston.gov |
| uid              | 097738 |

#### cn=100992,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 100992 |
| sn               | Heartilly |
| displayName      | Rinoa Heartilly |
| givenName        | Rinoa |
| mail             | rinoa.heartilly@cityofboston.gov |
| uid              | 100992 |

#### cn=132367,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 132367 |
| sn               | Strife |
| displayName      | Cloud Strife |
| givenName        | Cloud |
| mail             | cloud.strife@cityofboston.gov |
| uid              | 132367 |

#### cn=143523,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | 143523 |
| sn               | Tribal |
| displayName      | Zidane Tribal |
| givenName        | Zidane |
| mail             | zidane.strife@cityofboston.gov |
| uid              | 143523 |

#### cn=Celes Chere,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | Celes Chere |
| sn               | Tribal |
| displayName      | Celes Chere |
| givenName        | Celes |
| mail             | celes.chere@cityofboston.gov |
| uid              | Celes Chere |

#### cn=Edea Kramer,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | Edea Kramer |
| sn               | Kramer |
| displayName      | Edea Kramer |
| givenName        | Edea |
| mail             | edea.kramer@cityofboston.gov |
| uid              | Edea Kramer |

#### cn=Freya Crescent,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | Edea Kramer |
| sn               | Kramer |
| displayName      | Edea Kramer |
| givenName        | Edea |
| mail             | edea.kramer@cityofboston.gov |
| uid              | Edea Kramer |

#### cn=Garnet Alexandros,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | Edea Kramer |
| sn               | Alexandros |
| displayName      | Garnet Alexandros |
| givenName        | Garnet |
| mail             | garnet.alexandros@cityofboston.gov |
| uid              | Garnet Alexandros |

#### cn=Ignis Scientia,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | Ignis Scientia  |
| sn               | Scientia |
| displayName      | Ignis Scientia |
| givenName        | Ignis |
| mail             | ignis.scientia@cityofboston.gov |
| uid              | Ignis Scientia |

#### cn=Laguna Loire,ou=Internal Users,dc=boston,dc=cob

| Attribute        | Value            |
| ---------------- | ---------------- |
| objectClass      | inetOrgPerson |
| cn               | Laguna Loire  |
| sn               | Scientia |
| displayName      | Laguna Loire |
| givenName        | Ignis |
| mail             | ignis.scientia@cityofboston.gov |
| uid              | Ignis Scientia |
