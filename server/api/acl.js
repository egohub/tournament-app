var acl = require('acl');

module.exports = function(app, db) {

    var USER_ANONYMOUS = 'anonymous';
    var ROLE_GUEST = 'guest';
    var ROLE_EDITOR = 'editor';
    var ROLE_ADMIN = 'admin';

    // setup ACL storage and rules
    var mongoBackend = new acl.mongodbBackend(db, 'acl_');
    acl = new acl(mongoBackend);

    acl.allow([
        {
            roles:[ROLE_ADMIN],
            allows:[
                {resources:['/tournaments','/news','/results','/feedbacks'], permissions:'*'}
            ]
        },
        {
            roles:[ROLE_EDITOR],
            allows:[
                {resources:['/results','/news'], permissions:['post']},
                {resources:['/results/*','/news/*'], permissions:['put', 'delete']}
            ]
        },
        {
            roles:[ROLE_GUEST],
            allows:[
                {resources:['/feedbacks'], permissions:['post']},
                {resources:['/results', '/news', '/tournaments'], permissions:['get']}
            ]
        }
    ],
    function(err) {
        if (err) {
            console.log('Unable to setup permissions and roles..');
            console.log(err);
        }
    });


    // roles and anonymous user
    acl.addUserRoles(USER_ANONYMOUS, ROLE_GUEST);
    acl.addRoleParents(ROLE_EDITOR, [ROLE_GUEST]);
    
    // can't seem to get the inbuilt middleware() function from the acl 
    // pkg to work at all.  Replicate a lot of it here.
    return function (req, res, next) {
        if (!req.user) {
            req.user = {userId: USER_ANONYMOUS};
        }

        var url = req.url.split('?')[0];
        var resource = url.split('/').slice(0, 2).join('/');

        acl.isAllowed(req.user.userId, resource, req.method.toLowerCase(), function (error, result) {
            if (result) {
                next();
            }
            else {
                if (req.user.userId === USER_ANONYMOUS) {
                    res.status(401).send('Not authorised');
                }
                else {
                    res.status(403).send('Forbidden');
                }
            }
        });
    };
    
};
