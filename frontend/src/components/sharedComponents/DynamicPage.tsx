import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PageConfig,
  getPageConfiguration,
} from "../../services/UiConfig.service";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus, Edit, Trash2, Download, Search, Filter } from "lucide-react";

interface DynamicPageProps {
  companyId: number;
  pageKey: string;
  className?: string;
}

const DynamicPage: React.FC<DynamicPageProps> = ({
  companyId,
  pageKey,
  className = "",
}) => {
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPageConfig = async () => {
      try {
        setLoading(true);
        const response = await getPageConfiguration(companyId, pageKey);
        if (response.status === 1 && response.data) {
          setPageConfig(response.data);
          // TODO: Fetch actual data based on page configuration
          setData([]);
        } else {
          console.error("Failed to fetch page config:", response.msg);
        }
      } catch (error) {
        console.error("Error fetching page config:", error);
      } finally {
        setLoading(false);
      }
    };

    if (companyId && pageKey) {
      fetchPageConfig();
    }
  }, [companyId, pageKey]);

  const handleAction = (actionKey: string) => {
    switch (actionKey) {
      case "create":
        console.log("Create action triggered");
        break;
      case "edit":
        console.log("Edit action triggered");
        break;
      case "delete":
        console.log("Delete action triggered");
        break;
      case "export":
        console.log("Export action triggered");
        break;
      default:
        console.log(`Action ${actionKey} triggered`);
    }
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="text"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );
      case "number":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="number"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );
      case "email":
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="email"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );
      default:
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="text"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );
    }
  };

  const renderTableCell = (column: any, value: any) => {
    switch (column.type) {
      case "toggle":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={() => {}}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        );
      case "status":
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              value === "A"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value === "A" ? "Active" : "Inactive"}
          </span>
        );
      default:
        return <span>{value}</span>;
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!pageConfig) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <p>Page configuration not found</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {pageConfig.title}
          </h1>
          {pageConfig.description && (
            <p className="text-gray-600 mt-1">{pageConfig.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {pageConfig.actions.map((action) => (
            <Button
              key={action.key}
              onClick={() => handleAction(action.key)}
              variant={action.key === "create" ? "default" : "outline"}
              size="sm"
            >
              {action.key === "create" && <Plus className="w-4 h-4 mr-2" />}
              {action.key === "edit" && <Edit className="w-4 h-4 mr-2" />}
              {action.key === "delete" && <Trash2 className="w-4 h-4 mr-2" />}
              {action.key === "export" && <Download className="w-4 h-4 mr-2" />}
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No data available</p>
              <Button
                onClick={() => handleAction("create")}
                className="mt-4"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {pageConfig.columns.map((column) => (
                      <th
                        key={column.key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((item, index) => (
                    <tr key={index}>
                      {pageConfig.columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {renderTableCell(column, item[column.key])}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction("edit")}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction("delete")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Fields (for create/edit) */}
      {pageConfig.fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Form Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pageConfig.fields.map((field) => renderField(field))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DynamicPage;
