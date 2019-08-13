# COB OpenLDAP Docker Image for testing

## Based on 'rroemhild' [Docker](https://hub.docker.com/r/rroemhild/test-openldap) LDAP Testing Server [Repo](https://github.com/rroemhild/docker-test-openldap)

## Usage

```bash
# Docker Image:
docker pull phillipbentonkelly/docker-ldap-mock-data
docker run --privileged -d -p 389:389 phillipbentonkelly/docker-ldap-mock-data
# OR

# Repo pull-down
git clone git@github.com:phillipbentonkelly/docker-ldap-mock-data.git
# cd into the directory
docker build -t ldap-mock-2 --no-cache . && docker run --privileged -d -p 389:389 --name ldap-mock-2 ldap-mock-2
```

## LDAP structure

### dc=boston,dc=cob

| Admin            | Secret           |
| ---------------- | ---------------- |
| cn=admin,dc=boston,dc=cob | GoodNewsEveryone |





