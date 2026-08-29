export const SIMULATED_APIS = [
  {
    id: 'API-BHULEKH',
    name: 'National Bhulekh / UP RoR Land Records Gateway',
    endpoint: 'https://api.bhulekh.up.gov.in/v3/khasra/ror-extract',
    type: 'REST / JSON',
    status: 'Connected (Simulated)',
    latency: '34ms',
    uptime: '99.98%',
    lastSync: 'Just now',
    icon: 'Database',
    description: 'Simulated bridge to National Land Record Modernization Programme (NLRMP) for live Khatauni & ownership mutations.'
  },
  {
    id: 'API-GIS',
    name: 'Survey of India / Bhuvan ISRO WMS/WFS Cadastral GIS',
    endpoint: 'https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wms',
    type: 'OGC WFS / GeoJSON',
    status: 'Connected (Simulated)',
    latency: '82ms',
    uptime: '99.95%',
    lastSync: '2 mins ago',
    icon: 'Map',
    description: 'Simulated high-resolution satellite imagery tiles & vector cadastral parcel boundary service.'
  },
  {
    id: 'API-OCR',
    name: 'BhoomiSetu AI Document Extraction & OCR Service',
    endpoint: 'https://ai-ocr.bhoomisetu.gov.in/api/v1/extract-entities',
    type: 'Neural OCR / Vision',
    status: 'Connected (Simulated)',
    latency: '142ms',
    uptime: '99.90%',
    lastSync: 'Live',
    icon: 'FileSearch',
    description: 'Simulated Deep Learning OCR for Hindi & English registered deed analysis, seal verification, and area parsing.'
  },
  {
    id: 'API-AI-LLM',
    name: 'BhoomiSetu Decision Support & Mismatch Engine',
    endpoint: 'https://ai-core.bhoomisetu.gov.in/api/v2/analyze-corridor',
    type: 'AI Decision Engine',
    status: 'Connected (Simulated)',
    latency: '68ms',
    uptime: '100.0%',
    lastSync: 'Live',
    icon: 'Sparkles',
    description: 'Simulated legal & spatial mismatch scoring engine. (Advisory only — strictly no binding legal power).'
  },
  {
    id: 'API-PFMS',
    name: 'Public Financial Management System (PFMS / e-Kuber DBT)',
    endpoint: 'https://pfms.nic.in/api/dbt/direct-disbursement-v4',
    type: 'NPCI / RBI Gateway',
    status: 'Connected (Simulated)',
    latency: '110ms',
    uptime: '99.99%',
    lastSync: '10 mins ago',
    icon: 'CreditCard',
    description: 'Simulated direct benefit compensation transfer escrow, Aadhaar Payment Bridge (APB), and NACH validation.'
  },
  {
    id: 'API-NOTIFY',
    name: 'National Government SMS Gateway & Digilocker Push',
    endpoint: 'https://mgov.gov.in/api/sms-push/v2',
    type: 'Gov SMS / Push',
    status: 'Connected (Simulated)',
    latency: '22ms',
    uptime: '99.99%',
    lastSync: 'Live',
    icon: 'BellRing',
    description: 'Simulated multi-lingual SMS notifications and WhatsApp updates sent directly to affected land owners.'
  }
];
