import serverless from 'serverless-http';
import app from '../backend/app';

// Export a Netlify-compatible handler that wraps the Express `app`.
export const handler = serverless(app as any);
