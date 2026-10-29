const { initialOrders } = require('../data/initialData');

let orders = JSON.parse(JSON.stringify(initialOrders));

function getAllOrders(filter = {}) {
  let result = [...orders];

  if (filter.patientId) {
    result = result.filter(o => o.patientId === filter.patientId);
  }

  if (filter.type) {
    result = result.filter(o => o.type.toLowerCase() === filter.type.toLowerCase());
  }

  if (filter.status) {
    result = result.filter(o => o.status.toLowerCase() === filter.status.toLowerCase());
  }

  return result;
}

function getOrderById(id) {
  return orders.find(o => o.id === id);
}

function createOrder(data) {
  const newId = `ORD-${Math.floor(800 + Math.random() * 500)}`;

  const newOrder = {
    id: newId,
    patientId: data.patientId,
    encounterId: data.encounterId || null,
    type: data.type || "Laboratory", // Laboratory, Imaging, Procedure
    category: data.category || (data.type === "Imaging" ? "PACS" : "LIS"),
    testName: data.testName || "Standard Panel",
    loincCode: data.loincCode || "0000-0",
    priority: data.priority || "Routine", // Routine, Urgent, STAT
    orderedBy: data.orderedBy || "Attending Physician",
    orderDate: data.orderDate || new Date().toISOString(),
    status: data.status || "Ordered",
    results: data.results || [],
    clinicalNotes: data.clinicalNotes || "",
    pacsViewerUrl: data.type === "Imaging" ? `/imaging/viewer?studyId=STU-${Math.floor(10000 + Math.random() * 89999)}&patient=${data.patientId}` : null,
    radiologistImpression: data.radiologistImpression || null,
    reportedAt: null
  };

  orders.unshift(newOrder);
  return newOrder;
}

function updateOrderStatus(id, status, results = null, impression = null) {
  const order = orders.find(o => o.id === id);
  if (!order) return null;

  order.status = status;
  if (results) {
    order.results = results;
  }
  if (impression) {
    order.radiologistImpression = impression;
  }
  if (status === "Completed" || status === "Reported") {
    order.reportedAt = new Date().toISOString();
  }

  return order;
}

function resetOrders() {
  orders = JSON.parse(JSON.stringify(initialOrders));
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  resetOrders
};
