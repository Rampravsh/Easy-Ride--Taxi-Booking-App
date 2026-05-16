import React from 'react';
import { cn } from '../../utils/cn';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  expandedRowRender?: (item: T) => React.ReactNode;
  expandedRowId?: string | number;
  rowIdKey: keyof T;
}

function DataTable<T>({ 
  columns, 
  data, 
  onRowClick, 
  expandedRowRender, 
  expandedRowId,
  rowIdKey 
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={cn(
                    "px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item) => {
              const itemId = item[rowIdKey] as unknown as string | number;
              const isExpanded = expandedRowId === itemId;

              return (
                <React.Fragment key={itemId}>
                  <tr 
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      "group hover:bg-muted/30 transition-colors cursor-pointer",
                      isExpanded && "bg-muted/50"
                    )}
                  >
                    {columns.map((col, idx) => (
                      <td 
                        key={idx} 
                        className={cn(
                          "px-4 py-4 text-sm text-foreground/90 font-medium",
                          col.className
                        )}
                      >
                        {typeof col.accessor === 'function' 
                          ? col.accessor(item) 
                          : (item[col.accessor] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                  {isExpanded && expandedRowRender && (
                    <tr className="bg-muted/50">
                      <td colSpan={columns.length} className="px-0 py-0">
                        <div className="p-6 border-t border-border animate-in slide-in-from-top-2 duration-200">
                          {expandedRowRender(item)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
