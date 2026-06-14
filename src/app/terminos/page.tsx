import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors mb-12">
          <ArrowLeft size={16} />
          <span>Volver al inicio</span>
        </Link>
        
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Términos de Servicio y Condiciones Operativas</h1>
        <p className="text-zinc-500 mb-10">Última actualización: 14 de Junio de 2026</p>

        <div className="space-y-10 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">1. Naturaleza del Servicio y Condiciones Estructurales</h2>
            <div className="space-y-4">
              <p><strong>Conducto Pasivo:</strong> Altus es exclusivamente una herramienta tecnológica de enrutamiento y gestión ("Software as a Service"). No proveemos servicios editoriales, de marketing, ni moderamos el contenido generado por los usuarios. Eres el único responsable del material publicado a través de nuestra plataforma.</p>
              <p><strong>No Terceros Beneficiarios:</strong> Este acuerdo es estrictamente entre tu agencia (el Usuario) y Altus. Las marcas o clientes finales que gestiones a través de nuestro software no tienen relación contractual con Altus y carecen de derecho para iniciar reclamos directos contra nosotros.</p>
              <p><strong>SLA y Remedio Exclusivo:</strong> En caso de caídas del servidor o interrupciones prolongadas del sistema, la única compensación disponible será mediante créditos de servicio proporcionales al tiempo de inactividad. Quedan bloqueadas las demandas por pérdidas económicas derivadas de interrupciones técnicas.</p>
              <p><strong>Servicios de Terceros:</strong> Altus depende de APIs de terceros (Meta, Google, X). Nos eximimos de toda responsabilidad o reembolso si estas plataformas cambian sus políticas, cobran por acceso a sus APIs, o eliminan funcionalidades abruptamente, afectando el servicio de Altus.</p>
              <p><strong>Supresión Inmediata de Cuentas:</strong> Nos reservamos el derecho unilateral de suspender o cancelar el acceso a la plataforma de forma inmediata y sin previo aviso ante riesgos de ciberseguridad, impago o violación manifiesta de estas políticas.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">2. Políticas de Uso Aceptable (AUP)</h2>
            <div className="space-y-4">
              <p><strong>Prohibiciones de Contenido:</strong> Queda estrictamente prohibido utilizar Altus para distribuir material difamatorio, ilegal, spam o que infrinja los derechos de propiedad intelectual. Actuaremos ante notificaciones de retiro tipo DMCA.</p>
              <p><strong>Restricciones de Vigilancia y Perfilado:</strong> Está terminantemente prohibido utilizar nuestra plataforma y/o los datos extraídos para labores policiales, espionaje corporativo o gubernamental, o para perfilar usuarios basándose en datos sensibles (raza, religión, afiliación política o sindical).</p>
              <p><strong>Restricción de Modelos de IA:</strong> Se prohíbe expresamente el uso de informes analíticos o datos extraídos de redes sociales mediante Altus para alimentar o entrenar Modelos de Lenguaje Grande (LLMs) o sistemas de IA de terceros sin autorización explícita.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">3. Limitación de Responsabilidad e Indemnización</h2>
            <div className="space-y-4">
              <p><strong>Exclusión de Daños Consecuentes:</strong> Renuncias absolutamente a exigir compensaciones financieras a Altus por lucro cesante, pérdida de ganancias, daño reputacional o negocios caídos que surjan directa o indirectamente del uso o fallo de la aplicación.</p>
              <p><strong>Tope de Responsabilidad Financiera (Liability Cap):</strong> En el caso extremo de una condena judicial, la responsabilidad máxima agregada de Altus estará limitada exclusivamente al monto total que el cliente haya pagado por la suscripción al software en los últimos doce (12) meses anteriores al evento que origina el reclamo.</p>
              <p><strong>Indemnización:</strong> El cliente acepta indemnizar, defender y mantener indemne a Altus (y pagar los honorarios legales correspondientes) ante cualquier demanda de terceros originada por negligencia del cliente o por el contenido publicado desde su cuenta.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">4. Ciberseguridad y Brechas de Datos</h2>
            <div className="space-y-4">
              <p><strong>Definición de Responsabilidad:</strong> Altus emplea estándares de cifrado y seguridad de grado industrial. Quedamos exentos de responsabilidad ante ataques de día cero ("Zero-Day"), "hackeos sofisticados" o vulnerabilidades originadas en la infraestructura en la nube de terceros (Google Cloud, AWS).</p>
              <p><strong>Limitación del Custodio (Ley 53-07):</strong> En cumplimiento con normativas locales e internacionales de alta tecnología, Altus está eximido de responsabilidad penal o civil por pérdida de datos si el acceso no autorizado ocurre por técnicas de ingeniería social aplicadas a los empleados de la agencia cliente, o una vez que los datos son transmitidos a servidores de terceros (ej. Meta).</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">5. Cumplimiento Normativo con Plataformas (Meta, Google)</h2>
            <div className="space-y-4">
              <p>El cliente se somete contractualmente a los Términos de Plataforma y Estándares Comunitarios de Meta, Google, X y TikTok. Todo acceso debe realizarse a través del flujo oficial de "Tokens" (OAuth 2.0). Está prohibido recolectar o solicitar contraseñas directas a clientes finales. El cliente cooperará en un plazo máximo de 24 horas ante cualquier auditoría (Data Use Checkup) solicitada por dichas plataformas.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">6. Resolución de Conflictos</h2>
            <div className="space-y-4">
              <p><strong>Arbitraje Comercial Obligatorio:</strong> Cualquier controversia o reclamo se resolverá mediante un tribunal de arbitraje privado (conforme a la Ley 489-08 o la jurisdicción aplicable), garantizando confidencialidad y decisiones técnicas especializadas. Se excluye el uso de tribunales ordinarios.</p>
              <p><strong>Renuncia a Demandas Colectivas:</strong> Aceptas que cualquier procedimiento se llevará a cabo de forma individual (Class Action Waiver). Renuncias expresamente a tu derecho de participar en demandas colectivas, masivas o en representación de otros contra Altus.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">7. Programa de Afiliados (Referidos) y Oportunidad de Sociedad</h2>
            <div className="space-y-4">
              <p>Altus ofrece un exclusivo "Club de Afiliados" con comisiones recurrentes. Para mantener el estatus de afiliado activo y seguir recibiendo comisiones, no basta con compartir el enlace único de ventas; <strong>el afiliado está obligado a enviar al menos una (1) idea válida de mejora o innovación para la plataforma cada seis (6) meses</strong> a través de nuestros canales oficiales.</p>
              
              <p><strong>Oportunidad de Sociedad:</strong> Los afiliados que mantengan un rendimiento excepcional y cumplan con la aportación de ideas de valor de forma ininterrumpida durante un período de tres (3) años, tendrán la oportunidad de ser evaluados para convertirse en Socios del proyecto Altus (las condiciones, porcentajes y requisitos de esta sociedad se definirán más adelante mediante un acuerdo por separado).</p>
              
              <p><strong>Evaluación Trienal:</strong> Cada tres (3) años, los términos del programa de afiliados se evaluarán íntegramente como una oportunidad de negocio emergente. Todas las decisiones estratégicas sobre la continuidad o modificación del programa serán tomadas exclusivamente por la directiva y sus socios consolidados.</p>

              <p><strong>Límite de Tiempo de la Comisión (Regla de los 12 Meses):</strong> Para incentivar el crecimiento continuo y el seguimiento activo, el pago de comisiones recurrentes por cada cliente referido tiene una vigencia máxima de doce (12) meses consecutivos. Transcurrido el primer año desde la suscripción del cliente, la comisión sobre esa cuenta específica será cancelada. Esto motiva al afiliado a seguir prospectando nuevos clientes de alta fidelidad y a mantener la comunicación con ellos para asegurar la retención durante ese primer año crítico.</p>

              <p><strong>Condición Estricta de Pago (Regla de las 72 Horas):</strong> El pago de comisiones está estrictamente atado a la recaudación de Altus. Si un cliente recomendado presenta un fallo en su pago, se otorgará un período de gracia de 72 horas. Si el cliente no actualiza su plan, el afiliado no recibirá la comisión de ese mes y, de darse de baja definitiva, perderá las comisiones restantes de ese ciclo de 12 meses.</p>

              <p><strong>Rescisión Unilateral:</strong> Nos reservamos el derecho absoluto e inapelable de rescindir inmediatamente el estatus de afiliado, congelar cuentas y retener comisiones pendientes si detectamos prácticas indebidas, incluyendo: envío de SPAM, fraude en tarjetas de crédito, difamación, tergiversación de la marca Altus, o publicidad engañosa.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">8. Ecosistema Financiero Interno (Billetera y Recargas)</h2>
            <div className="space-y-4">
              <p><strong>Créditos de IA y Recargas (Top-Ups):</strong> Los planes de suscripción otorgan una cantidad fija de "Créditos de IA" mensuales. El usuario puede adquirir créditos adicionales (Recargas) si agota su saldo. <strong>Estas recargas adicionales están estrictamente excluidas del programa de comisiones de afiliados.</strong> Los afiliados únicamente generan comisión sobre el valor base del plan de suscripción recurrente, no sobre el consumo transaccional de IA.</p>
              
              <p><strong>Billetera Altus y Monetización:</strong> Los fondos acumulados en la Billetera Interna (generados a través de integraciones de monetización como Amazon Afiliados o similares) pueden ser utilizados como crédito a favor para el pago de la suscripción mensual de Altus o para adquirir más Créditos de IA. Altus actúa como custodio temporal de estos fondos.</p>

              <p><strong>Políticas de Retiro (Payouts):</strong> Las transferencias de la Billetera Interna hacia cuentas bancarias personales o pasarelas de terceros (Stripe, Payoneer, PayPal, Wise) están sujetas a las siguientes condiciones irrefutables:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Umbral Mínimo:</strong> Solo se procesarán retiros cuando el saldo disponible sea igual o superior a cincuenta dólares estadounidenses ($50.00 USD).</li>
                <li><strong>Tiempos de Procesamiento:</strong> Las solicitudes de retiro tomarán entre tres (3) y cinco (5) días hábiles en reflejarse en la cuenta del destinatario para permitir la validación antifraude.</li>
                <li><strong>Conformidad y KYC:</strong> Por leyes internacionales contra el lavado de dinero, el usuario deberá completar la Verificación de Identidad (Know Your Customer) mediante nuestro procesador de pagos antes del primer retiro.</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
