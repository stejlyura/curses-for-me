import { Lesson } from '@/entities/lesson';

export const module8Lessons: Lesson[] = [
  {
    id: '8-1-advantage-plus-asc-vs-cbo-abo',
    slug: '8-1-advantage-plus-asc-vs-cbo-abo',
    courseSlug: 'media-buying',
    moduleId: 8,
    moduleTitle: 'Модуль 2: Meta Ads Ecosystem — ASC+, CBO & Creative Engine',
    lessonNumber: '2.1',
    title: 'Архитектура Advantage+ Shopping Campaigns (ASC) vs консолидированные CBO/ABO',
    level: 'Senior',
    readTimeMinutes: 11,
    targetAudience: 'Senior Media Buyers, UA Leads, E-com Growth Marketers',
    summary:
      'Эволюция машинного обучения Meta после Andromeda. Почему дробление аккаунтов на 50 адсетов гарантирует слив бюджета. Правильная архитектура ASC: лимиты существующих клиентов (Existing Customer Cap), консолидация ликвидности и разделение песочниц.',
    competencies: ['Enterprise Performance', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'Консолидация ликвидности (Account Simplification)',
        explanation:
          'Принцип объединения аудиторий и бюджетов в минимальное число кампаний, позволяющий алгоритму Meta быстрее собирать 50 конверсий в неделю для выхода из Learning Phase.',
        formulas: [
          'Optimal Structure: 1 Testing Sandbox (CBO/ABO) + 1 Scaling Engine (ASC/CBO)',
        ],
      },
      {
        title: 'Existing Customer Budget Cap',
        explanation:
          'Настройка внутри Advantage+ Shopping Campaigns, ограничивающая долю бюджета, которую алгоритм имеет право потратить на действующих клиентов (например, максимум 5-10%).',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Learning Phase Exit Rate',
        industry: 'E-commerce',
        targetBenchmark: '>= 75% бюджета вне Learning Phase',
        dangerZone: '< 50% (высокая волатильность CPA и штраф аукциона)',
        calculation: 'Доля расходов в адсетах с >50 конверсий за 7 дней',
        seniorContext:
          'Если кампания висит в Learning Limited, цена конверсии в среднем на 30-45% выше оптимальной из-за непрерывного поиска паттернов.',
      },
    ],
    researchInsights: [
      {
        source: 'Meta Performance Marketing Summit',
        year: '2023',
        finding:
          'Переход от сегментированной структуры (10+ интересов/LAL) к консолидированной ASC+ снижает медианный CPA на 17% и увеличивает ROAS на 32% за счет устранения самоконкуренции (Auction Overlap).',
        practicalTakeaway:
          'Никогда не запускайте параллельные адсеты с пересекающимися аудиториями в одном кабинете — используйте инструмент Delivery Insights для проверки Auction Overlap.',
      },
    ],
    interviewCases: [
      {
        question:
          'Как устроена ваша идеальная структура аккаунта Meta Ads при месячном бюджете $100,000?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Знание современных стандартов автоматизации (Meta Andromeda/Andes), баланс между ASC+ и тестированием креативов, понимание защиты от каннибализации.',
        antiPatternAnswer:
          '«Я создаю 20 адсетов по интересам, 10 Lookalike аудиторий от 1% до 10% и отдельную ретаргетинг-кампанию».',
        seniorBattleTestedAnswer:
          '«При бюджете $100k/мес я использую структуру 2-3 кампаний: 1) Scaling Engine (ASC+ или CBO Broad): получает 70-80% бюджета. Включает проверенные победители-креативы (Winners) с жестким Existing Customer Cap не более 5-7%; 2) Creative Sandbox (ABO или Dynamic Creative CBO): получает 20-30% бюджета. Здесь тестируются новые гипотезы, хуки и форматы (3-5 новых креативов в неделю). Победители с устойчивым CPA переносятся в скейлинг-кампанию пост-айдишником (Post ID), сохраняя социальное доказательство».',
        probingQuestions: [
          'Что делать, если при переносе Post ID в ASC+ результативность креатива падает?',
          'Как избежать сброса обучения при увеличении бюджета в CBO?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Снизил [X] на [Y]%, консолидировав [Z]',
        template:
          'Консолидировал разрозненную структуру из 35+ адсетов в Advantage+ Shopping Campaigns (ASC+) с Existing Customer Cap, сократив CPA на {Y}% при масштабировании спенда до ${Z}/мес.',
        concreteExample:
          'Перевел аккаунт с бюджетом $120k/мес на консолидированную архитектуру ASC+ с лимитом на действующую базу в 5%, снизив стоимость привлечения нового покупателя (nCPA) на 26% и высвободив $31k маржинальной прибыли.',
        keywords: ['Advantage+ Shopping Campaigns', 'ASC+', 'CBO', 'Auction Overlap', 'Liquidity Consolidation'],
      },
    ],
    quizQuestions: [
      {
        id: '8-1-q1',
        question: 'Сколько целевых конверсий в неделю требуется адсету в Meta Ads для стабильного выхода из Learning Phase?',
        options: ['10-15', '25-30', 'Около 50', 'Не менее 200'],
        correctOptionIndex: 2,
        explanation: 'Алгоритму требуется порядка 50 событий оптимизации за 7-дневное окно для стабилизации градиентного спуска.',
        commonMistake: 'Ориентируются на клики вместо целевых событий или считают, что обучение длится фиксированное время независимо от объема.',
      },
    ],
    longreadMarkdown: `
### Конец эры ручного таргетинга: архитектура ликвидности Meta

Исторически медиабайеры тратили 80% времени на подбор «секретных связок» интересов, скрещивание Lookalike 1% с поведенческими факторами и микро-настройку демографии. Сегодня эта практика не просто устарела — она прямо наносит ущерб бизнесу.

#### Три закона современного алгоритма Meta:
1. **Закон ликвидности:** чем шире выборка пользователей и свободнее бюджет, тем дешевле аукцион находит конвертящегося человека.
2. **Закон пересечения (Auction Overlap):** если вы запустили 10 адсетов с похожими аудиториями, ваши же объявления конкурируют друг с другом, искусственно завышая eCPM на 20-50%.
3. **Креатив как новый таргетинг:** сегодня таргетинг определяется визуалом, первыми 3 секундами видео (Hook) и формулировкой оффера.
    `,
  },
  {
    id: '8-2-broad-targeting-lookalike-dco',
    slug: '8-2-broad-targeting-lookalike-dco',
    courseSlug: 'media-buying',
    moduleId: 8,
    moduleTitle: 'Модуль 2: Meta Ads Ecosystem — ASC+, CBO & Creative Engine',
    lessonNumber: '2.2',
    title: 'Broad таргетинг, Lookalike в эпоху Privacy и Dynamic Creative Optimization (DCO)',
    level: 'Senior',
    readTimeMinutes: 10,
    targetAudience: 'Senior Media Buyers, Performance Marketers',
    summary:
      'Как заставить 100% холодный Broad таргетинг без интересов работать дешевле узких сегментов. Настройка DCO (Dynamic Creative) для модульного сплит-тестирования 3 хуков, 2 витрин и 2 CTA.',
    competencies: ['Enterprise Performance', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'Broad Targeting (Open Targeting)',
        explanation:
          'Таргетинг только по Гео, Возрасту и Полу без каких-либо интересов или Lookalike. Алгоритм полностью полагается на семантический анализ креатива и сигналы пикселя.',
      },
      {
        title: 'DCO (Dynamic Creative Optimization) 3:2:2 Метод',
        explanation:
          'Методология сборки теста: 3 видео/баннера (разные хуки) × 2 текста объявления (разные боли/офферы) × 2 заголовка (Headline).',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'DCO Hook Rate Variance',
        industry: 'General',
        targetBenchmark: '> 2.0x разница между лучшим и худшим хуком',
        dangerZone: '< 1.1x (хуки не создают контраста в восприятии)',
        calculation: '3s Video Views / Impressions',
        seniorContext:
          'Если тест 3 хуков показывает одинаковый Hook Rate, значит креативы визуально вторичны и не цепляют целевые паттерны аудитории.',
      },
    ],
    researchInsights: [
      {
        source: 'Meta Creative Lab Insights',
        year: '2023',
        finding:
          'Замена первых 3 секунд видео при неизменной остальной части ролика меняет итоговый CPA кампании до 300%.',
        practicalTakeaway:
          'Никогда не переснимайте видео целиком, если не протестировали минимум 3-4 альтернативных хука к проверенному телу ролика.',
      },
    ],
    interviewCases: [
      {
        question:
          'Почему при переходе на 100% Broad таргетинг первые 3 дня CPA может быть на 40% выше нормы и что с этим делать?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Понимание алгоритмического исследования пространства аудиторий (Exploration vs Exploitation), хладнокровие и недопустимость панических правок.',
        antiPatternAnswer: '«Срочно выключить кампанию и вернуть старый проверенный Lookalike».',
        seniorBattleTestedAnswer:
          '«На старте Broad алгоритм находится в фазе исследования (Exploration Phase), тестируя различные микро-кластеры многомиллионной аудитории. В этот период eCPM и CPA волатильны. Если креатив сильный, а сигналы пикселя настроены корректно (CAPI с высоким Event Match Quality), к 30-50 конверсиям алгоритм локализует ядро платежеспособных пользователей и стабилизирует CPA. Вмешательство в первые 72 часа только сбросит прогресс градиентного спуска».',
        probingQuestions: [
          'Как отслеживать, в какую демографию уходит бюджет внутри Broad?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Снизил [X] на [Y]%, внедрив методологию [Z]',
        template:
          'Внедрил фреймворк модульного DCO тестирования (3:2:2) и холодный Broad таргетинг, снизив время поиска масштабируемых креативов в {Y} раза и сократив Blended CPA на {Z}%.',
        concreteExample:
          'Перевел медиабаинг на DCO матрицу 3:2:2 на Broad аудитории 18-55, снизив CPA на 24% и запустив 14 масштабируемых связок с суммарным спендом >$500k.',
        keywords: ['Broad Targeting', 'DCO', '3:2:2 Framework', 'Hook Testing', 'Dynamic Creative'],
      },
    ],
    quizQuestions: [
      {
        id: '8-2-q1',
        question: 'Что означает концепция 3:2:2 в методологии Dynamic Creative?',
        options: [
          '3 кампании, 2 адсета, 2 креатива',
          '3 креатива (хука), 2 текста, 2 заголовка в одном динамическом объявлении',
          '3 дня теста, 2 дня анализа, 2 дня масштабирования',
          '3 гео, 2 языка, 2 устройства',
        ],
        correctOptionIndex: 1,
        explanation: '3:2:2 — золотой стандарт модульного тестирования Meta, позволяющий изолировать влияние хука, текста и заголовка.',
        commonMistake: 'Путают структуру объявления с иерархией кампаний в рекламном кабинете.',
      },
    ],
    longreadMarkdown: `
### Механика Broad таргетинга: почему интересы мертвы

После внедрения App Tracking Transparency (iOS 14.5+) пиксель потерял возможность точно отслеживать пользователей за пределами платформы. В ответ Meta полностью перестроила свои нейросети (проекты Andromeda и GEM).

Теперь Meta анализирует:
1. **Компьютерное зрение:** текст на видео, объекты в кадре, цветовую гамму, эмоции лиц.
2. **Аудио-семантику:** распознавание речи (speech-to-text), тембр, фоновые звуки.
3. **Поведение в первые секунды:** кто задержал палец на ленте, кто пропустил, кто включил звук.

**Вывод:** ваш креатив — это и есть ваш таргетинг.
    `,
  },
  {
    id: '8-3-creative-fatigue-hook-rate-iterations',
    slug: '8-3-creative-fatigue-hook-rate-iterations',
    courseSlug: 'media-buying',
    moduleId: 8,
    moduleTitle: 'Модуль 2: Meta Ads Ecosystem — ASC+, CBO & Creative Engine',
    lessonNumber: '2.3',
    title: 'Борьба с Creative Fatigue (усталость креативов), Hook Rate и матрица итераций',
    level: 'Senior',
    readTimeMinutes: 11,
    targetAudience: 'Senior Media Buyers, Creative Strategists, UA Leads',
    summary:
      'Диагностика выгорания креативов: частота (Frequency), First-Time Impression Ratio, скользящий Hook Rate. Конвейер производства итераций креативов без пересъемок: вариации хуков, смена темпа, саундтреков и UGC-персон.',
    competencies: ['Enterprise Performance', 'PMM & Positioning'],
    coreConcepts: [
      {
        title: 'Hook Rate (Thumb-Stop Rate)',
        explanation:
          'Процент пользователей, просмотревших минимум 3 секунды видео от общего числа показов объявления. Главный индикатор привлекательности первого кадра.',
        formulas: ['Hook Rate = 3-Second Video Plays / Impressions × 100%'],
      },
      {
        title: 'Hold Rate (Retention Rate)',
        explanation:
          'Процент пользователей, досмотревших видео до ключевого оффера (15 секунд или 50% длины) среди тех, кто зацепился за хук.',
        formulas: ['Hold Rate = 15-Second Video Plays / 3-Second Video Plays × 100%'],
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Hook Rate Benchmark',
        industry: 'General',
        targetBenchmark: '>= 30-35%',
        dangerZone: '< 18% (креатив моментально свайпается, eCPM растет)',
        calculation: '3s Views / Impressions',
        seniorContext:
          'При Hook Rate 40% вы получаете вдвое больше заинтересованных зрителей за те же деньги, чем конкурент с Hook Rate 20%.',
      },
      {
        metric: 'First-Time Impression Ratio (FTIR)',
        industry: 'E-commerce',
        targetBenchmark: '>= 65-75%',
        dangerZone: '< 40% (креатив выгорел, идет показ одной и той же базе)',
        calculation: 'Доля пользователей, видящих креатив впервые',
        seniorContext:
          'Падение FTIR ниже 40% при росте CPA — верный сигнал Creative Fatigue, требующий немедленного ввода итераций.',
      },
    ],
    researchInsights: [
      {
        source: 'TikTok & Meta Creative Performance Whitepaper',
        year: '2023',
        finding:
          'Креатив с высоким Hook Rate (>35%), но слабым Hold Rate (<25%) генерирует кликбейт и высокий bounce rate на лендинге. Баланс достигается при Hook Rate >30% и Hold Rate >45%.',
        practicalTakeaway:
          'Смотрите на воронку креатива: Hook Rate &rarr; Hold Rate &rarr; CTR &rarr; LP CVR. Место просадки указывает на конкретный дефект ролика.',
      },
    ],
    interviewCases: [
      {
        question:
          'Ваш лучший креатив с бюджетом $2,000/день приносил ROAS 3.5, но за последние 10 дней ROAS опустился до 1.8, а частота выросла до 3.8. Как реанимировать связку за 48 часов?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Умение работать с итерациями: нарезка новых хуков, смена аудиодорожки, изменение формата (1:1 vs 9:16), расширение аудитории без остановки оригинала.',
        antiPatternAnswer: '«Попрошу дизайнера перерисовать с нуля через 2 недели».',
        seniorBattleTestedAnswer:
          '«Это классическое проявление Creative Fatigue. Мой план за 48 часов: 1) Сохраняю проверенное продающее тело ролика (Body) и CTA; 2) Заказываю/нарезаю 4 новых альтернативных хука (UGC распаковка, текстовый хук с контрастным стикером, негативный триггер «Не покупайте X, пока не…», POV-формат); 3) Тестирую эти 4 итерации в DCO песочнице; 4) Дополнительно меняю звуковой ряд (трендовый аудио-трек или закадровый голос) и первые кадры стоп-моушена. Лучшая итерация возвращает связку на целевой ROAS за 2 дня без затрат на полномасштабный продакшн».',
        probingQuestions: [
          'Как использовать First-Time Impression Ratio для прогнозирования выгорания?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Увеличил срок жизни связок в [X] раз за счет матрицы [Y]',
        template:
          'Построил еженедельный конвейер итераций креативов (Hook Matrix), повысив средний Hook Rate с {X}% до {Y}% и продлив жизненный цикл связок с 14 до 45 дней.',
        concreteExample:
          'Разработал матрицу из 5 вариаций хуков и 3 CTA для топ-креативов, подняв Hook Rate до 38% и снизив Blended CPA на 22% при масштабировании до $85k/мес.',
        keywords: ['Creative Fatigue', 'Hook Rate', 'Hold Rate', 'UGC', 'Thumb-Stop Rate'],
      },
    ],
    quizQuestions: [
      {
        id: '8-3-q1',
        question: 'Какая комбинация метрик сигнализирует о Creative Fatigue (выгорании креатива)?',
        options: [
          'Падение CTR, рост частоты (Frequency), падение First-Time Impression Ratio, рост CPA',
          'Рост Hook Rate, падение eCPM, рост конверсии',
          'Снижение бюджета при неизменном ROAS',
          'Рост объема показов при падении кликов',
        ],
        correctOptionIndex: 0,
        explanation: 'Когда одна и та же аудитория видит креатив многократно, падает кликабельность, растет сопротивление и взлетает CPA.',
        commonMistake: 'Смотрят только на итоговый CPA, не отслеживая опережающие индикаторы (Frequency, FTIR, CTR).',
      },
    ],
    longreadMarkdown: `
### Диагностика креатива: где именно ломается конверсия?

\`\`\`
[100% Показов] 
      │
      ▼  (Hook Rate: 3-Second Views / Impressions) — если низкий: скучное начало, нет визуального якоря
[35% Зацепились] 
      │
      ▼  (Hold Rate: 15-Second Views / 3s Views) — если низкий: потеря динамики, скучный сценарий
[15% Досмотрели до оффера] 
      │
      ▼  (CTR: Outbound Clicks / Impressions) — если низкий: невнятный призыв к действию (CTA)
[2.5% Перешли на сайт] 
      │
      ▼  (CR лендинга: Purchases / Clicks) — если низкий: несовпадение ожиданий (Message Mismatch)
[0.2% Купили]
\`\`\`
    `,
  },
];
