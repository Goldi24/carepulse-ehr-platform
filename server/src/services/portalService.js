const { initialAppointments, initialMessages } = require('../data/initialData');

let appointments = JSON.parse(JSON.stringify(initialAppointments));
let messages = JSON.parse(JSON.stringify(initialMessages));

function getAppointments(patientId = null) {
  if (patientId) {
    return appointments.filter(a => a.patientId === patientId);
  }
  return appointments;
}

function bookAppointment(data) {
  const newApt = {
    id: `APT-${Math.floor(200 + Math.random() * 800)}`,
    patientId: data.patientId,
    providerName: data.providerName || "Dr. Staff Clinician, MD",
    department: data.department || "General Medicine",
    dateTime: data.dateTime || new Date(Date.now() + 86400000 * 3).toISOString(),
    type: data.type || "In-Person", // In-Person, Telehealth
    reason: data.reason || "General Consultation",
    status: "Scheduled"
  };

  appointments.unshift(newApt);
  return newApt;
}

function cancelAppointment(id) {
  const apt = appointments.find(a => a.id === id);
  if (!apt) return null;
  apt.status = "Cancelled";
  return apt;
}

function getMessages(patientId = null) {
  if (patientId) {
    return messages.filter(m => m.patientId === patientId);
  }
  return messages;
}

function sendMessage(data) {
  const newMsg = {
    id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
    patientId: data.patientId,
    sender: data.sender || "Patient",
    recipient: data.recipient || "Care Team",
    subject: data.subject || "No Subject",
    body: data.body || "",
    timestamp: new Date().toISOString(),
    isRead: false,
    replies: []
  };

  messages.unshift(newMsg);
  return newMsg;
}

function replyMessage(messageId, sender, body) {
  const msg = messages.find(m => m.id === messageId);
  if (!msg) return null;

  const reply = {
    id: `REP-${Math.floor(100 + Math.random() * 900)}`,
    sender: sender,
    body: body,
    timestamp: new Date().toISOString()
  };

  msg.replies.push(reply);
  msg.isRead = true;
  return msg;
}

function resetPortal() {
  appointments = JSON.parse(JSON.stringify(initialAppointments));
  messages = JSON.parse(JSON.stringify(initialMessages));
}

module.exports = {
  getAppointments,
  bookAppointment,
  cancelAppointment,
  getMessages,
  sendMessage,
  replyMessage,
  resetPortal
};
