import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppSelector } from '@/store/store';
import { selectUiConfig } from '@/store/slices/uiConfigSlice';

import BusinessRulesList from '@/components/BusinessRules/BusinessRulesList';
import BusinessRuleForm from '@/components/BusinessRules/BusinessRuleForm';
import { PageHeader } from '@/components/PageHeader';

const BusinessRulesPage: React.FC = () => {
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
                title="Business Rules"
                description="Configure business rules to define data validation, transformations, and automated workflows."
              />
              <BusinessRulesList />
            </>
          } 
        />
        <Route 
          path="/create" 
          element={
            <>
              <PageHeader 
                title="Create Business Rule"
                description="Define a new business rule for data validation, transformation, or workflow automation."
                backLink="/settings/business-rules"
              />
              <BusinessRuleForm />
            </>
          } 
        />
        <Route 
          path="/edit/:id" 
          element={
            <>
              <PageHeader 
                title="Edit Business Rule"
                description="Modify an existing business rule's conditions and actions."
                backLink="/settings/business-rules"
              />
              <BusinessRuleForm />
            </>
          } 
        />
      </Routes>
    </div>
  );
};

export default BusinessRulesPage;
