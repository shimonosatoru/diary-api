module.exports = (sequelize, type) => {
  return sequelize.define('diary', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // user_id: type.STRING,
    title: type.STRING,
    body: type.STRING
  })
}