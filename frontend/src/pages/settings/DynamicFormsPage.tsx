import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppSelector } from '@/store/store';
import { selectUiConfig } from '@/store/slices/uiConfigSlice';

import DynamicFormsList from '@/components/DynamicForms/DynamicFormsList';
import { PageHeader } from '@/components/PageHeader';

const DynamicFormsPage: React.FC = () => {
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
                title="Dynamic Forms"
                description="Create and manage dynamic forms for data collection and entry."
              />
              <DynamicFormsList />
            </>
          } 
        />
        {/* Routes for create, edit, and view forms will be implemented later */}
      </Routes>
    </div>
  );
};

export default DynamicFormsPage;
