const { Service } = require('feathers-mongodb');

exports.Forms = class Forms extends Service {
  constructor(options, app) {
    super(options);

    app.get('mongoClient').then(db => {
      this.Model = db.collection('forms');
    });
  }
};
