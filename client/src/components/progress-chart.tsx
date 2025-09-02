import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ProgressChartProps {
  data: Array<{
    date: string;
    weight?: number;
    reps?: number;
    volume?: number;
    calories?: number;
  }>;
  type: 'weight' | 'reps' | 'volume' | 'calories';
  title: string;
  color?: string;
  testId: string;
}

export default function ProgressChart({ data, type, title, color = "#D4AF37", testId }: ProgressChartProps) {
  const formatValue = (value: number) => {
    switch (type) {
      case 'weight':
        return `${value}kg`;
      case 'reps':
        return `${value} reps`;
      case 'volume':
        return `${value}kg`;
      case 'calories':
        return `${value} cal`;
      default:
        return value.toString();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nl-NL', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{formatDate(label)}</p>
          <p className="text-accent">
            {title}: {formatValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground" data-testid={`chart-empty-${testId}`}>
        <div className="text-center">
          <i className="fas fa-chart-line text-4xl mb-2"></i>
          <p>Geen data beschikbaar</p>
        </div>
      </div>
    );
  }

  if (type === 'calories') {
    return (
      <div className="h-64" data-testid={`chart-${testId}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="hsl(45, 5%, 65%)"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(45, 5%, 65%)"
              fontSize={12}
              tickFormatter={(value) => formatValue(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={type} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-64" data-testid={`chart-${testId}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke="hsl(45, 5%, 65%)"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(45, 5%, 65%)"
            fontSize={12}
            tickFormatter={(value) => formatValue(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey={type} 
            stroke={color} 
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
