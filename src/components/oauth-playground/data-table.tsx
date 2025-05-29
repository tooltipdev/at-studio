import { flatten } from 'flat';
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/shadcn/table';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/shadcn/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/shadcn/collapsible';

import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';

const altBg = 'bg-slate-100';

function parseValueToDisplayValue(val: unknown) {
  switch (typeof val) {
    case 'number':
    case 'string':
      return val;
    default:
      return JSON.stringify(val);
  }
}

function getComponentForType(val: unknown) {
  if (Array.isArray(val)) return <CollapsibleDataSet elements={val} />;
  if (typeof val === 'object') return <DataTable data={val as { [key: string]: unknown }} />;

  return parseValueToDisplayValue(val);
}

function CollapsibleDataSet({ elements }: { elements: unknown[] }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
      <div className="flex items-center space-x-4">
        <CollapsibleTrigger asChild disabled={elements.length ? false : true}>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
        <h4 className={`text-sm font-semibold ${elements.length ? '': 'text-gray-400'} pr-4`}>{elements.length} elements</h4>
      </div>
      <CollapsibleContent className="">
        <ScrollArea className="overflow-auto">
          {elements.map((e, i) => {
            return (
              <div className={`p-2 font-mono text-sm ${i % 2 ? altBg : ''}`}>
                {getComponentForType(e)}
              </div>
            );
          })}
          <ScrollBar orientation="horizontal" />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}

function DataTable({
  data,
  header,
  description,
}: {
  data: { [key: string]: unknown };
  header?: string[];
  description?: string;
}) {
  return (
    <Table className="border">
      {description && <TableCaption>{description}</TableCaption>}
      <TableHeader>
        {header &&
          header.map((h) => (
            <TableRow>
              <TableHead>{h}</TableHead>
            </TableRow>
          ))}
      </TableHeader>
      <TableBody>
        {Object.entries(
          flatten(JSON.parse(JSON.stringify(data)), { maxDepth: 3, safe: true }) as {
            [key: string]: unknown;
          }
        ).map(([k, v], i) => {
          return (
            <TableRow>
              <TableCell className="border-r text-left font-medium bg-gray-50">{k}</TableCell>
              <TableCell className={i % 2 ? altBg : ''}>{getComponentForType(v)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default DataTable;
