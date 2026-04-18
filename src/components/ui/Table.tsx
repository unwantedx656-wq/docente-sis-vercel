import React from 'react';
import { cn } from './Button';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ headers, children, className }) => {
  return (
    <div className={cn("w-full overflow-x-auto rounded-2xl border border-primary-800", className)}>
      <table className="w-full text-left border-collapse">
        <thead className="bg-primary-900/50">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-6 py-4 text-sm font-semibold text-slate-400 border-b border-primary-800">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-primary-900">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
