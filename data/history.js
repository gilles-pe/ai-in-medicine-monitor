// Compatibility adapter. All content lives in the portable monitor-data.json.
import { monitorData } from '../lib/monitor-data.js';
const data=monitorData.extensions.legacyDashboard;
export const { historyEvents, presentationScenarios }=data;
export const historySources=data.sourceCatalog.filter(source=>data.sourceGroups.history.includes(source.id));
