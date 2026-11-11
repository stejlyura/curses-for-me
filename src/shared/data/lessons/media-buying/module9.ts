import { Lesson } from '@/entities/lesson';

export const module9Lessons: Lesson[] = [
  {
    id: '9-1-google-search-alpha-beta-match-types',
    slug: '9-1-google-search-alpha-beta-match-types',
    courseSlug: 'media-buying',
    moduleId: 9,
    moduleTitle: 'Модуль 3: Google Ads — Search, PMax & YouTube Ads',
    lessonNumber: '3.1',
    title: 'Архитектура аккаунта Google Ads: Alpha/Beta кампании, SKAG vs STAG и типы соответствия',
    level: 'Senior',
    readTimeMinutes: 11,
    targetAudience: 'Senior PPC Specialists, Search Leads, Performance Marketers',
    summary:
      'Почему классический SKAG (Single Keyword Ad Groups) мертв после реформы Exact Match. Архитектура STAG (Single Theme Ad Groups) и Alpha/Beta воронка: как автоматический Broad Match с Smart Bidding добывает конвертящие запросы в связке с точным соответствием.',
    competencies: ['Enterprise Performance', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'Alpha/Beta Account Architecture',
        explanation:
          'Двухуровневая модель: Beta-кампания (широкое и фразовое соответствие с tCPA для поиска новых поисковых запросов) + Alpha-кампания (строго точное соответствие [Exact] с повышенным бидом для проверенных конвертеров).',
      },
      {
        title: 'STAG (Single Theme Ad Groups)',
        explanation:
          'Группировка 5-15 семантически близких ключевых слов вокруг единого интента пользователя, обеспечивающая релевантность Responsive Search Ads (RSA) и высокий Ad Strength.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'Search Impression Share (IS)',
        industry: 'B2B SaaS',
        targetBenchmark: '>= 75-85% на Alpha (Exact) кампаниях',
        dangerZone: '< 50% (потеря горячей аудитории конкурентам)',
        calculation: 'Impressions / Total Eligible Impressions',
        seniorContext:
          'Если на точных конвертящих ключах потеря Impression Share идет из-за ранга (Rank), нужно повышать tCPA или улучшать Quality Score посадочной страницы.',
      },
    ],
    researchInsights: [
      {
        source: 'Google Search Ads Engineering Update',
        year: '2023',
        finding:
          '15% всех ежедневных поисковых запросов в Google — уникальны и никогда ранее не вводились. Жесткая фиксация только на точных ключах лишает бизнес 30-40% конверсионного трафика.',
        practicalTakeaway:
          'Используйте связку Broad Match + Smart Bidding (tCPA/tROAS) в качестве Beta-кампании, но обязательно исключайте ключевики Alpha через списки минус-слов (Negative Lists).',
      },
    ],
    interviewCases: [
      {
        question:
          'Клиент требует вернуть структуру SKAG с 1000 кампаний в Google Search. Как аргументировать переход на STAG и защитить свое решение на уровне данных?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Понимание работы алгоритмов Smart Bidding, проблемы размытия данных (Data Fragmentation) и Close Variants в современном Google Ads.',
        antiPatternAnswer: '«SKAG устарел, потому что так сказали на вебинаре».',
        seniorBattleTestedAnswer:
          '«Я объясню клиенту математику Smart Bidding: современный алгоритм Google учитывает миллионы сигналов на уровне аукциона (контекст, устройство, история пользователя, гео, время). При структуре SKAG данные о конверсиях дробятся на сотни групп, ни одна из которых не набирает 30-50 конверсий в месяц для качественного машинного обучения. Более того, с внедрением Close Variants даже [Exact Match] триггерится по синонимам. Переход на STAG консолидирует сигналы, дает алгоритму достаточный объем обучающей выборки и позволяет поднять качество объявлений RSA до Excellent, снизив фактический CPC на 15-25%».',
        probingQuestions: [
          'Как часто вы проводите майнинг поисковых отчетов (Search Terms Mining)?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Перестроил структуру поиска Google Ads, снизив CPC на [X]% и увеличив [Y]',
        template:
          'Реорганизовал устаревшую SKAG архитектуру Google Ads в STAG Alpha/Beta воронку, снизив средний CPC на {X}% и увеличив объем квалифицированных поисковых лидов на {Y}%.',
        concreteExample:
          'Перевел поисковые кампании Enterprise SaaS продукта на Alpha/Beta STAG структуру, снизив затраты на нерелевантные поисковые запросы на 34% и увеличив Search Impression Share до 82%.',
        keywords: ['Google Search Ads', 'STAG', 'Alpha/Beta', 'Smart Bidding', 'Search Impression Share'],
      },
    ],
    quizQuestions: [
      {
        id: '9-1-q1',
        question: 'Почему классическая структура SKAG (Single Keyword Ad Group) стала неэффективной в современном Google Ads?',
        options: [
          'Google запретил создавать больше 10 адсетов',
          'Close Variants размыли строгое точное соответствие, а дробление данных лишает Smart Bidding сигналов для обучения',
          'В Google Ads исчезла возможность назначать ручные ставки',
          'Все поисковые кампании автоматически конвертируются в Performance Max',
        ],
        correctOptionIndex: 1,
        explanation: 'Дробление данных на одиночные ключи мешает алгоритму Smart Bidding собирать достаточный объем сигналов для аукциона.',
        commonMistake: 'Полагают, что точное соответствие до сих пор работает абсолютно строго символ-в-символ без учета синонимов.',
      },
    ],
    longreadMarkdown: `
### Эволюция соответствий в Google Поиске

\`\`\`
1. [Exact Match]: исторически строго запрос = ключ. Сегодня: включает Close Variants (смысловые близкие аналоги, орфографические вариации).
2. "Phrase Match": поглотил модификатор широкого соответствия (+broad +match +modifier). Сохраняет базовый порядок и интент.
3. Broad Match: максимальный охват, работает ТОЛЬКО в связке с автоматическими стратегиями (tCPA / tROAS) и регулярной чисткой Search Terms.
\`\`\`
    `,
  },
  {
    id: '9-2-performance-max-signals-negative-scripts',
    slug: '9-2-performance-max-signals-negative-scripts',
    courseSlug: 'media-buying',
    moduleId: 9,
    moduleTitle: 'Модуль 3: Google Ads — Search, PMax & YouTube Ads',
    lessonNumber: '3.2',
    title: 'Performance Max под капотом: сигналы аудиторий, защита от мусорного трафика и скрипты исключения брендового каннибализма',
    level: 'Senior',
    readTimeMinutes: 12,
    targetAudience: 'Senior PPC Specialists, Performance Leads',
    summary:
      'Черный ящик Performance Max: где PMax на самом деле тратит деньги (Search, Shopping, Display, YouTube). Как принудительно исключить собственный брендовый трафик через Brand Lists / Account-Level Negatives, настроить сигналы аудиторий (Customer Match) и подключить скрипты анализа плейсментов.',
    competencies: ['Enterprise Performance', 'Data & A/B Rigor'],
    coreConcepts: [
      {
        title: 'Brand Cannibalization в PMax',
        explanation:
          'Тенденция алгоритма PMax выкупать брендовый поиск компании вместо привлечения холодных пользователей, чтобы искусственно завысить итоговый ROAS кампании.',
      },
      {
        title: 'PMax Audience Signals (Сигналы аудиторий)',
        explanation:
          'Подсказки алгоритму на старте (Customer Match базы LTV-покупателей, Custom Intent по ключевым запросам конкурентов), ускоряющие локализацию целевой аудитории.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'PMax Search vs Video/Display Spend Ratio',
        industry: 'E-commerce',
        targetBenchmark: 'Search/Shopping >= 70%, Video/Display <= 30%',
        dangerZone: 'Display/Spam Apps > 40% (слив бюджета на мусорные клики в мобильных играх)',
        calculation: 'Анализ распределения спенда через кастомные Google Ads скрипты',
        seniorContext:
          'Без скриптового мониторинга PMax может слить тысячи долларов на спам-клики в приложениях для фонариков и детских играх.',
      },
    ],
    researchInsights: [
      {
        source: 'Smarter Ecommerce (smec) PMax Benchmark Report',
        year: '2023',
        finding:
          'В кампаниях PMax без исключения брендовых запросов до 65% всех транзакций приходится на поисковые запросы, содержащие название собственного бренда рекламодателя.',
        practicalTakeaway:
          'Всегда используйте настройку «Brand Exclusion List» на уровне кампании или подавайте заявку саппорту Google на добавление брендовых минус-слов в PMax.',
      },
    ],
    interviewCases: [
      {
        question:
          'Как заглянуть внутрь черного ящика Performance Max и определить, какую долю бюджета кампания тратит на поиск, шопинг, видео и мусорные баннеры в AdSense?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Знание Google Ads Scripts (например, PMax Spend Allocation Script от Mike Rhodes), понимание отчета о плейсментах и методов борьбы с мобильным спамом.',
        antiPatternAnswer: '«Google не показывает эти данные, приходится верить общему ROAS».',
        seniorBattleTestedAnswer:
          '«Google действительно скрывает прямое распределение в UI, но эти данные доступны через Google Ads API и BigQuery. Я использую проверенный open-source скрипт PMax Spend Allocation (Mike Rhodes), который через скрытые каналы API раскладывает суточный спенд на 4 корзины: Shopping, Search, Video и Network (Display/Apps). Если доля Network превышает 15-20%, я исключаю нерелевантные мобильные плейсменты на уровне аккаунта (Placement Exclusion Lists) и отключаю автоматически создаваемые видеоресурсы (Video Enhancements)».',
        probingQuestions: [
          'Как правильно настраивать Asset Groups внутри одной кампании PMax?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Снизил долю мусорного трафика в PMax на [X]%, повысив реальный [Y]',
        template:
          'Внедрил скриптовый аудит Performance Max кампаний и настроил Brand Exclusion списки, сократив неинкрементальный расход на {X}% и подняв чистый New Customer ROAS на {Y}%.',
        concreteExample:
          'Изолировал брендовый трафик из Performance Max кампаний с бюджетом $70k/мес, предотвратив каннибализацию и повысив маржинальную рентабельность шопинг-направления на 31%.',
        keywords: ['Performance Max', 'PMax', 'Brand Exclusion', 'Audience Signals', 'Asset Groups'],
      },
    ],
    quizQuestions: [
      {
        id: '9-2-q1',
        question: 'Какой основной риск таит в себе запуск Performance Max без настройки Brand Exclusion List?',
        options: [
          'Объявления будут показываться только в Gmail',
          'PMax начнет выкупать брендовый поиск компании, искусственно завышая ROAS и каннибализируя органику',
          'Кампания будет отклонена модерацией',
          'Бюджет не сможет откручиваться быстрее $10 в день',
        ],
        correctOptionIndex: 1,
        explanation: 'Алгоритм PMax оптимизирует легкие конверсии. Запросы по собственному бренду конвертируются лучше всего, и кампания забирает их себе.',
        commonMistake: 'Считают, что PMax автоматически знает, какие запросы брендовые, и не трогает их.',
      },
    ],
    longreadMarkdown: `
### Анатомия Performance Max: управление черным ящиком

Performance Max — это мультиканальный комбайн Google, объединяющий 6 рекламных сетей:
1. Google Search
2. Google Shopping (Free & Paid)
3. YouTube (In-Feed & Shorts)
4. Google Display Network (GDN)
5. Discover Feed
6. Gmail

#### Чек-лист защиты бюджета в PMax:
* [x] **Brand Exclusion List:** принудительно запретить выкуп своего бренда.
* [x] **Placement Exclusions:** на уровне аккаунта исключить 140+ категорий мобильных приложений (com.app.*).
* [x] **Customer Match Signals:** загрузить базу топ-10% клиентов по LTV с хешированием email.
* [x] **URL Expansion Settings:** отключить автоматическую замену конечного URL, если сайт имеет нерелевантные блоговые страницы.
    `,
  },
  {
    id: '9-3-youtube-ads-demand-gen-abcds',
    slug: '9-3-youtube-ads-demand-gen-abcds',
    courseSlug: 'media-buying',
    moduleId: 9,
    moduleTitle: 'Модуль 3: Google Ads — Search, PMax & YouTube Ads',
    lessonNumber: '3.3',
    title: 'YouTube Ads & Demand Gen: хуки, ABCDs фреймворк креативов и расчет CPV/CPA для видео',
    level: 'Senior',
    readTimeMinutes: 10,
    targetAudience: 'Senior Media Buyers, Video UA Leads, Performance Marketers',
    summary:
      'Построение перформанс-воронок на YouTube и Demand Gen. Фреймворк создания видео Google ABCDs (Attention, Branding, Connection, Direction). Экономика видео-трафика: CPV, View Rate, View-Through Conversions и оптимизация под In-Stream skippable форматы.',
    competencies: ['Enterprise Performance', 'PMM & Positioning'],
    coreConcepts: [
      {
        title: 'Google ABCDs Framework',
        explanation:
          'Официальный стандарт высококонверсионных видеокреативов: Attention (захват внимания в первые 5 секунд), Branding (ранняя интеграция бренда), Connection (эмоциональная связь через сторителлинг), Direction (четкий и конкретный призыв к действию).',
      },
      {
        title: 'Demand Gen Campaigns',
        explanation:
          'Новый видео-ориентированный формат Google, объединяющий YouTube Shorts, In-Stream, Discover и Gmail с таргетингом на Lookalike сегменты на основе баз данных первого порядка.',
      },
    ],
    benchmarkMetrics: [
      {
        metric: 'YouTube View Rate (VTR)',
        industry: 'General',
        targetBenchmark: '>= 25-35% (In-Stream Skippable)',
        dangerZone: '< 15% (скучный хук первых 5 секунд)',
        calculation: 'Views (просмотрено >30 сек или клик) / Impressions',
        seniorContext:
          'Если зритель скипает видео до 30 секунд (и не кликает), Google не списывает деньги за показ в формате TrueView In-Stream, что дает бесплатный брендинг.',
      },
    ],
    researchInsights: [
      {
        source: 'Google & Kantar Creative Effectiveness Study',
        year: '2023',
        finding:
          'Ролики, строго следующие фреймворку ABCDs, демонстрируют на 30% более высокую вероятность генерации краткосрочных продаж и на 17% более сильный вклад в долгосрочную ценность бренда.',
        practicalTakeaway:
          'Бренд и ключевое УТП должны появиться в кадре до 5-й секунды (до того, как станет активна кнопка «Пропустить»).',
      },
    ],
    interviewCases: [
      {
        question:
          'Вы запускаете YouTube Ads для дорогого B2B SaaS продукта ($5,000 ARR). Как построить структуру кампании и сценарий видео, чтобы не слить бюджет на случайных зрителей развлекательных каналов?',
        difficulty: 'Senior',
        whatInterviewerLooksFor:
          'Использование квалифицирующих хуков (Disqualifying Hooks), таргетинг по Custom Intent (поисковые запросы в Google), исключение детского контента.',
        antiPatternAnswer: '«Снимем красивый вирусный ролик и запустим на широкую мужскую аудиторию 25-45».',
        seniorBattleTestedAnswer:
          '«Для B2B на YouTube ключ — преднамеренная дисквалификация нецелевых зрителей в первые 5 секунд: «Если вы не финансовый директор или VP of Sales компании с оборотом от $10M, нажмите кнопку пропустить прямо сейчас». Это отсекает нецелевые просмотры до 30-й секунды (экономит бюджет). В плане таргетинга: 1) Custom Intent сегменты по ключевым поисковым запросам коммерческих конкурентов; 2) Списки Customer Match; 3) Жесткое исключение плейсментов: каналы для детей, музыкальные клипы, игровой стриминг; 4) Формат: Demand Gen с фокусом на лид-формы или лендинг с интерактивным калькулятором ROI».',
        probingQuestions: [
          'Как Demand Gen Lookalike аудитории отличаются от Meta Lookalike?',
        ],
      },
    ],
    resumeBullets: [
      {
        formula: 'Запустил видео-перформанс канал в YouTube, снизив CPA на [X]%',
        template:
          'Масштабировал привлечение через YouTube Ads и Demand Gen по фреймворку ABCDs, обеспечив привлечение {X} квалифицированных лидов по CPA на {Y}% ниже среднего по поиску.',
        concreteExample:
          'Выстроил видео-воронку в YouTube Ads с бюджетом $40k/мес, внедрив дисквалифицирующие хуки и Custom Intent аудитории, что дало 420+ B2B демо по стоимости на 28% дешевле поискового контекста.',
        keywords: ['YouTube Ads', 'ABCDs Framework', 'Demand Gen', 'View Rate', 'TrueView'],
      },
    ],
    quizQuestions: [
      {
        id: '9-3-q1',
        question: 'Что списывает Google с рекламодателя, если пользователь нажал «Пропустить» (Skip) на 7-й секунде In-Stream Skippable видео?',
        options: [
          'Полную стоимость за клик (Max CPC)',
          'Пропорциональную стоимость за 7 секунд',
          '0$ — просмотр бесплатен, так как не достигнут порог 30 секунд или клик',
          'Фиксированный штраф за скип',
        ],
        correctOptionIndex: 2,
        explanation: 'В формате skippable in-stream рекламодатель платит только в случае просмотра 30 секунд (или всего ролика, если он короче) либо при клике.',
        commonMistake: 'Считают, что оплата списывается за каждый показ независимо от времени скипа.',
      },
    ],
    longreadMarkdown: `
### Google ABCDs Фреймворк: чек-лист сценария

\`\`\`
[0:00 - 0:05] A - Attention:
- Визуальный хук (динамичное движение, неожиданный кадр).
- Озвучивание ключевой боли целевого сегмента.

[0:05 - 0:10] B - Branding:
- Появление логотипа, продукта в руках или названия компании на экране.
- Персонаж называет бренд голосом.

[0:10 - 0:25] C - Connection:
- Демонстрация проблемы «До» и решения «После».
- Социальное доказательство (метрика, отзыв клиента).

[0:25 - 0:30+] D - Direction:
- Конкретный шаг: «Перейдите по ссылке и рассчитайте ваш ROAS».
- Фиксация оффера на финальной заставке.
\`\`\`
    `,
  },
];
