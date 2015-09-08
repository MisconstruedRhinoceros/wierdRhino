var Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root@localhost:3306/stackmatch', {logging: false});
var models = {
  'Technology': {
    folder: 'technologies',
    file: 'technologyModel',
  },
  'Product': {
    folder: 'products',
    file: 'productModel',
  },
  'Company': {
    folder: 'companies',
    file: 'companyModel',
  },
  'User': {
    folder: 'users',
    file: 'userModel'
  }
};

for(var model in models) {
  module.exports[model] = sequelize.import(__dirname + '/../' + models[model]['folder'] + "/" + models[model]['file']);
};

//Relationships
(function(m) {
  //Many to many products and technologies
  m.Product.belongsToMany(m.Technology, {through: 'ProductTechnologies'});
  m.Technology.belongsToMany(m.Product, {through: 'ProductTechnologies'});

  m.User.belongsToMany(m.Technology, {through: 'UserTechnologies'});
  m.Technology.belongsToMany(m.User, {through: 'UserTechnologies'});

  m.User.belongsToMany(m.Product, {through: 'UserProducts'});
  m.Product.belongsToMany(m.User, {through: 'UserProducts'});

  //One company, many products
  m.Company.hasMany(m.Product);
  m.Product.belongsTo(m.Company);

  //Sync here after relationships are added
  m.Technology.sync();
  m.Product.sync();
  m.Company.sync();
  m.User.sync();
  sequelize.sync(); //Creates join table
})(module.exports);

module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;
