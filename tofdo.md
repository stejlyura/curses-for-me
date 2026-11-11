# Multi-Course Platform Evolution — Task Backlog (`tofdo.md`)

## 1. Архитектурная трансформация и FSD Слой (Multi-Course Domain)
- [x] **1.1. Сущность Course (`src/entities/course`)**
  - [x] Создать схему `CourseSchema` в `src/entities/course/model/schemas.ts`:
    - `id: string`, `slug: string`, `title: string`, `shortDescription: string`, `fullDescription: string`
    - `roleBadge: string`, `level: 'Middle' | 'Senior' | 'Lead' | 'Executive'`
    - `iconName: string`, `colorTheme: { from: string, to: string, accent: string }`
    - `targetAudience: string[]`, `keyCompetencies: string[]`
    - `stats: { totalLessons: number, totalModules: number, estimatedHours: number, caseCount: number }`
    - `modules: string[]` (список slug модулей курса)
  - [x] Экспорт типов и публичного API в `src/entities/course/index.ts`.
  - [x] UI-компонент карточки курса: `src/entities/course/ui/CourseCard.tsx`.

- [x] **1.2. Рефакторинг связи Module и Lesson с Курсами**
  - [x] Расширить `ModuleSchema` полем `courseSlug: string`.
  - [x] Расширить `LessonSchema` полем `courseSlug: string`.
  - [x] Создать датасет `coursesData` в `src/shared/data/courses.ts` (4 курса: Senior Marketing/Growth, Media Buying/PPC, Affiliate Manager, SDR/Lead Generation).
  - [x] Обновить `src/shared/lib/content-loader.ts`:
    - `getAllCourses(): Course[]`
    - `getCourseBySlug(slug: string): Course | undefined`
    - `getModulesByCourseSlug(courseSlug: string): Module[]`
    - `getLessonsByCourseSlug(courseSlug: string): Lesson[]`
    - `getLessonByCourseAndSlug(courseSlug: string, lessonSlug: string): Lesson | undefined`

- [x] **1.3. Маршрутизация Next.js (App Router)**
  - [x] Реализовать страницу курса: `src/app/courses/[courseSlug]/page.tsx` (детальный силлабус, статистика, метрики, модули, старт первого урока).
  - [x] Реализовать страницу урока в контексте курса: `src/app/courses/[courseSlug]/lessons/[slug]/page.tsx` с `generateStaticParams()`.
  - [x] Обеспечить обратную совместимость/редиректы для старых путей `/lessons/[slug]` в `src/app/lessons/[slug]/page.tsx` (редирект на `/courses/senior-marketing/lessons/[slug]`).

---

## 2. Редизайн главной страницы `/` (Курс-хаб)
- [x] **2.1. Hero & Философия платформы**
  - [x] Компактный senior-focused заголовок и позиционирование (интенсивная подготовка к FAANG, Scale-up и Tier-1 проектам: без воды, с формулами, защитой кейсов и эконометрикой).
  - [x] Быстрые глобальные метрики: общее количество прикладных уроков, симуляторов, фреймворков и бенчмарков.

- [x] **2.2. Блоки выбора курса (Ключевое требование)**
  - [x] Удалить с `/` детальные инлайн-модули старого монолитного курса.
  - [x] Разместить интерактивную сетку курсов:
    1. **Senior Marketing & Growth Lead** (Unit-экономика, когорты, MMM/Attribution, PLG, Enterprise Growth).
    2. **Media Buying & PPC Lead** (Meta Ads, Google Ads/PMax, TikTok, креативные фабрики, CAPI, юнит-экономика аукционов, арбитраж).
    3. **Affiliate Manager & Head of Affiliates** (Экосистемы CPA/CPL/RevShare, антифрод, трекинг Keitaro/Voluum, хантинг топ-вебов, P&L офферов).
    4. **Sales Development Representative / Lead Gen Specialist** (ICP/TAM, скрапинг Apollo/Clay, холодный аутрич, deliverability, квалификация BANT/MEDDPIC, звонки).
  - [x] Каждая карточка курса отображает: бейдж грейда, ключевые метрики (ROAS / CPA / CAC / SQL), стек инструментов, прогресс прохождения и прямую кнопку "Начать курс / Продолжить".

