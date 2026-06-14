import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulamos un retraso de procesamiento para extraer logs de una base de datos segura (Firestore)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const auditLogs = [
      {
        id: 'LOG_98412',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        type: 'PAYMENT_FAILURE',
        severity: 'warning',
        message: 'Fallo de cobro detectado. Tarjeta declinada (Fondos Insuficientes).',
        details: {
          clientName: 'Agencia XYZ',
          affiliateId: 'AF_001_MARKETER',
          action: 'Inicio del período de gracia (72 horas).'
        },
        ip: '192.168.1.145',
        hash: 'b1f4a9c8d2...'
      },
      {
        id: 'LOG_98411',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 73).toISOString(), // Hace 73 horas
        type: 'COMMISSION_SUSPENDED',
        severity: 'critical',
        message: 'Período de gracia expirado (>72h). Cliente no actualizó pago.',
        details: {
          clientName: 'Restaurante Alpha',
          affiliateId: 'AF_001_MARKETER',
          action: 'Penalidad aplicada: Comisión suspendida por 12 meses.'
        },
        ip: '10.0.0.4',
        hash: 'c8d2b1f4a9...'
      },
      {
        id: 'LOG_98410',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        type: 'AFFILIATE_WARNING',
        severity: 'warning',
        message: 'Detección de tráfico anómalo (Posible SPAM).',
        details: {
          affiliateId: 'AF_089_UNKNOWN',
          action: 'Cuenta en observación. Bloqueo temporal de retiros.'
        },
        ip: '45.22.19.10',
        hash: 'a9c8d2b1f4...'
      },
      {
        id: 'LOG_98409',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        type: 'SYSTEM_AUDIT',
        severity: 'info',
        message: 'Escaneo de vulnerabilidades completado.',
        details: {
          action: 'No se encontraron brechas. CSP Headers activos.'
        },
        ip: '127.0.0.1',
        hash: 'f4a9c8d2b1...'
      }
    ];

    return NextResponse.json({ success: true, logs: auditLogs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve audit logs' },
      { status: 500 }
    );
  }
}
