import React, { FormEvent, useEffect, useState } from 'react';
import './App.css';

function App() {
  const apiBaseUrl = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: 'wordpress',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const openLeadModal = () => {
    if (status !== 'idle') {
      setStatus('idle');
    }
    if (errorMessage) {
      setErrorMessage('');
    }
    setIsLeadModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            const textElements = entry.target.querySelectorAll('.stagger');
            textElements.forEach((el, index) => {
              (el as HTMLElement).style.transitionDelay = `${index * 0.08}s`;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      document.documentElement.style.setProperty('--mx', `${x}`);
      document.documentElement.style.setProperty('--my', `${y}`);
    };

    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useEffect(() => {
    if (!isLeadModalOpen) {
      return undefined;
    }

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLeadModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    window.addEventListener('keydown', onEsc);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener('keydown', onEsc);
    };
  }, [isLeadModalOpen]);

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'request failed');
      }

      setStatus('sent');
      setIsLeadModalOpen(false);
      setForm({
        name: '',
        company: '',
        email: '',
        phone: '',
        projectType: 'wordpress',
        message: '',
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Неизвестная ошибка отправки');
    }
  };

  return (
    <div className="App">
      <div className="noise" />
      <button className="floating-lead-btn" type="button" onClick={openLeadModal}>
        Оставить заявку
      </button>
      <header className="topbar reveal">
        <div className="brand">
          <span className="brand-mark" />
          <span>ЛИТ</span>
        </div>
        <nav className="menu">
          <a href="#about">О нас</a>
          <a href="#services">Услуги</a>
          <a href="#projects">Проекты</a>
          <a href="#process">Этапы</a>
          <a href="#brief">Бриф</a>
        </nav>
        <button className="btn btn-secondary btn-small" type="button" onClick={() => scrollToSection('brief')}>
          Бриф проекта
        </button>
      </header>

      <main className="content">
        <section className="hero reveal" id="lit">
          <div>
            <p className="label stagger">Лаборатория Инновационных Технологий</p>
            <h1 className="stagger">Сайты и digital-системы, которые превращают стратегию в результат</h1>
            <p className="subtitle stagger">
              Премиальный дизайн, инженерная разработка и маркетинговая аналитика в одном контуре для
              бизнеса, который хочет расти системно.
            </p>
            <div className="actions stagger">
              <button className="btn btn-primary" type="button" onClick={openLeadModal}>Начать проект</button>
            </div>
          </div>
          <div className="blob-scene">
            <div className="blob parallax-blob blob-a" />
            <div className="blob parallax-blob blob-b" />
          </div>
        </section>

        <section className="section reveal" id="about">
          <div className="about-grid">
            <div className="blob-card">
              <div className="blob parallax-blob blob-c" />
            </div>
            <article className="glass about-text">
              <p className="section-tag stagger">ЛАБА</p>
              <h2 className="stagger">Лаба, где дизайн и инженерия работают как одна система</h2>
              <p className="stagger">
                Мы создаем коммерческие web-продукты и digital-системы с премиальной визуальной подачей,
                четкой структурой и измеримым результатом для бизнеса.
              </p>
              <button className="btn btn-secondary btn-small stagger" type="button" onClick={openLeadModal}>
                Обсудить проект
              </button>
            </article>
          </div>
        </section>

        <section className="section reveal" id="services">
          <p className="section-tag stagger">УСЛУГИ</p>
          <h2 className="stagger">Что мы делаем</h2>
          <div className="service-cards">
            <article className="service-card">
              <p>01</p>
              <h3>Сайты под продажи</h3>
              <ul className="service-list">
                <li>Корпоративные сайты и лендинги</li>
                <li>UX для конверсии и заявок</li>
                <li>Редизайн и пересборка структуры</li>
              </ul>
            </article>
            <article className="service-card">
              <p>02</p>
              <h3>Маркетинг и аналитика</h3>
              <ul className="service-list">
                <li>SEO и рекламные связки</li>
                <li>Сквозная аналитика воронок</li>
                <li>Оптимизация CPL и ROI</li>
              </ul>
            </article>
            <article className="service-card">
              <p>03</p>
              <h3>Разработка и интеграции</h3>
              <ul className="service-list">
                <li>Frontend и backend разработка</li>
                <li>Интеграции CRM, БД, сервисов</li>
                <li>Стабильный релизный процесс</li>
              </ul>
            </article>
            <article className="service-card">
              <p>04</p>
              <h3>Поддержка и рост</h3>
              <ul className="service-list">
                <li>Техподдержка и SLA</li>
                <li>План развития проекта</li>
                <li>Эксперименты и масштабирование</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section reveal" id="projects">
          <p className="section-tag stagger">ПРОЕКТЫ</p>
          <h2 className="stagger">Проекты и направления</h2>
          <div className="projects-grid">
            <article className="glass project-card">
              <p className="project-type">Веб-продакшн</p>
              <h3>Сайты, которые продают</h3>
              <p>Лендинги и корпоративные платформы с упором на конверсию, скорость и понятную аналитику.</p>
              <button className="btn btn-secondary btn-small" type="button" onClick={() => scrollToSection('brief')}>
                Подробнее
              </button>
            </article>
            <article className="glass project-card">
              <p className="project-type">Digital-рост</p>
              <h3>Маркетинг и реклама</h3>
              <p>SEO, контекст и performance-связки, где каждое решение опирается на данные и бизнес-цели.</p>
              <button className="btn btn-secondary btn-small" type="button" onClick={() => scrollToSection('brief')}>
                Подробнее
              </button>
            </article>
            <article className="glass project-card">
              <p className="project-type">Инжиниринг</p>
              <h3>Сложные интеграции</h3>
              <p>Интегрируем CRM, внутренние сервисы и базы данных в единый стабильный рабочий контур.</p>
              <button className="btn btn-secondary btn-small" type="button" onClick={() => scrollToSection('brief')}>
                Подробнее
              </button>
            </article>
          </div>
        </section>

        <section className="section reveal" id="process">
          <p className="section-tag stagger">ЦИКЛ</p>
          <h2 className="stagger">Наш консалтинговый цикл</h2>
          <div className="process-list">
            <article className="process-item">
              <span>A-01</span>
              <p>Аудит, брифинг и стратегия проекта</p>
            </article>
            <article className="process-item featured">
              <span>B-02</span>
              <p>Дизайн-концепция и прототипирование</p>
            </article>
            <article className="process-item">
              <span>C-03</span>
              <p>Разработка, интеграции и запуск</p>
            </article>
            <article className="process-item">
              <span>D-04</span>
              <p>Маркетинг, аналитика и рост</p>
            </article>
          </div>
        </section>

        <section className="section reveal">
          <div className="banner-wave">
            <div className="blob blob-d" />
            <h2>Стратегия, дизайн и запуск в одном ритме</h2>
          </div>
        </section>

        <section className="section reveal" id="brief">
          <p className="section-tag stagger">БРИФ ПРОЕКТА</p>
          <h2 className="stagger">Как ведем работу по проекту</h2>
          <div className="brief-grid">
            <article className="glass">
              <h3>Формат реализации сайта</h3>
              <ul className="service-list">
                <li>WordPress — для управляемых контентных проектов</li>
                <li>Tilda — для быстрых MVP и промо-лендингов</li>
                <li>Самописный сайт — для сложных и масштабируемых решений</li>
              </ul>
            </article>
            <article className="glass">
              <h3>Digital-продвижение</h3>
              <ul className="service-list">
                <li>SEO-оптимизация и техническое сопровождение</li>
                <li>Контекстная реклама и performance-кампании</li>
                <li>Аналитика, ретаргетинг и системный рост конверсии</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="cta reveal">
          <div className="cta-blob">
            <div className="blob parallax-blob blob-e" />
          </div>
          <div className="cta-content">
            <h2 className="stagger">Отправить заявку</h2>
            <form className="lead-form" onSubmit={submitLead}>
              <input
                type="text"
                placeholder="Ваше имя"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="Компания"
                value={form.company}
                onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
              <select
                value={form.projectType}
                onChange={(e) => setForm((prev) => ({ ...prev, projectType: e.target.value }))}
              >
                <option value="wordpress">WordPress</option>
                <option value="tilda">Tilda</option>
                <option value="custom">Самописный сайт</option>
                <option value="marketing">Продвижение и реклама</option>
              </select>
              <textarea
                placeholder="Кратко опишите задачу"
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                rows={4}
                required
              />
              <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>
            {status === 'sent' && (
              <p className="form-status success">Заявка отправлена. Мы свяжемся с вами в ближайшее время.</p>
            )}
            {status === 'error' && (
              <p className="form-status error">
                Не удалось отправить заявку: {errorMessage || 'Проверьте backend и настройки почты.'}
              </p>
            )}
          </div>
        </section>
      </main>

      {isLeadModalOpen && (
        <div className="lead-modal-overlay" role="presentation" onClick={() => setIsLeadModalOpen(false)}>
          <div className="lead-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button className="lead-modal-close" type="button" onClick={() => setIsLeadModalOpen(false)}>
              Закрыть
            </button>
            <h2>Обсудим ваш проект</h2>
            <p className="lead-modal-subtitle">
              Опишите задачу и контакты. Мы подготовим план работ и вернемся с предложением.
            </p>
            <form className="lead-form lead-form-modal" onSubmit={submitLead}>
              <input
                type="text"
                placeholder="Ваше имя"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="Компания"
                value={form.company}
                onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
              <select
                value={form.projectType}
                onChange={(e) => setForm((prev) => ({ ...prev, projectType: e.target.value }))}
              >
                <option value="wordpress">WordPress</option>
                <option value="tilda">Tilda</option>
                <option value="custom">Самописный сайт</option>
                <option value="marketing">Продвижение и реклама</option>
              </select>
              <textarea
                placeholder="Кратко опишите задачу"
                value={form.message}
                onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                rows={4}
                required
              />
              <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
