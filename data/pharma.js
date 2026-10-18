// Compatibility adapter. All content lives in the portable monitor-data.json.
import { monitorData } from '../lib/monitor-data.js';
const data=monitorData.extensions.legacyDashboard;
export const { pharmaApplications, pharmaMilestones, presentationSource, studies }=data;
export const pharmaSources=data.sourceCatalog.filter(source=>data.sourceGroups.pharma.includes(source.id));
