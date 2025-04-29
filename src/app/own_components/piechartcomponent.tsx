"use client"

import * as React from "react"
import supabase from "@/lib/supabase"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function Component() {
  const [chartData, setChartData] = React.useState<
    { device_type: string; visitors: number; fill: string }[]
  >([])

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [chartData])

  React.useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("wlan_tracking_log")
        .select("device_type")

      if (error) {
        console.error("Fehler beim Laden:", error)
        return
      }

      // Gruppieren nach device_type
      const counts: Record<string, number> = {}
      for (const row of data) {
        const type = row.device_type || "Unknown"
        counts[type] = (counts[type] || 0) + 1
      }

      // Farben dynamisch zuweisen
      const coloredData = Object.entries(counts).map(([device_type, visitors]) => ({
        device_type,
        visitors,
        fill: getColor(device_type), // Dynamische Zuweisung der Farbe
      }))

      setChartData(coloredData)
    }

    fetchData()
  }, [])

  // Farben für jedes Gerät mit Tailwind CSS definieren
  const colorMap: Record<string, string> = {
    "Mobile": "#34D399", // Grün für Mobile
    "Desktop": "#3B82F6", // Blau für Desktop
    "Unknown": "#9CA3AF", // Grau für unbekannte Geräte
  }

  // Dynamische Farbe für ein Gerät holen
  const getColor = (device_type: string) => {
    return colorMap[device_type] || colorMap["Unknown"] // Standardfarbe für unbekannte Geräte
  }

  const chartConfig: ChartConfig = {
    visitors: { label: "Visitors" },
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Geräte nach Typ</CardTitle>
        <CardDescription>Live aus wlan_tracking_log</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="w-full flex justify-center">
          <ChartContainer
            config={chartConfig}
            className="w-full max-w-[600px] sm:max-w-[800px] md:max-w-[1000px] h-[200px] sm:h-[200px] md:h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="device_type"
                innerRadius={60}
                strokeWidth={5}
                paddingAngle={5}
                isAnimationActive={false} // Animation deaktivieren (optional)
              >
                {/* Die `Cell`-Komponenten müssen hier sicherstellen, dass die Farbe für jedes Segment gesetzt wird */}
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.fill} // Setze die `fill`-Farbe für jedes Segment
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Geräte
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Daten in Echtzeit <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Zeigt Häufigkeit von Gerätetypen
        </div>
      </CardFooter>
    </Card>
  )
}
