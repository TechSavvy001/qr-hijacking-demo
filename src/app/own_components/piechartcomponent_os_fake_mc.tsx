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
    { os: string; visitors: number; fill: string }[]
  >([])

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [chartData])

  React.useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("tracking_log")
        .select("os")

      if (error) {
        console.error("Fehler beim Laden:", error)
        return
      }

      if (!data || data.length === 0) {
        console.warn("Keine osdaten gefunden.")
        return
      }

      // Gruppieren nach os
      const counts: Record<string, number> = {}
      for (const row of data as { os: string | null }[]) {
        const os = row.os?.trim() || "Unknown"
        counts[os] = (counts[os] || 0) + 1
      }

      // Farben dynamisch zuweisen
      const coloredData = Object.entries(counts).map(([os, visitors]) => ({
        os,
        visitors,
        fill: getColor(os),
      }))

      setChartData(coloredData)
    }

    fetchData()
  }, [])

  // Farben für bekannte os
  const colorMap: Record<string, string> = {
    "macOS": "#34D399",   // grün
    "Windows": "#3B82F6",   // blau
    "Linux": "#F97316",  // orange
    "Unknown": "#9CA3AF",  // grau
  }

  const getColor = (os: string) => {
    return colorMap[os] || colorMap["Unknown"]
  }

  const chartConfig: ChartConfig = {
    visitors: { label: "Visitors" },
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Betriebssystem</CardTitle>
        <CardDescription>Live aus tracking_log</CardDescription>
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
                nameKey="os"
                innerRadius={60}
                strokeWidth={5}
                paddingAngle={5}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
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
                            gesamt
                          </tspan>
                        </text>
                      )
                    }
                    return null
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
          Zeigt Häufigkeit von Betriebssystemen
        </div>
      </CardFooter>
    </Card>
  )
}
