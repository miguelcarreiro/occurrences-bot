module.exports = (sequelize, DataTypes) => {
  const Occurrences = sequelize.define('Occurrences', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    time: DataTypes.DATE,
    family: DataTypes.STRING,
    category: DataTypes.STRING,
    nature: DataTypes.STRING,
    status: DataTypes.STRING,
    district: DataTypes.STRING,
    municipality: DataTypes.STRING,
    parish: DataTypes.STRING,
    town: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    operatives: DataTypes.INTEGER,
    ground: DataTypes.INTEGER,
    aerial: DataTypes.INTEGER,
    aerialOperatives: DataTypes.INTEGER
  }, {});

  return Occurrences;
};