---

## 3. Курс 1: Senior Marketing & Head of Growth (Рефакторинг)
- [x] **3.1. Миграция существующего контента в контекст курса**
  - [x] Присвоить `courseSlug: 'senior-marketing'` для всех существующих 6 модулей и 30+ уроков в `modules.ts` и `lessons.ts`.
  - [x] Проверить целостность связей с калькуляторами Unit Economics и A/B тестирования.

---

## 4. Курс 2: Media Buying / PPC Specialist (Контент и модули)
- [x] **4.1. Модуль 1: Аукционная эконометрика и Unit-экономика трафика**
  - [x] Урок 1: Blended ROAS, MER (Marketing Efficiency Ratio), nCPA (New Customer CPA) и предел безубыточности.
  - [x] Урок 2: Модели биддинга (tCPA, tROAS, Target Impression Share, Lowest Cost) и математика eCPM/vCPM.
  - [x] Урок 3: Инкрементальность трафика, Geo-Lift тесты и устранение каннибализации органики.

- [x] **4.2. Модуль 2: Meta Ads Ecosystem (Facebook & Instagram Ads)**
  - [x] Урок 1: Архитектура Advantage+ Shopping Campaigns (ASC) vs консолидированные CBO/ABO структуры.
  - [x] Урок 2: Конверсионные воронки в Meta: Broad таргетинг, Lookalike в эпоху Privacy, динамические креативы (DCO).
  - [x] Урок 3: Борьба с Creative Fatigue (усталость креативов), Hook Rate (3s/impressions), Hold Rate и матрица итераций.

- [x] **4.3. Модуль 3: Google Ads (Search, Performance Max & YouTube)**
  - [x] Урок 1: Архитектура аккаунта Google Ads: Alpha/Beta кампании, SKAG vs STAG, точный и фразовый матчинг.
  - [x] Урок 2: Performance Max под капотом: сигналы аудиторий, защита от мусорного трафика, скрипты исключения брендовых запросов.
  - [x] Урок 3: YouTube Ads & Demand Gen: хуки, ABCDs фреймворк креативов, расчет CPV/CPA для видео.

- [x] **4.4. Модуль 4: Трекинг, Privacy и Server-Side инфраструктура**
  - [x] Урок 1: Server-Side GTM, Meta Conversions API (CAPI) и Google Enhanced Conversions (хеширование sha256).
  - [x] Урок 2: iOS 14.5+ SKAdNetwork (SKAN 4.0), AdAttributionKit и дедупликация конверсий.
  - [x] Урок 3: Антифрод, cloaking архитектура, прогрев аккаунтов, белые/серые вертикали и полиси комплаенс.

- [x] **4.5. Модуль 5: Масштабирование бюджетов и управление рисками**
  - [x] Урок 1: Вертикальное vs горизонтальное масштабирование (Surfing budgets, дубли адсетов, ступенчатый скейлинг).
  - [x] Урок 2: P&L медиабайера, кассовые разрывы, лимиты кредитных линий и холды платежных систем.
  - [x] Урок 3: Собеседование Senior Media Buyer / Lead PPC: защита сливов, разбор аудита чужих аккаунтов, формулы Google XYZ для резюме.

- [x] **4.6. Интерактивный инструмент курса**
  - [x] Создать `src/features/calculators/ui/MediaBuyingSimulator.tsx`:
    - Симулятор аукциона с расчетом eCPM, CTR, CPC, CR1, CR2, CPA, AOV, MER и Break-Even ROAS с учетом маржинальности товара/подписки.

---

