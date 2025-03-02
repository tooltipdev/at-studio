import { flatten } from 'flat';
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/shadcn/table';

('use client');

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/shadcn/collapsible';

import { ScrollArea, ScrollBar } from '@/components/ui/shadcn/scroll-area';

const altBg = 'bg-slate-100';

function CollapsibleDataSet({ elements }: { elements: any[] }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[400px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">{elements.length} elements</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <ScrollArea className="max-h-[400px] w-[400px] overflow-auto whitespace-nowrap rounded-md border p-2">
          {elements.map((e, i) => {
            const parsedData = JSON.stringify(e)
            return <div className={`p-2 font-mono text-sm ${i % 2 ? altBg : ''}`}>
              {typeof parsedData === typeof e ? e : parsedData}
            </div>;
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
  data: { [key: string]: any };
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
        {Object.entries(flatten(data, { safe: true }) as { [key: string]: any }).map(
          ([k, v], i) => {
              const parsedData = JSON.stringify(v)
            return (
                <TableRow>
                  <TableCell className="border-r text-center font-medium">{k}</TableCell>
                  <TableCell className={i % 2 ? altBg : ''}>
                    {Array.isArray(v) ? (
                      <CollapsibleDataSet elements={v} />
                    ) : (
                      <ScrollArea>
                          {typeof parsedData === typeof v ? v : parsedData}
            
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    )}
                  </TableCell>
                </TableRow>
              )
          }
        )}
      </TableBody>
    </Table>
  );
}

export default DataTable;
