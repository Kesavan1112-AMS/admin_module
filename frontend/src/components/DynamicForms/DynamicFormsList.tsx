import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Plus, Filter, Search, Eye } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/store';
import { 
  fetchForms, 
  deleteForm,
  selectAllForms,
  selectDynamicFormsLoading
} from '@/store/slices/dynamicFormsSlice';

const DynamicFormsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const forms = useAppSelector(selectAllForms);
  const loading = useAppSelector(selectDynamicFormsLoading);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('');
  
  // Get unique entity types for filters
  const entityTypes = [...new Set(forms.map(form => form.entityType).filter(Boolean))];
  
  useEffect(() => {
    dispatch(fetchForms());
  }, [dispatch]);
  
  // Filter forms based on search and filters
  const filteredForms = forms.filter(form => {
    const matchesSearch = 
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEntityType = entityTypeFilter ? form.entityType === entityTypeFilter : true;
    
    return matchesSearch && matchesEntityType;
  });
  
  const handleEdit = (id: number) => {
    navigate(`/settings/forms/edit/${id}`);
  };
  
  const handleView = (id: number) => {
    navigate(`/settings/forms/view/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      await dispatch(deleteForm(id));
    }
  };
  
  const handleAddNew = () => {
    navigate('/settings/forms/create');
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dynamic Forms</CardTitle>
        <Button onClick={handleAddNew} className="ml-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forms..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {entityTypes.length > 0 && (
            <div className="flex items-center space-x-2">
              <Select
                value={entityTypeFilter}
                onValueChange={setEntityTypeFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Entity Types</SelectItem>
                  {entityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No forms found. Create one to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Fields</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.name}</TableCell>
                  <TableCell>{form.entityType || 'N/A'}</TableCell>
                  <TableCell>{form.fields?.length || 0}</TableCell>
                  <TableCell>
                    <Badge
                      variant={form.status === 'A' ? 'success' : 'destructive'}
                    >
                      {form.status === 'A' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(form.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(form.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(form.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicFormsList;