## 5. Курс 3: Affiliate Manager / Head of Affiliates (Контент и модули)
- [x] **5.1. Модуль 1: Экосистема Affiliate-маркетинга и бизнес-модели**
  - [x] Урок 1: Анатомия рынка: Прямой рекламодатель vs CPA-сеть vs Медиабайинговая команда vs Одиночный вебмастер.
  - [x] Урок 2: Модели монетизации и риски: CPA, CPL (SOI/DOI), RevShare (NGR/GGR), Hybrid, CPC/CPM.
  - [x] Урок 3: Вертикали (E-com, FinTech, Nutra, iGaming, Mobile Apps, SaaS): специфика LTV, пейаутов и регуляторики.

- [x] **5.2. Модуль 2: Технический стек, трекинг и постбеки**
  - [x] Урок 1: S2S (Server-to-Server) Postback URL, ClickID, SubID и архитектура проброса параметров.
  - [x] Урок 2: Трекеры и TDS (Keitaro, Voluum, Binom, Tune, AppsFlyer): настройка сплит-тестов и распределения трафика.
  - [x] Урок 3: Мониторинг аптайма офферов, авторедиректы при капах и защита от потери трафика.

- [x] **5.3. Модуль 3: Рекрутинг, онбординг и развитие аффилиатов**
  - [x] Урок 1: Поиск и хантинг топовых команд (конференции, форумы, закрытые чаты, спай-сервисы AdPlexity/SpyOver).
  - [x] Урок 2: Структура оффера, который берут в работу: лендинги, промоматериалы, бамп ставок, гибкие капы.
  - [x] Урок 3: Удержание вебов: динамические ставки, эксклюзивные флоу, сокращение холдов и кэш-эдвансы.

- [x] **5.4. Модуль 4: Антифрод, комплаенс и контроль качества трафика**
  - [x] Урок 1: Виды фрода: боты, cookie stuffing, click spamming, мислид, мотивированный трафик, мимикрия под бренд.
  - [x] Урок 2: Метрики качества: CR в повторный депозит (Baseline), retention cohort, time-to-first-action, активность в приложении.
  - [x] Урок 3: Процедура срезов (Chargeback / Scrubbing), юридическая аргументация и защита бюджета рекламодателя.

- [x] **5.5. Модуль 5: Финансовый менеджмент и P&L аффилиат-отдела**
  - [x] Урок 1: Юнит-экономика партнерской программы: расчет допустимого CPA от LTV с учетом фрода и возвратов.
  - [x] Урок 2: Сверка статистики, биллинг, международные платежные шлюзы (крипта, Capitalist, SWIFT) и налогообложение.
  - [x] Урок 3: Подготовка к собеседованию Head of Affiliates: кейсы переговоров, конфликтные ситуации, резюме в стандарте Google XYZ.

- [x] **5.6. Интерактивный инструмент курса**
  - [x] Создать `src/features/calculators/ui/AffiliatePnLSimulator.tsx`:
    - Расчет маржинальности оффера при CPA vs RevShare, учет фрод-рейта, холдов, выплат вебмастерам и чистого Net Profit рекламодателя.

---

## 6. Курс 4: Sales Development Representative / Lead Gen Specialist (Контент и модули)
- [x] **6.1. Модуль 1: Фундамент B2B Outbound и исследование рынка**
  - [x] Урок 1: ICP (Ideal Customer Profile) и Buyer Personas: критерии включения, триггеры найма, раунды инвестиций, смена стека.
  - [x] Урок 2: TAM (Total Addressable Market), SAM, SOM и приоритизация аккаунтов (Tier 1 / Tier 2 / Tier 3 ABM подход).
  - [x] Урок 3: Сигналы намерения (Intent Data): Bombora, G2 intent, изменения открытых вакансий и активность в соцсетях.

