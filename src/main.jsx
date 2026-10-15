import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowUpRight, CheckCircle2, Clock3, MapPin, Users, LoaderCircle,
  LockKeyhole, LogOut, Search, RefreshCw, CalendarDays, UserRound
} from 'lucide-react';
import './styles.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || 'https://chat.whatsapp.com/J2HT1eguGtRExG9GgknSkW';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function RegistrationPage() {
  const [form, setForm] = useState({ full_name: '', age: '', phone: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault();
    setError('');

    if (!supabase) {
      setError('Falta configurar Supabase. Revisa el archivo .env.local y reinicia el servidor.');
      return;
    }
    const age = Number(form.age);
    if (!form.full_name.trim() || !Number.isInteger(age) || age < 1 || age > 100 || form.phone.trim().length < 7) {
      setError('Revisa tu nombre, edad y número celular antes de enviar.');
      return;
    }

    setStatus('loading');
    const { error: insertError } = await supabase.from('social_run_registrations').insert({
      full_name: form.full_name.trim(),
      age,
      phone: form.phone.trim()
    });

    if (insertError) {
      console.error(insertError);
      setStatus('idle');
      setError('No pudimos completar tu inscripción. Inténtalo nuevamente en unos segundos.');
      return;
    }
    setStatus('success');
  }

  return (
    <main>
      <header className="topbar">
        <a href="#inicio" className="brand" aria-label="Social Run, inicio">
          <span className="brand-mark">RC</span><span>RUNNING<br />CREW</span>
        </a>
        <a className="top-link" href="#registro">INSCRÍBETE <ArrowUpRight size={16} /></a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span className="blue-dot" /> RUNNING CREW × SAAKĒ × VÉRTIGO</p>
          <h1>SOCIAL<br /><span>RUN</span></h1>
          <div className="hero-bottom">
            <span className="distance">5K</span>
            <p>Corre a tu ritmo.<br /><strong>Conecta con tu comunidad.</strong></p>
          </div>
        </div>
        <div className="hero-photo">
          <img src="/social-run-flyer.png" alt="Flyer de Social Run 5K con corredores" />
          <span className="photo-label">RUN TOGETHER / 001</span>
        </div>
      </section>

      <section className="event-strip" aria-label="Información del evento">
        <div className="event-item"><Clock3 size={20} /><div><small>FECHA Y HORA</small><strong>24 OCT · 17H00</strong></div></div>
        <div className="event-item"><MapPin size={20} /><div><small>PUNTO DE ENCUENTRO</small><strong>Plaza Badaracco</strong></div></div>
        <div className="event-item"><Users size={20} /><div><small>EXPERIENCIA</small><strong>Ruta gratuita · 5K</strong></div></div>
      </section>

      <section className="registration" id="registro">
        <div className="registration-intro">
          <p className="eyebrow">TU PRÓXIMO PLAN EMPIEZA AQUÍ</p>
          <h2>Regístrate en<br /><span>la Social Run.</span></h2>
          <p className="intro-text">Una ruta para moverte, conocer gente y compartir la energía del running. Inscríbete gratis y nos vemos en la línea de salida.</p>
          <div className="included"><CheckCircle2 size={17} /> Hidratación incluida</div>
          <div className="included"><CheckCircle2 size={17} /> Registro fotográfico</div>
          <div className="included"><CheckCircle2 size={17} /> After Run en Saakē con DJ Alfonso Vera</div>
          <p className="note">Cupos limitados · Inscripción personal</p>
        </div>

        <div className="form-card">
          {status === 'success' ? (
            <div className="success-state">
              <div className="success-icon"><CheckCircle2 size={32} /></div>
              <p className="eyebrow">INSCRIPCIÓN CONFIRMADA</p>
              <h3>¡Ya eres parte<br />de la Social Run!</h3>
              <p>Tu registro se guardó correctamente. Únete a nuestra comunidad de WhatsApp para recibir novedades, indicaciones y más información sobre la ruta.</p>
              <a className="submit-button whatsapp-button" href={whatsappUrl} target="_blank" rel="noreferrer">Únete a la comunidad <ArrowUpRight size={18} /></a>
              <button className="text-button" onClick={() => { setForm({ full_name: '', age: '', phone: '' }); setStatus('idle'); }}>Registrar a otra persona</button>
            </div>
          ) : (
            <>
              <div className="form-heading"><span>01 / REGISTRO</span><span className="form-line" /></div>
              <h3>Tu lugar te espera.</h3>
              <p className="form-subtitle">Completa tus datos para reservar tu cupo.</p>
              <form onSubmit={submit}>
                <label htmlFor="full_name">Nombre completo</label>
                <input id="full_name" name="full_name" type="text" autoComplete="name" placeholder="¿Cómo te llamas?" value={form.full_name} onChange={update} maxLength="100" required />
                <div className="field-row">
                  <div><label htmlFor="age">Edad</label><input id="age" name="age" type="number" min="1" max="100" placeholder="Ej. 22" value={form.age} onChange={update} required /></div>
                  <div><label htmlFor="phone">Número celular</label><input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="09XXXXXXXX" value={form.phone} onChange={update} maxLength="20" required /></div>
                </div>
                {error && <p className="error-message" role="alert">{error}</p>}
                <button className="submit-button" type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? <><LoaderCircle className="spin" size={18} /> Enviando...</> : <>Enviar inscripción <ArrowUpRight size={18} /></>}
                </button>
                <p className="privacy-note">Al enviar, autorizas el uso de estos datos únicamente para gestionar tu inscripción y comunicar información relacionada con el evento.</p>
              </form>
            </>
          )}
        </div>
      </section>

      <section className="after-run">
        <div><p className="eyebrow">DON'T STOP AT 5K</p><h2>El plan sigue<br /><span>después de correr.</span></h2></div>
        <div className="after-details"><p>After Run en Saakē con DJ Alfonso Vera y barra libre de palomas de 18h00 a 20h00.</p><strong>3 × $10 EN MATCHA</strong></div>
      </section>
      <footer>
        <div className="footer-brand">SOCIAL <span>RUN</span> 5K</div>
        <p>RUNNING CREW × SAAKĒ × VÉRTIGO</p>
        <a href="#inicio"><span>VOLVER ARRIBA ↑</span></a>
        <a className="admin-footer-link" href="/admin">ADMIN</a>
      </footer>
    </main>
  );
}

