// Compatibility adapter. All content lives in the portable monitor-data.json.
import { monitorData } from '../lib/monitor-data.js';
const data=monitorData.extensions.legacyDashboard;
export const { tracks, measurements, sourceCatalog, editorialStatus, studies, milestones, pharmaApplications, presentationSource }=data;