- [x] **6.2. Модуль 2: Стек скрапинга, обогащения и валидации контактов**
  - [x] Урок 1: LinkedIn Sales Navigator: расширенный Boolean Search, списки лидов, мониторинг смены работы.
  - [x] Урок 2: Автоматизация и обогащение баз: Clay, Apollo.io, ZoomInfo, Clearbit, водопадная верификация (Waterfall enrichment).
  - [x] Урок 3: Валидация почт (ZeroBounce, NeverBounce) и сопоставление корпоративных номеров телефонов.

- [x] **6.3. Модуль 3: Инфраструктура Cold Email и Deliverability**
  - [x] Урок 1: Архитектура доменов-сателлитов: вторичные домены, Google Workspace vs Office 365, DNS (SPF, DKIM, DMARC, MX).
  - [x] Урок 2: Прогрев почтовых ящиков (Warm-up pools, Instantly, Smartlead) и лимиты отправки (не более 30-50 писем/ящик в день).
  - [x] Урок 3: Спам-триггеры, трекинг открытий (open-rate) vs конверсия в ответ (reply-rate) в эпоху strict privacy.

- [x] **6.4. Модуль 4: Копирайтинг холодных цепочек и Social Selling**
  - [x] Урок 1: Структура холодного письма с reply rate >15%: Problem-Agitate-Solve, No-Commitment CTA, персонализация первой строки.
  - [x] Урок 2: Мультиканальные последовательности: 10-12 касаний (Email + LinkedIn Connection + Voice Message + Phone + Bump).
  - [x] Урок 3: Работа с возражениями в переписке ("Уже работаем с X", "Не актуально", "Отправьте КП", молчание).

- [x] **6.5. Модуль 5: Cold Calling, квалификация и передача Account Executive**
  - [x] Урок 1: Анатомия холодного звонка: преодоление привратника (Gatekeeper), паттерн-интеррапты первых 7 секунд, скрипты без заиканий.
  - [x] Урок 2: Фреймворки квалификации: BANT (Budget, Authority, Need, Timing) vs MEDDPIC vs CHAMP.
  - [x] Урок 3: CRM Hygiene (Salesforce/HubSpot), передача лида в AE (Meeting Show-up Rate) и подготовка к собеседованию SDR/BDR.

- [x] **6.6. Интерактивный инструмент курса**
  - [x] Создать `src/features/calculators/ui/OutboundPipelineSimulator.tsx`:
    - Моделирование воронки аутрича: число доменов/ящиков -> объем отправок -> Deliverability -> Open Rate -> Reply Rate -> Positive Reply % -> Booked Calls -> Show-up Rate -> SQL -> Выручка.

---

## 7. Модернизация общих виджетов и навигации
- [x] **7.1. Модульный сайдбар (`src/widgets/sidebar/ui/ModuleNav.tsx`)**
  - [x] Адаптировать сайдбар для фильтрации по текущему курсу (`currentCourseSlug`).
  - [x] Добавить переключатель курсов в шапке сайдбара с возвратом к каталогу `/`.
  - [x] Сохранять активный модуль и прогресс по каждому курсу отдельно в `localStorage`.

- [x] **7.2. LessonViewer (`src/widgets/lesson-viewer/ui/LessonViewer.tsx`)**
  - [x] Добавить хлебные крошки: `Главная > Курс > Модуль > Урок`.
  - [x] Поддержка специфичных для курсов калькуляторов в конце соответствующих уроков.

---

## 8. Проверка качества, строгая типизация и сборка
- [x] **8.1. TypeScript Strictness**
  - [x] `npm run type-check` (или `npx tsc --noEmit`): 0 ошибок типизации, строгий запрет на `any`.
  - [x] Валидация всех добавленных уроков через Zod-схемы во время SSG генерации.

- [x] **8.2. SSG Static Export & Next.js Build**
  - [x] Проверить генерацию статических страниц для всех 4 курсов и сотен уроков (`npm run build`).
  - [x] Проверить отсутствие битых ссылок и работу интерактивных симуляторов в оффлайн-режиме (PWA ready).

