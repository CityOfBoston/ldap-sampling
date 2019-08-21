'use strict';

const Hapi = require('@hapi/hapi');
const hbs = require('handlebars');

const ldap = require('ldapjs');
const ldapConfig = {
  url: 'ldap://localhost:388',
  baseDn: 'dc=boston,dc=cob',
  bindDn: 'cn=',
  scope: 'sub',
  passw: 'GoodNewsEveryone',
};
const client = ldap.createClient({ url: ldapConfig.url });


// Create Server with a host and port #
const server = Hapi.server({
  host: 'localhost',
  port: 8000
});

// Start the Server
async function start() {
  {
    try {
      await server.register({
        plugin: require('@hapi/vision')
      });

      // Config Views
      server.views({
        engines: {
            html: hbs
        },
        relativeTo: __dirname,
        path: 'templates'
      });

      // --------------------------------------
      // ENDPOINTs - Helpers
      // --------------------------------------
      const promise_ldapSearch = (err, res) => {
        return new Promise((resolve, reject) => {
          const entries = [];
          
          res.on('searchEntry', function(entry) {
            const currEntry = entry.object;
            entries.push(currEntry);
          });

          res.on('end', () => {
            resolve(entries);
          });
        });
      };

      // --------------------------------------
      // ENDPOINTs
      // --------------------------------------
      // SEARCH QRYs
      server.route({
        method: 'POST',
        path: '/manage-groups/search/groups',
        handler: (request) => {
          const results = new Promise(function(resolve) {
            const attrs = request.payload.attributes;
            const attrArr = typeof attrs !== 'undefined' ? attrs.trim().replace(/\s+/g,'').replace(/'/g,'').replace(/"/g,'').split(',') : undefined;

            client.search(ldapConfig.baseDn, {
              filter: request.payload.filter || '',
              scope: request.payload.scope || 'sub',
              attributes: attrArr || [],
            }, function(err, res){
              resolve(promise_ldapSearch(err, res));
            });
          });

          return results;
        }
      });

      server.route({
        method: 'POST',
        path: '/manage-groups/search/person',
        handler: (request) => {
          const results = new Promise(function(resolve) {
            const attrs = request.payload.attributes;
            const attrArr = typeof attrs !== 'undefined' ? attrs.trim().replace(/\s+/g,'').replace(/'/g,'').replace(/"/g,'').split(',') : undefined;

            client.search(ldapConfig.baseDn, {
              filter: request.payload.filter || '',
              scope: request.payload.scope || 'sub',
              attributes: attrArr || [],
            }, function(err, res){
              resolve(promise_ldapSearch(err, res));
            });
          });

          return results;
        }
      });

      // UPDATE
      server.route({
        method: 'PATCH',
        path: '/manage-groups/update/group',
        handler: (request) => {
          const payload = request.payload;
          const changeOpts = new ldap.Change({
            operation: payload.operation,
            modification: {
              uniqueMember: payload.uniqueMember,
            }
          });

          client.bind('cn=admin,dc=boston,dc=cob', ldapConfig.passw, function(err) {
            if(err)
              console.log('client.bind err: ', err);
          });
          client.modify(payload.dn, changeOpts, function(){});

          return 200;
        }
      });

      // --------------------------------------
      // ROUTES
      // --------------------------------------
      server.route({
        method: 'GET',
        path: '/',
        handler: () =>  {
          return '';
        }
      });

      // SEARCH PAGE
      server.route({
        method: 'GET',
        path: '/manage-groups',
        handler: (request, h) => {
          return h.view('index', {
            title: 'Search Groups/People',
          });
        }
      });

      // SEARCH RESULTS
      server.route({
        method: 'GET',
        path: '/manage-groups/results',
        handler: (request, h) => {
          return h.view('results', {
            title: 'Search Results', 
            search_results: [
              {
                "dn": "cn=PWDx_District03:NorthDorchester,cn=Lagan_Groups,cn=Groups,dc=boston,dc=cob",
                "controls": [],
                "cn": "PWDx_District03:NorthDorchester"
              },
              {
                "dn": "cn=PWDx_District07:SouthDorchester,cn=Lagan_Groups,cn=Groups,dc=boston,dc=cob",
                "controls": [],
                "cn": "PWDx_District07:SouthDorchester"
              },
              {
                "dn": "cn=PWDx_District10A:Roxbury,cn=Lagan_Groups,cn=Groups,dc=boston,dc=cob",
                "controls": [],
                "cn": "PWDx_District10A:Roxbury"
              }
            ]
          });
        }
      });

      // View/Edit Group or User
      server.route({
        method: 'GET',
        path: '/manage-groups/edit',
        handler: (request, h) => {
          return h.view('edit', {
            title: 'Edit Groups/People',
            edit: 'group',
          });
        }
      });

      // Confirm Changes
      server.route({
        method: 'GET',
        path: '/manage-groups/confirm',
        handler: (request, h) => {
          return h.view('confirm', {
            title: 'Confirm Changes',
            edit: 'group',
          });
        }
      });

      await server.start();
    } catch(err) {
      console.log(err);
      process.exit();
    }

    console.log( `Server running at: ${server.info.uri}`);
  }
};

start();
