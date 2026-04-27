export type InsightLevel = 'critical' | 'warning' | 'ok';

export type Domain = 'infra' | 'app' | 'db' | 'growth';

export type Metric = {
  label: string;
  value: number;
  unit?: string;
  threshold: number;
  direction: 'high' | 'low';
};

export type DomainConfig = {
  id: Domain;
  title: string;
  audience: string;
  description: string;
  metrics: Metric[];
};

export type Insight = {
  level: InsightLevel;
  title: string;
  detail: string;
  action: string;
};

type Snapshot = {
  generatedAt: string;
  domains: DomainConfig[];
};

const baseDomains: DomainConfig[] = [
  {
    id: 'infra',
    title: 'Серверы и инфраструктура',
    audience: 'DevOps / SRE',
    description: 'Нагрузка, доступность и стабильность production-контуров с единым алертингом.',
    metrics: [
      { label: 'CPU', value: 78, unit: '%', threshold: 80, direction: 'high' },
      { label: 'RAM', value: 69, unit: '%', threshold: 85, direction: 'high' },
      { label: 'Uptime', value: 99.92, unit: '%', threshold: 99.9, direction: 'low' },
      { label: 'Ошибки 5xx', value: 0.9, unit: '%', threshold: 1.2, direction: 'high' },
    ],
  },
  {
    id: 'app',
    title: 'ПО, модули и тестирование',
    audience: 'Backend / QA / Tech Lead',
    description: 'Контроль релизов, ошибок и регрессий на уровне модулей и сборок.',
    metrics: [
      { label: 'Покрытие тестами', value: 72, unit: '%', threshold: 75, direction: 'low' },
      { label: 'Падения тестов', value: 4, unit: '', threshold: 3, direction: 'high' },
      { label: 'Баги high', value: 3, unit: '', threshold: 2, direction: 'high' },
      { label: 'Время релиза', value: 31, unit: 'мин', threshold: 35, direction: 'high' },
    ],
  },
  {
    id: 'db',
    title: 'Базы данных',
    audience: 'DBA / Backend',
    description: 'Контроль производительности запросов, реплик и нагрузки на хранилище.',
    metrics: [
      { label: 'P95 запросов', value: 230, unit: 'мс', threshold: 250, direction: 'high' },
      { label: 'Медленные запросы', value: 9, unit: '', threshold: 10, direction: 'high' },
      { label: 'Lag реплики', value: 1.9, unit: 'с', threshold: 1.5, direction: 'high' },
      { label: 'Storage', value: 71, unit: '%', threshold: 80, direction: 'high' },
    ],
  },
  {
    id: 'growth',
    title: 'Сайты, реклама и воронки',
    audience: 'Marketing / Growth',
    description: 'Конверсии, CPL, ROI, поведение трафика и результат рекламных источников.',
    metrics: [
      { label: 'CR лендинга', value: 2.9, unit: '%', threshold: 3.2, direction: 'low' },
      { label: 'CPL', value: 1460, unit: '₽', threshold: 1300, direction: 'high' },
      { label: 'ROI', value: 21, unit: '%', threshold: 25, direction: 'low' },
      { label: 'Отказы', value: 47, unit: '%', threshold: 45, direction: 'high' },
    ],
  },
];

const withNoise = (metric: Metric): Metric => {
  const amplitude = Math.max(Math.abs(metric.value * 0.08), 0.5);
  const delta = (Math.random() * amplitude * 2 - amplitude) * 0.6;
  const nextValue = Number(Math.max(0.1, metric.value + delta).toFixed(metric.unit === '%' ? 2 : 1));
  return { ...metric, value: nextValue };
};

export const getMetricStatus = (metric: Metric): InsightLevel => {
  const ratio =
    metric.direction === 'high'
      ? metric.value / metric.threshold
      : metric.threshold / Math.max(metric.value, 0.001);

  if (ratio > 1.2) {
    return 'critical';
  }
  if (ratio > 1) {
    return 'warning';
  }
  return 'ok';
};

export const getDomainConfigs = (): DomainConfig[] => baseDomains;

export const loadWaypointSnapshot = async (): Promise<Snapshot> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        generatedAt: new Date().toLocaleString('ru-RU'),
        domains: baseDomains.map((domain) => ({
          ...domain,
          metrics: domain.metrics.map(withNoise),
        })),
      });
    }, 450);
  });
