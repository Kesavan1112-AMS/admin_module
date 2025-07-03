import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppSelector } from '@/store/store';
import { selectUiConfig } from '@/store/slices/uiConfigSlice';

import ApiEndpointsList from '@/components/ApiEndpoints/ApiEndpointsList';
import { PageHeader } from '@/components/PageHeader';

const ApiEndpointsPage: React.FC = () => {
  const uiConfig = useAppSelector(selectUiConfig);
  
  // Check if the user has access to this page
  const canAccess = uiConfig.userPrivileges?.some(privilege => 
    privilege.moduleName === 'configuration' && privilege.name === 'read'
  );
  
  if (!canAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <PageHeader 
                title="API Endpoints"
                description="Create and manage custom API endpoints for data access and integration."
              />
              <ApiEndpointsList />
            </>
          } 
        />
        {/* Routes for create, edit, and execute endpoints will be implemented later */}
      </Routes>
    </div>
  );
};

export default ApiEndpointsPage;
