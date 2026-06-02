"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ChartContainer, ChartTooltip } from "../components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import { AlertTriangle, CheckCircle2, Activity, Calendar } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

interface Pulse {
  sensor: boolean;
  receivedAt: number;
  humanTime: string;
}

interface ApiResponse {
  message: string;
  pulses: Pulse[];
}

export function MainContent() {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [isFloodDanger, setIsFloodDanger] = useState(false);
  const [lastPulseTime, setLastPulseTime] = useState<Date | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/pulse");
      if (!res.ok) {
        throw new Error(`Falha ao buscar dados da API: ${res.statusText}`);
      }

      const data: ApiResponse = await res.json();
      setPulses(data.pulses);

      if (data.pulses.length > 0) {
        const mostRecentPulse = new Date(data.pulses[0].humanTime);
        setLastPulseTime(mostRecentPulse);

        const now = new Date();
        const diffInMinutes =
          (now.getTime() - mostRecentPulse.getTime()) / (1000 * 60);

        setIsFloodDanger(diffInMinutes <= 60);
      } else {
        setLastPulseTime(null);
        setIsFloodDanger(false);
      }

      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Um erro desconhecido ocorreu"
      );
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const chartData = (() => {
    const today = new Date();
    const fullDayData: Array<{
      time: string;
      hour: number;
      occurrences: number;
      hasData: boolean;
    }> = [];

    for (let hour = 0; hour < 24; hour++) {
      const timePoint = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hour,
        0,
        0
      );

      fullDayData.push({
        time: timePoint.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        hour: hour,
        occurrences: 0,
        hasData: false,
      });
    }

    pulses.forEach((pulse) => {
      const date = new Date(pulse.humanTime);
      const brtDate = new Date(
        date.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
      );

      const hour = brtDate.getHours();
      const dayMatch =
        brtDate.getDate() === today.getDate() &&
        brtDate.getMonth() === today.getMonth() &&
        brtDate.getFullYear() === today.getFullYear();

      if (dayMatch && hour >= 0 && hour < 24) {
        fullDayData[hour].occurrences += 1;
        fullDayData[hour].hasData = true;
      }
    });

    return fullDayData;
  })();

  const totalOccurrences = chartData.reduce(
    (acc, curr) => acc + curr.occurrences,
    0
  );

  if (isInitialLoading) {
    return (
      <div className="flex-1 space-y-6 p-8 bg-slate-50/50 min-h-screen">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-slate-200/80 shadow-sm">
              <CardHeader>
                <Skeleton className="h-4 w-2/5" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/5" />
                <Skeleton className="h-3 w-3/5 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="col-span-full border-slate-200/80 shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardHeader>
          <CardContent className="pt-4">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-8 bg-slate-50/50">
        <Card className="w-full max-w-md border-rose-200 bg-rose-50/50 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <AlertTriangle className="h-6 w-6 text-rose-600" />
            <CardTitle className="text-rose-900 font-bold">
              Erro ao Carregar Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-rose-700 text-sm">
              Não foi possível buscar os dados da API de monitoramento.
            </p>
            <code className="mt-3 block rounded bg-rose-100/80 p-2.5 text-xs font-mono text-rose-900 border border-rose-200 break-all">
              {error}
            </code>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pulses.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-8 bg-slate-50/50">
        <Card className="w-full max-w-md border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <Activity className="h-6 w-6 text-slate-400" />
            <CardTitle className="text-slate-900">Nenhum Pulso Registrado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-slate-600">
              Ainda não recebemos nenhuma leitura do sensor físico. Aguardando dados na bancada...
            </p>
            <p className="text-xs text-slate-400">
              Verificando automaticamente a cada 5 segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 bg-slate-50/50 min-h-screen">
      {/* Cards de Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Card 1: Total de Ocorrências */}
        <Card className="border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Estado do Sensor
            </CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalOccurrences}</div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Pulsos registrados hoje
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Status Dinâmico de Alerta */}
        <Card 
          className={`border shadow-sm transition-colors duration-300 ${
            isFloodDanger 
              ? "bg-rose-50/50 border-rose-200" 
              : "bg-emerald-50/50 border-emerald-200"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-semibold ${isFloodDanger ? "text-rose-900" : "text-emerald-900"}`}>
              Alerta de Enchente
            </CardTitle>
            {isFloodDanger ? (
              <AlertTriangle className="h-4 w-4 text-rose-600 animate-pulse" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-extrabold ${isFloodDanger ? "text-rose-600" : "text-emerald-600"}`}>
              {isFloodDanger ? "Perigo" : "Seguro"}
            </div>
            <p className={`text-xs font-medium mt-0.5 ${isFloodDanger ? "text-rose-700" : "text-emerald-700"}`}>
              {lastPulseTime
                ? `Último contato: ${lastPulseTime.toLocaleTimeString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}`
                : "Nenhum dado recebido"}
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Horário da Última Atualização */}
        <Card className="border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Última Atualização
            </CardTitle>
            <Calendar className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {lastPulseTime
                ? lastPulseTime.toLocaleTimeString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--:--"}
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              {lastPulseTime 
                ? lastPulseTime.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })
                : "Aguardando sincronização"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção do Gráfico */}
      <Card className="w-full border-slate-200/80 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Ocorrências ao Longo do Dia</CardTitle>
          <CardDescription className="text-slate-500">
            Histórico de pulsos do sensor agrupados por hora (00:00 às 23:59 de hoje)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <ChartContainer
            config={{
              occurrences: {
                label: "Ocorrências",
                color: "#e11d48",
              },
            }}
            className="h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barCategoryGap="15%"
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100" vertical={false} />
                <XAxis
                  dataKey="time"
                  className="text-[11px] font-medium"
                  tick={{ fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  className="text-[11px] font-medium"
                  tick={{ fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-md">
                          <div className="grid gap-2">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Horário de Bloqueio
                              </span>
                              <span className="font-semibold text-slate-800">
                                {data.time}h
                              </span>
                            </div>
                            <div className="flex flex-col border-t border-slate-50 pt-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Volume Lido
                              </span>
                              <span className="font-bold text-rose-600">
                                {data.occurrences}{" "}
                                {data.occurrences === 1 ? "pulso" : "pulsos"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="occurrences"
                  fill="#e11d48"
                  radius={[5, 5, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}