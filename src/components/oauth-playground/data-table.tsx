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
        <h4 className={`text-sm font-semibold ${elements.length ? '' : 'text-gray-400'} pr-4`}>
          {elements.length} elements
        </h4>
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

function generateColor(index: number): string {
  const goldenAngle = 137.508;
  const hue = (index * goldenAngle) % 360;
  const saturation = 50;
  const lightness = 30;

  // HSL to RGB conversion
  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (hue < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (hue < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (hue < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (hue < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function buildUniqueColorMap(flattenedKeys: string[]): Map<string, string> {
  const colorMap = new Map();

  flattenedKeys.forEach((key, idx) => {
    const segments = key.split('.');

    for (let i = 0; i < segments.length; i++) {
      const p = segments.slice(0, i + 1).join('.');

      if (!colorMap.has(p)) colorMap.set(p, generateColor(idx + 1 + (i + 1)));
    }
  });

  return colorMap;
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
  const flat: {
    [key: string]: unknown;
  } = flatten(JSON.parse(JSON.stringify(data)), { safe: true });

  const colorMap = buildUniqueColorMap(Object.keys(flat));

  return (
    <Table className="border bg-white">
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
        {Object.entries(flat).map(([k, v], i) => {
          return (
            <TableRow>
              <TableCell className="border-r p-2 font-mono text-sm bg-gray-100">
                {(() => {
                  const segments = k.split('.');

                  return segments.map((s, i) => {
                    return (
                      <>
                        <span
                          style={{
                            color: colorMap.get(segments.slice(0, i + 1).join('.')),
                          }}
                        >
                          {s}
                        </span>
                        <span>{i < segments.length - 1 ? '.' : ''}</span>
                      </>
                    );
                  });
                })()}
              </TableCell>
              <TableCell className={i % 2 ? altBg : ''}>{getComponentForType(v)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default DataTable;
