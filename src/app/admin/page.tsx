'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

interface LogData {
  [key: string]: any;
}

export default function AdminPage() {
  const [logs, setLogs] = useState<Record<string, LogData[]>>({});

  useEffect(() => {
    async function fetchLogs() {
      const res = await fetch('/api/admin/get-logs');
      const data = await res.json();
      setLogs(data);
    }
    fetchLogs();
  }, []);

  if (!logs || Object.keys(logs).length === 0) {
    return <div>Lädt...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Logs</h1>

      <Tabs defaultValue="fingerprint" className="w-full">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="fingerprint">Fingerprint</TabsTrigger>
          <TabsTrigger value="mouse">Mausbewegung</TabsTrigger>
          <TabsTrigger value="scrolls">Scrolls</TabsTrigger>
          <TabsTrigger value="inputs">Eingaben</TabsTrigger>
          <TabsTrigger value="blurs">Blur</TabsTrigger>
          <TabsTrigger value="leaves">Verlassen</TabsTrigger>
          <TabsTrigger value="clicks">Klicks</TabsTrigger>
          <TabsTrigger value="fakeInputs">Fake Inputs</TabsTrigger>
          <TabsTrigger value="emailQuality">E-Mail Qualität</TabsTrigger>
          <TabsTrigger value="decisionSpeed">Entscheidungsgeschwindigkeit</TabsTrigger>
          <TabsTrigger value="clickToSubmit">Klicks bis Absenden</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="sessionTimes">Sitzungszeiten</TabsTrigger>
        </TabsList>

        {/* Inhalte */}
        <TabsContent value="fingerprint"><LogTable data={logs.fingerprint} /></TabsContent>
        <TabsContent value="mouse"><LogTable data={logs.mouse} /></TabsContent>
        <TabsContent value="scrolls"><LogTable data={logs.scrolls} /></TabsContent>
        <TabsContent value="inputs"><LogTable data={logs.inputs} /></TabsContent>
        <TabsContent value="blurs"><LogTable data={logs.blurs} /></TabsContent>
        <TabsContent value="leaves"><LogTable data={logs.leaves} /></TabsContent>
        <TabsContent value="clicks"><LogTable data={logs.clicks} /></TabsContent>
        <TabsContent value="fakeInputs"><LogTable data={logs.fakeInputs} /></TabsContent>
        <TabsContent value="emailQuality"><LogTable data={logs.emailQuality} /></TabsContent>
        <TabsContent value="decisionSpeed"><LogTable data={logs.decisionSpeed} /></TabsContent>
        <TabsContent value="clickToSubmit"><LogTable data={logs.clickToSubmit} /></TabsContent>
        <TabsContent value="navigation"><LogTable data={logs.navigation} /></TabsContent>
        <TabsContent value="sessionTimes"><LogTable data={logs.sessionTimes} /></TabsContent>
      </Tabs>
    </div>
  );
}

function LogTable({ data }: { data: LogData[] }) {
  if (!data || data.length === 0) return <div>Keine Daten</div>;

  const columns = Object.keys(data[0]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableCell key={col} className="font-bold">{col}</TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx}>
            {columns.map((col) => (
              <TableCell key={col}>{String(row[col])}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
