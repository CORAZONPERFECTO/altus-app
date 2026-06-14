import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors mb-12">
          <ArrowLeft size={16} />
          <span>Volver al inicio</span>
        </Link>
        
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Política de Privacidad y Manejo de Datos</h1>
        <p className="text-zinc-500 mb-10">Última actualización: 14 de Junio de 2026</p>

        <div className="space-y-10 text-sm leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">1. Demarcación de Roles de Datos (Ley 172-13)</h2>
            <div className="space-y-4">
              <p>En el ecosistema de Altus, establecemos una clara distinción legal de responsabilidades respecto a la información procesada:</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li><strong>El Responsable del Tratamiento:</strong> Eres tú (la Agencia o Cliente). Eres el propietario de los datos de tus cuentas y el único responsable de obtener el consentimiento legal de tus seguidores y clientes finales para el procesamiento de sus interacciones.</li>
                <li><strong>El Encargado del Tratamiento:</strong> Es Altus. Proveemos la infraestructura tecnológica (SaaS) para procesar, almacenar y visualizar los datos en nombre del "Responsable". No dictamos el propósito del uso de los datos.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">2. Información que Recopilamos</h2>
            <div className="space-y-4">
              <p>Recopilamos datos de autenticación (nombres, correos) cuando te registras, y tokens de acceso seguros (OAuth) cuando conectas tus redes sociales (Meta, Google). Altus nunca almacena contraseñas directas de tus cuentas de redes sociales.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">3. Uso y No Comercialización de la Información</h2>
            <div className="space-y-4">
              <p>Utilizamos los tokens OAuth exclusivamente para publicar contenido en tu nombre y recopilar métricas analíticas. <strong>Altus prohíbe estrictamente</strong> y no participa en la venta, alquiler o comercialización de tus datos personales, ni de las métricas extraídas de tus redes, a terceros o brókeres de datos.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">4. Derechos ARCO y Supresión de Datos</h2>
            <div className="space-y-4">
              <p>Garantizamos mecanismos automatizados para que ejerzas tus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO):</p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li>Puedes desconectar tus cuentas de redes sociales en cualquier momento desde el Dashboard.</li>
                <li>Al hacerlo, ejecutaremos un borrado irreversible de los tokens de acceso y de los metadatos almacenados en nuestros servidores.</li>
                <li>La agencia está obligada a ejecutar esta supresión inmediatamente si un cliente final lo exige, o si Meta/Google emiten una orden de eliminación de datos (Data Deletion Request).</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">5. Seguridad de la Infraestructura</h2>
            <div className="space-y-4">
              <p>Tu información se almacena en bases de datos cifradas gestionadas por plataformas de nube de clase mundial (ej. Google Cloud/Firebase). Limitamos estrictamente el acceso a esta información a los ingenieros autorizados únicamente con fines de mantenimiento y soporte.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
