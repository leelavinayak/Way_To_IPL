const Bus = require('../models/Bus');
const Route = require('../models/Route');
const BusCompany = require('../models/BusCompany');

exports.searchBuses = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const route = await Route.findOne({ from: new RegExp(from, 'i'), to: new RegExp(to, 'i'), isActive: true });
    if (!route) {
      return res.json({ buses: [], message: 'No routes found' });
    }
    const buses = await Bus.find({ route: route._id, isActive: true }).populate('company', 'name logo');
    res.json({ buses, route });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('company', 'name logo').populate('route');
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ isActive: true }).populate('company', 'name logo').populate('route');
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBusCompanies = async (req, res) => {
  try {
    const companies = await BusCompany.find({ isActive: true });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
