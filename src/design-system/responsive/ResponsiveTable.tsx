import React, { ReactNode } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  keyField: string;
  className?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ 
  columns, 
  data, 
  keyField,
  className = '' 
}) => {
  const { isMobile } = useBreakpoint();

  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {data.map(row => (
          <div key={row[keyField]} className="bg-elevated border border-border rounded-lg p-4">
            {columns.filter(col => !col.hideOnMobile).map(col => (
              <div key={col.key} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="font-medium text-muted text-sm">{col.label}</span>
                <span className="text-foreground">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            {columns.map(col => (
              <th key={col.key} className="text-left p-3 font-semibold text-foreground">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row[keyField]} className="border-b border-border hover:bg-elevated">
              {columns.map(col => (
                <td key={col.key} className="p-3 text-foreground">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
