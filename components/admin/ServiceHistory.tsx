'use client';
// Required: Uses Zustand store

import { History, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useQueueStore, selectHistory } from '@/lib/store/queueStore';
import { filterHistory, exportHistoryToCsv } from '@/lib/queue/filterHistory';
import { formatTime } from '@/lib/utils/formatDate';
import type { TicketReason } from '@/lib/types';

interface ServiceHistoryProps {
  labels: {
    title: string;
    empty: string;
    exportCsv: string;
    columns: {
      number: string;
      name: string;
      reason: string;
      joinedAt: string;
      servedAt: string;
    };
    anonymous: string;
    reasons: Record<TicketReason, string>;
  };
  locale: string;
}

export function ServiceHistory({ labels, locale }: ServiceHistoryProps) {
  const history = useQueueStore(selectHistory);
  const filteredHistory = filterHistory(history);

  const handleExport = () => {
    const csv = exportHistoryToCsv(filteredHistory);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colacero-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5" />
          {labels.title}
        </CardTitle>
        {filteredHistory.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            {labels.exportCsv}
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">{labels.empty}</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">{labels.columns.number}</TableHead>
                  <TableHead>{labels.columns.name}</TableHead>
                  <TableHead className="hidden md:table-cell">{labels.columns.reason}</TableHead>
                  <TableHead className="hidden md:table-cell">{labels.columns.joinedAt}</TableHead>
                  <TableHead>{labels.columns.servedAt}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono font-medium">
                      {ticket.number.toString().padStart(2, '0')}
                    </TableCell>
                    <TableCell>{ticket.name || labels.anonymous}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {ticket.reason ? labels.reasons[ticket.reason] : '-'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatTime(ticket.joinedAt, locale)}
                    </TableCell>
                    <TableCell>
                      {ticket.servedAt ? formatTime(ticket.servedAt, locale) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
