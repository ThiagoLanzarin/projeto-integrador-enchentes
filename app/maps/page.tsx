"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, MapPin, Radio, ShieldCheck, ShieldAlert } from "lucide-react";
import { useState } from "react";

// Definição da estrutura de dados para os sensores
interface SensorData {
  id: number;
  name: string;
  environment: "Teste" | "Produção";
  locationName: string;
  address: string;
  status: string;
  statusColor: string;
  mapUrl: string;
  coordinates: string;
  description: string;
}

export default function MapsPage() {
  // Lista com os dois sensores (Unidade 1 - UNIMATER e Unidade 2 - Produção)
  const sensors: SensorData[] = [
    {
      id: 1,
      name: "Sensor Unidade 01",
      environment: "Teste",
      locationName: "UNIMATER - Centro Universitário Mater Dei",
      address: "R. Mato Grosso, 200 - Centro, Pato Branco - PR, 85501-200, Brasil",
      status: "Online (Hotspot Laboratório)",
      statusColor: "text-emerald-600 bg-emerald-500",
      mapUrl: "https://maps.google.com/maps?q=UNIMATER%20Centro%20Universit%C3%A1rio%20Mater%20Dei,%20Pato%20Branco&t=&z=16&ie=UTF8&iwloc=&output=embed",
      coordinates: "-26.2295, -52.6712",
      description: "Ponto geográfico configurado na central acadêmica para simulações e validação do Flood Monitor."
    },
    {
      id: 2,
      name: "Sensor Unidade 02",
      environment: "Produção",
      locationName: "Área de Risco Coleta Central",
      address: "R. Lupicínio Rodrigues, 259 - Pato Branco - PR",
      status: "Aguardando Hardware",
      statusColor: "text-amber-600 bg-amber-500",
      // URL ajustada com as coordenadas exatas fornecidas para centralizar no ponto correto
      mapUrl: "https://maps.google.com/maps?q=-26.2415833,-52.6814479&z=16&output=embed",
      coordinates: "-26.2415833, -52.6814479",
      description: "Ponto planejado para monitoramento em campo na bacia de escoamento. Pronto para receber a estrutura física final."
    }
  ];

  // Estado para armazenar qual sensor está ativo/selecionado na tela
  const [selectedSensor, setSelectedSensor] = useState<SensorData>(sensors[0]);

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      {/* Barra Lateral fixa */}
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Cabeçalho dinâmico */}
        <Header />

        {/* Área de Conteúdo Principal */}
        <main className="flex-1 space-y-6 p-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Geolocalização do Sistema</h1>
            <p className="text-sm text-slate-500">Selecione uma estação para inspecionar os detalhes e o mapa em tempo real.</p>
          </div>

          {/* BARRA SUPERIOR DE CARDS: Seleção do Sensor */}
          <div className="grid gap-4 sm:grid-cols-2">
            {sensors.map((sensor) => {
              const isSelected = selectedSensor.id === sensor.id;
              return (
                <div
                  key={sensor.id}
                  onClick={() => setSelectedSensor(sensor)}
                  className={`group relative flex flex-col justify-between p-5 rounded-xl border bg-white shadow-sm cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 bg-sky-50/10"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-lg">{sensor.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          sensor.environment === "Produção" 
                            ? "bg-amber-100 text-amber-800" 
                            : "bg-sky-100 text-sky-800"
                        }`}>
                          {sensor.environment}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-1">{sensor.locationName}</p>
                    </div>
                    <div className={`p-2.5 rounded-lg border transition-colors ${
                      isSelected ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"
                    }`}>
                      <Radio className={`h-5 w-5 ${isSelected && "animate-pulse"}`} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                    <span className={`h-2 w-2 rounded-full ${sensor.statusColor.split(' ')[1]}`} />
                    <span className="text-xs font-semibold text-slate-600">{sensor.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* GRID INFERIOR: Detalhes e Mapa do Sensor Selecionado */}
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Card Lateral Dinâmico de Detalhes do Hardware */}
            <Card className="md:col-span-1 border-slate-200/80 shadow-sm bg-white flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-1">
                  <Info className="h-4 w-4" />
                  Detalhes do Hardware
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">{selectedSensor.name}</CardTitle>
                <CardDescription className="text-slate-500">
                  Especificações de localização do NodeMCU ({selectedSensor.environment}).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="border-t border-slate-100 pt-3">
                  <span className="font-semibold text-slate-700 block">Instituição / Local:</span>
                  <span className="text-slate-600">{selectedSensor.locationName}</span>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="font-semibold text-slate-700 block">Endereço:</span>
                  <span className="text-slate-500">{selectedSensor.address}</span>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="font-semibold text-slate-700 block">Coordenadas Geográficas:</span>
                  <span className="text-slate-500 font-mono">{selectedSensor.coordinates}</span>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <span className="font-semibold text-slate-700 block">Status de Conexão:</span>
                  <span className={`inline-flex items-center gap-1.5 font-medium ${selectedSensor.statusColor.split(' ')[0]}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${selectedSensor.statusColor.split(' ')[1]}`} />
                    {selectedSensor.status}
                  </span>
                </div>
                <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl text-xs text-sky-800 leading-relaxed">
                  {selectedSensor.description}
                </div>
              </CardContent>
            </Card>

            {/* Card Dinâmico do Mapa Geográfico */}
            <Card className="md:col-span-2 border-slate-200/80 shadow-sm bg-white overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  Visualização em Tempo Real — {selectedSensor.name}
                </div>
              </CardHeader>
              <CardContent className="p-0 border-t border-slate-100 h-[480px] w-full relative">
                {/* O iframe se atualiza na marra de acordo com o sensor selecionado */}
                <iframe
                  key={selectedSensor.id} // Força o iframe a recarregar o mapa imediatamente ao trocar o card
                  title={selectedSensor.name}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  src={selectedSensor.mapUrl}
                  loading="lazy"
                ></iframe>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}