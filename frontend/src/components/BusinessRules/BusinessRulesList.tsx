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
import { Pencil, Trash2, Plus, Filter, Search } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/store/store';
import { 
  fetchBusinessRules, 
  deleteBusinessRule,
  selectAllBusinessRules,
  selectBusinessRulesLoading
} from '@/store/slices/businessRulesSlice';

const BusinessRulesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const businessRules = useAppSelector(selectAllBusinessRules);
  const loading = useAppSelector(selectBusinessRulesLoading);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  
  // Get unique entity types and event types for filters
  const entityTypes = [...new Set(businessRules.map(rule => rule.entityType))];
  const eventTypes = [...new Set(businessRules.map(rule => rule.eventType))];
  
  useEffect(() => {
    dispatch(fetchBusinessRules());
  }, [dispatch]);
  
  // Filter business rules based on search and filters
  const filteredRules = businessRules.filter(rule => {
    const matchesSearch = 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEntityType = entityTypeFilter ? rule.entityType === entityTypeFilter : true;
    const matchesEventType = eventTypeFilter ? rule.eventType === eventTypeFilter : true;
    
    return matchesSearch && matchesEntityType && matchesEventType;
  });
  
  const handleEdit = (id: number) => {
    navigate(`/settings/business-rules/edit/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this business rule?')) {
      await dispatch(deleteBusinessRule(id));
    }
  };
  
  const handleAddNew = () => {
    navigate('/settings/business-rules/create');
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Business Rules</CardTitle>
        <Button onClick={handleAddNew} className="ml-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add New Rule
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4 space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rules..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
            
            <Select
              value={eventTypeFilter}
              onValueChange={setEventTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Event Types</SelectItem>
                {eventTypes.map((type) => (
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
        ) : filteredRules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No business rules found. Create one to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.entityType}</TableCell>
                  <TableCell>{rule.eventType}</TableCell>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell>
                    <Badge
                      variant={rule.status === 'A' ? 'success' : 'destructive'}
                    >
                      {rule.status === 'A' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(rule.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rule.id)}
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

export default BusinessRulesList;
