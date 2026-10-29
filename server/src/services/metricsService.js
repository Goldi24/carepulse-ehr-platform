const { initialAgileMetrics } = require('../data/initialData');

let agileMetrics = JSON.parse(JSON.stringify(initialAgileMetrics));

function getAgileMetrics() {
  return agileMetrics;
}

function updateMetric(level, metricName, newValue) {
  let targetArray;
  if (level === 'strategic') targetArray = agileMetrics.strategicMetrics;
  else if (level === 'tactical') targetArray = agileMetrics.tacticalMetrics;
  else if (level === 'operational') targetArray = agileMetrics.operationalMetrics;

  if (!targetArray) return null;

  const metric = targetArray.find(m => m.name.toLowerCase() === metricName.toLowerCase());
  if (!metric) return null;

  metric.current = newValue;
  return metric;
}

function updateEpicProgress(epicName, completion, storiesCompleted) {
  const epic = agileMetrics.epicsProgress.find(e => e.epic.toLowerCase() === epicName.toLowerCase());
  if (!epic) return null;

  if (typeof completion === 'number') epic.completion = completion;
  if (typeof storiesCompleted === 'number') epic.storiesCompleted = storiesCompleted;
  if (epic.completion >= 100) epic.status = 'Completed';
  else if (epic.completion > 0) epic.status = 'In-Progress';

  return epic;
}

function resetAgileMetrics() {
  agileMetrics = JSON.parse(JSON.stringify(initialAgileMetrics));
}

module.exports = {
  getAgileMetrics,
  updateMetric,
  updateEpicProgress,
  resetAgileMetrics
};