function AdminPage() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); setError('Falta configurar Supabase en .env.local.'); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadRegistrations() {
    if (!supabase) return;
    setDataLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase
      .from('social_run_registrations')
      .select('id, full_name, age, phone, created_at')
      .order('created_at', { ascending: false });
    if (fetchError) {
      console.error(fetchError);
      setError('No se pudieron cargar las inscripciones. Verifica que ejecutaste la política SQL para el correo administrador.');
    } else {
      setRegistrations(data || []);
    }
    setDataLoading(false);
  }

  useEffect(() => {
    if (session) loadRegistrations();
  }, [session]);

  async function login(event) {
    event.preventDefault();
    if (!supabase) { setError('Falta configurar Supabase.'); return; }
    setLoginLoading(true);
    setError('');
    const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (loginError) setError('No se pudo iniciar sesión. Revisa el correo y la contraseña del administrador.');
    setLoginLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    setRegistrations([]);
    setPassword('');
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('es');
    if (!q) return registrations;
    return registrations.filter(r =>
      `${r.full_name} ${r.phone} ${r.age}`.toLocaleLowerCase('es').includes(q)
    );
  }, [registrations, search]);

  const formatDate = (value) => new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Guayaquil'
  }).format(new Date(value));

  if (authLoading) return <div className="admin-page"><div className="admin-loading"><LoaderCircle className="spin" /> Cargando panel...</div></div>;

  if (!session) return (
    <div className="admin-page">
      <div className="admin-top"><a href="/" className="brand"><span className="brand-mark">RC</span><span>RUNNING<br />CREW</span></a><span className="admin-tag">PANEL PRIVADO</span></div>
      <div className="admin-login-wrap">
        <div className="admin-login-card">
          <div className="admin-lock"><LockKeyhole size={26} /></div>
          <p className="eyebrow">SOCIAL RUN / ADMIN</p>
          <h1 className="admin-login-title">Panel de<br /><span>inscripciones.</span></h1>
          <p className="admin-muted">Inicia sesión con el correo y la contraseña del administrador para ver los datos de los participantes.</p>
          <form onSubmit={login}>
            <label htmlFor="admin-email">Correo administrador</label>
            <input id="admin-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@tucorreo.com" required />
            <label htmlFor="admin-password">Contraseña</label>
            <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contraseña" required />
            {error && <p className="error-message">{error}</p>}
            <button className="submit-button" disabled={loginLoading}>{loginLoading ? <><LoaderCircle className="spin" size={18} /> Entrando...</> : <>Iniciar sesión <ArrowUpRight size={18} /></>}</button>
          </form>
          <a className="back-link" href="/">← Volver a Social Run</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <header className="admin-top">
        <a href="/" className="brand"><span className="brand-mark">RC</span><span>RUNNING<br />CREW</span></a>
        <div className="admin-top-right"><span className="admin-tag">PANEL PRIVADO</span><button className="logout-button" onClick={logout}><LogOut size={16} /> Salir</button></div>
      </header>
      <main className="admin-main">
        <div className="admin-title-row">
          <div><p className="eyebrow">SOCIAL RUN 5K / CONTROL DE REGISTROS</p><h1 className="admin-dashboard-title">Inscripciones<span>.</span></h1><p className="admin-muted">Gestiona y consulta los participantes registrados en la ruta.</p></div>
          <button className="refresh-button" onClick={loadRegistrations} disabled={dataLoading}>{dataLoading ? <LoaderCircle className="spin" size={16} /> : <RefreshCw size={16} />} Actualizar</button>
        </div>
        {error && <p className="error-message admin-error">{error}</p>}
        <div className="stats-grid">
          <div className="stat-card"><span className="stat-icon"><Users size={20} /></span><p>Total de inscritos</p><strong>{registrations.length}</strong><small>Registros guardados</small></div>
          <div className="stat-card"><span className="stat-icon"><CalendarDays size={20} /></span><p>Inscritos hoy</p><strong>{registrations.filter(r => new Date(r.created_at).toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' }) === new Date().toLocaleDateString('en-CA', { timeZone: 'America/Guayaquil' })).length}</strong><small>Según hora de Ecuador</small></div>
          <div className="stat-card"><span className="stat-icon"><UserRound size={20} /></span><p>Edad promedio</p><strong>{registrations.length ? Math.round(registrations.reduce((sum, r) => sum + Number(r.age), 0) / registrations.length) : '—'}</strong><small>En años</small></div>
        </div>
        <section className="admin-table-card">
          <div className="table-header"><div><h2>Lista de participantes</h2><p>{filtered.length} {filtered.length === 1 ? 'persona' : 'personas'} en la lista</p></div><div className="search-box"><Search size={17} /><input aria-label="Buscar participante" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar nombre o celular..." /></div></div>
          <div className="table-scroll">
            <table className="registrations-table">
              <thead><tr><th>#</th><th>Nombre completo</th><th>Edad</th><th>Número celular</th><th>Fecha de inscripción</th></tr></thead>
              <tbody>
                {dataLoading ? <tr><td colSpan="5" className="table-empty"><LoaderCircle className="spin" size={18} /> Cargando registros...</td></tr>
                : filtered.length ? filtered.map((r, i) => <tr key={r.id}><td className="row-number">{i + 1}</td><td className="participant-name">{r.full_name}</td><td>{r.age}</td><td><a className="phone-link" href={`tel:${r.phone}`}>{r.phone}</a></td><td className="date-cell">{formatDate(r.created_at)}</td></tr>)
                : <tr><td colSpan="5" className="table-empty">{registrations.length ? 'No encontramos resultados para esa búsqueda.' : 'Todavía no hay inscripciones.'}</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
        <p className="admin-security-note"><LockKeyhole size={14} /> Solo el administrador autorizado puede consultar esta lista.</p>
      </main>
    </div>
  );
}

function App() {
  const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin';
  return isAdmin ? <AdminPage /> : <RegistrationPage />;
}

createRoot(document.getElementById('root')).render(<App />);
