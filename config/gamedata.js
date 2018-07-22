var buildingTypes = [
  {
    id: 0,
    name: "Command Post",
    upgrade_time: 1000 * 60 * 10,
    costs: {
      metals: 200,
      dark_matter: 50
    }
  },
  {
    id: 1,
    name: "Space Port",
    upgrade_time: 1000 * 60 * 5,
    costs: {
      metals: 250,
      dark_matter: 100
    }
  },
  {
    id: 2,
    name: "Extractor",
    upgrade_time: 1000 * 60 * 3,
    costs: {
      metals: 100,
      dark_matter: 30
    }
  },
];

module.exports.buildingTypes = buildingTypes;
