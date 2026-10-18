// Compatibility adapter. All content lives in the portable monitor-data.json.
import { monitorData } from '../lib/monitor-data.js';
const data=monitorData.extensions.legacyDashboard;
export const { trackMilestones, trustContext }=data;
export const trackSources=data.sourceCatalog.filter(source=>data.sourceGroups.track.includes(source.id));
