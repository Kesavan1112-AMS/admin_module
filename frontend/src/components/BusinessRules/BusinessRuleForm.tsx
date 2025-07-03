import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  fetchBusinessRuleById,
  createBusinessRule,
  updateBusinessRule,
  selectCurrentBusinessRule,
  selectBusinessRulesLoading,
  clearCurrentBusinessRule
} from '@/store/slices/businessRulesSlice';

// Define form validation schema
const businessRuleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  entityType: z.string().min(1, 'Entity type is required'),
  eventType: z.string().min(1, 'Event type is required'),
  priority: z.coerce.number().int().min(0, 'Priority must be a positive number'),
  status: z.string().default('A'),
});

type BusinessRuleFormValues = z.infer<typeof businessRuleSchema>;

const BusinessRuleForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const currentRule = useAppSelector(selectCurrentBusinessRule);
  const loading = useAppSelector(selectBusinessRulesLoading);
  
  const [conditionJson, setConditionJson] = useState('{}');
  const [actionJson, setActionJson] = useState('{}');
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  const isEditMode = Boolean(id);
  
  // Form setup
  const form = useForm<BusinessRuleFormValues>({
    resolver: zodResolver(businessRuleSchema),
    defaultValues: {
      name: '',
      description: '',
      entityType: '',
      eventType: '',
      priority: 0,
      status: 'A',
    },
  });
  
  // Fetch rule data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchBusinessRuleById(parseInt(id, 10)));
    }
    
    return () => {
      dispatch(clearCurrentBusinessRule());
    };
  }, [dispatch, isEditMode, id]);
  
  // Update form values when current rule changes
  useEffect(() => {
    if (currentRule) {
      form.reset({
        name: currentRule.name,
        description: currentRule.description || '',
        entityType: currentRule.entityType,
        eventType: currentRule.eventType,
        priority: currentRule.priority,
        status: currentRule.status,
      });
      
      setConditionJson(JSON.stringify(currentRule.condition, null, 2));
      setActionJson(JSON.stringify(currentRule.action, null, 2));
    }
  }, [currentRule, form]);
  
  // Validate JSON input
  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      setJsonError(null);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        setJsonError(error.message);
      } else {
        setJsonError('Invalid JSON');
      }
      return false;
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: BusinessRuleFormValues) => {
    // Validate JSON inputs
    if (!validateJson(conditionJson) || !validateJson(actionJson)) {
      return;
    }
    
    const ruleData = {
      ...values,
      condition: JSON.parse(conditionJson),
      action: JSON.parse(actionJson),
    };
    
    if (isEditMode && id) {
      await dispatch(updateBusinessRule({ id: parseInt(id, 10), data: ruleData }));
    } else {
      await dispatch(createBusinessRule(ruleData));
    }
    
    navigate('/settings/business-rules');
  };
  
  // Common entity types and event types
  const commonEntityTypes = ['masterData', 'user', 'workflow', 'form'];
  const commonEventTypes = ['create', 'update', 'delete', 'validate', 'approve'];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Business Rule' : 'Create Business Rule'}</CardTitle>
        <CardDescription>
          Business rules define conditions and actions that are applied to entities in the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter rule name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormDescription>
                      Higher priority rules are evaluated first.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter rule description"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select entity type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commonEntityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom...</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commonEventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom...</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">Active</SelectItem>
                      <SelectItem value="I">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Tabs defaultValue="condition" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="condition" className="flex-1">Condition</TabsTrigger>
                <TabsTrigger value="action" className="flex-1">Action</TabsTrigger>
              </TabsList>
              <TabsContent value="condition" className="p-4 border rounded-md mt-2">
                <div className="mb-2">
                  <FormLabel>Condition JSON</FormLabel>
                  <FormDescription>
                    Define the condition that triggers this rule.
                  </FormDescription>
                </div>
                <CodeMirror
                  value={conditionJson}
                  height="200px"
                  extensions={[json()]}
                  onChange={(value) => setConditionJson(value)}
                  className="border rounded-md"
                />
                {jsonError && (
                  <p className="text-sm text-red-500 mt-2">
                    JSON Error: {jsonError}
                  </p>
                )}
              </TabsContent>
              <TabsContent value="action" className="p-4 border rounded-md mt-2">
                <div className="mb-2">
                  <FormLabel>Action JSON</FormLabel>
                  <FormDescription>
                    Define the action to take when the condition is met.
                  </FormDescription>
                </div>
                <CodeMirror
                  value={actionJson}
                  height="200px"
                  extensions={[json()]}
                  onChange={(value) => setActionJson(value)}
                  className="border rounded-md"
                />
                {jsonError && (
                  <p className="text-sm text-red-500 mt-2">
                    JSON Error: {jsonError}
                  </p>
                )}
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex justify-between px-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/settings/business-rules')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Update Rule' : 'Create Rule'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BusinessRuleForm;
