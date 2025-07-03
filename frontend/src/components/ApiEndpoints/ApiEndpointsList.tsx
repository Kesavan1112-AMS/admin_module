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
import { Pencil, Trash2, Plus, Filter, Search, Play } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/store';
import { 
  fetchApiEndpoints, 
  deleteApiEndpoint,
  selectAllApiEndpoints,
  selectApiEndpointsLoading
} from '@/store/slices/apiEndpointsSlice';

const ApiEndpointsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const endpoints = useAppSelector(selectAllApiEndpoints);
  const loading = useAppSelector(selectApiEndpointsLoading);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [handlerTypeFilter, setHandlerTypeFilter] = useState('');
  
  // Get unique methods and handler types for filters
  const methods = [...new Set(endpoints.map(endpoint => endpoint.method))];
  const handlerTypes = [...new Set(endpoints.map(endpoint => endpoint.handlerType))];
  
  useEffect(() => {
    dispatch(fetchApiEndpoints());
  }, [dispatch]);
  
  // Filter endpoints based on search and filters
  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = 
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = methodFilter ? endpoint.method === methodFilter : true;
    const matchesHandlerType = handlerTypeFilter ? endpoint.handlerType === handlerTypeFilter : true;
    
    return matchesSearch && matchesMethod && matchesHandlerType;
  });
  
  const handleEdit = (id: number) => {
    navigate(`/settings/api-endpoints/edit/${id}`);
  };
  
  const handleExecute = (id: number) => {
    navigate(`/settings/api-endpoints/execute/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this API endpoint?')) {
      await dispatch(deleteApiEndpoint(id));
    }
  };
  
  const handleAddNew = () => {
    navigate('/settings/api-endpoints/create');
  };
  
  const getMethodBadgeVariant = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'success';
      case 'POST':
        return 'default';
      case 'PUT':
        return 'warning';
      case 'PATCH':
        return 'outline';
      case 'DELETE':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>API Endpoints</CardTitle>
        <Button onClick={handleAddNew} className="ml-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create New Endpoint
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search endpoints..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={methodFilter}
              onValueChange={setMethodFilter}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Methods</SelectItem>
                {methods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={handlerTypeFilter}
              onValueChange={setHandlerTypeFilter}
            >
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Handler Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Handler Types</SelectItem>
                {handlerTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredEndpoints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No API endpoints found. Create one to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Handler Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEndpoints.map((endpoint) => (
                <TableRow key={endpoint.id}>
                  <TableCell className="font-medium">
                    {endpoint.path}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getMethodBadgeVariant(endpoint.method)}>
                      {endpoint.method}
                    </Badge>
                  </TableCell>
                  <TableCell>{endpoint.handlerType}</TableCell>
                  <TableCell>
                    <Badge
                      variant={endpoint.status === 'A' ? 'success' : 'destructive'}
                    >
                      {endpoint.status === 'A' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExecute(endpoint.id)}
                      title="Execute Endpoint"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(endpoint.id)}
                      title="Edit Endpoint"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(endpoint.id)}
                      title="Delete Endpoint"
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

export default ApiEndpointsList;
