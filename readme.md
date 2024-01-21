Here is git repo url:
https://github.com/virendrabhati90/unified-media-metadata-integration-with-rbac.git

Here is steps to execute project in local:
1 Install nodejs latest version
2 Install git latest version
3 create folder in your directory like test
4 run git clone https://github.com/virendrabhati90/unified-media-metadata-integration-with-rbac.git
5 git checkout master
6 run npm install
7 run node index.js

In Browser use below URL to verify data:
Fetch single conslidated Data - http://localhost:8090/fetch-consolidateData
Fetch Admin control fields - http://localhost:8090/consolidate/Admin 
Fetch Viewer Control fields: http://localhost:8090/consolidate/Viewer
Fetch Editor Control Fields: http://localhost:8090/consolidate/Editor

API for Add/Edit/Delete
Add - Method POST - http://localhost:8090/consolidate
Update - Method PUT - http://localhost:8090/consolidate/:id
Delete - Method delete - http://localhost:8090/consolidate/:id


Middle ware Added so pass headers as Admin, Editor and Viewer
// Middleware to extract user role from headers
app.use((req, res, next) => {
  req.user = {
    role: req.headers['x-user-role'] || 'Viewer', // Default to 'Viewer' if not provided
  };
  next();
});



Here is package.json
{
  "name": "unified-media-metadata-integration-with-rbac",
  "version": "1.0.0",
  "description": "Unified Media Metadata Integration with RBAC and Node.Js",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/virendrabhati90/unified-media-metadata-integration-with-rbac.git"
  },
  "keywords": [
    "unified-media-metadata-integration-with-rbac",
    "sony-test"
  ],
  "author": "Virendra Singh Bhati",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/virendrabhati90/unified-media-metadata-integration-with-rbac/issues"
  },
  "homepage": "https://github.com/virendrabhati90/unified-media-metadata-integration-with-rbac#readme",
  "dependencies": {
    "body-parser": "^1.20.2",
    "express": "^4.18.2",
    "fs": "^0.0.1-security",
    "path": "^0.12.7",
    "request": "^2.88.2",
    "uuid": "^9.0.1"
  }
}
